import { useRef, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import { latLngToVector3 } from './geoUtils';

/* ---------- types ---------- */
interface GeoFeature {
  type: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

/** A grouping of polygons for rendering */
interface PolygonGroup {
  name: string; // state name or district name
  parentState?: string; // only used for districts
  rings: number[][][]; // Each ring is an array of [lng, lat] coordinates
}

interface IndiaGlobeProps {
  userState?: string;
  onStateSelect?: (state: string | null) => void;
}

/* ---------- constants ---------- */
const GLOBE_RADIUS = 2;
const INDIA_CENTER = { lat: 22, lng: 79 };

const TOPOJSON_URL =
  'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/topojson/india.json';

/* ---------- helpers ---------- */

/** Parse GeoJSON features into PolygonGroups */
function parseFeatures(
  features: GeoFeature[],
  nameProp: string,
  parentProp?: string
): PolygonGroup[] {
  const map = new Map<string, PolygonGroup>();

  for (const feature of features) {
    const name = (feature.properties[nameProp] as string) ?? '';
    if (!name) continue;

    if (!map.has(name)) {
      map.set(name, {
        name,
        parentState: parentProp ? (feature.properties[parentProp] as string) : undefined,
        rings: [],
      });
    }
    const groupRings = map.get(name)!.rings;

    const { type, coordinates } = feature.geometry;
    if (type === 'MultiPolygon') {
      (coordinates as number[][][][]).forEach((poly) => {
        poly.forEach((ring) => groupRings.push(ring));
      });
    } else if (type === 'Polygon') {
      (coordinates as number[][][]).forEach((ring) => groupRings.push(ring));
    }
  }

  return Array.from(map.values());
}

/* reduce coord density – keep every nth point */
function simplifyCoords(coords: number[][], nth = 3): number[][] {
  if (coords.length <= 20) return coords;
  const result: number[][] = [];
  for (let i = 0; i < coords.length; i++) {
    if (i % nth === 0 || i === coords.length - 1) result.push(coords[i]);
  }
  return result;
}

/* ---------- Meshes & Lines Generators ---------- */
function buildLinesData(
  groups: PolygonGroup[],
  userState: string | undefined,
  hoveredEntity: string | null,
  isStateLevel: boolean
) {
  const items: { key: string; points: THREE.Vector3[]; name: string; isUser: boolean; isHovered: boolean }[] = [];
  let idx = 0;

  for (const group of groups) {
    const isUser = isStateLevel ? group.name === userState : group.parentState === userState;
    const isHovered = hoveredEntity === group.name;

    for (const ring of group.rings) {
      const simplified = simplifyCoords(ring, isUser || isHovered ? 1 : 3);
      const pts = simplified.map(([lng, lat]) =>
        latLngToVector3(lat, lng, GLOBE_RADIUS, 0.003)
      );
      if (pts.length > 2) {
        items.push({
          key: `border-${group.name}-${idx++}`,
          points: pts,
          name: group.name,
          isUser,
          isHovered,
        });
      }
    }
  }
  return items;
}

function buildFillsData(
  groups: PolygonGroup[],
  userState: string | undefined,
  isStateLevel: boolean
) {
  const items: { key: string; geometry: THREE.BufferGeometry; name: string; isUser: boolean }[] = [];
  let idx = 0;

  for (const group of groups) {
    const isUser = isStateLevel ? group.name === userState : group.parentState === userState;

    for (const ring of group.rings) {
      const simplified = simplifyCoords(ring, isUser ? 1 : 3);
      const pts = simplified.map(([lng, lat]) =>
        latLngToVector3(lat, lng, GLOBE_RADIUS, 0.002)
      );
      if (pts.length < 3) continue;

      const centroid = new THREE.Vector3();
      pts.forEach((p) => centroid.add(p));
      centroid.divideScalar(pts.length);
      centroid.normalize().multiplyScalar(GLOBE_RADIUS + 0.002);

      const verts: number[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        verts.push(
          centroid.x, centroid.y, centroid.z,
          pts[i].x, pts[i].y, pts[i].z,
          pts[i + 1].x, pts[i + 1].y, pts[i + 1].z
        );
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.computeVertexNormals();

      items.push({
        key: `fill-${group.name}-${idx++}`,
        geometry: geo,
        name: group.name,
        isUser,
      });
    }
  }
  return items;
}

/* ---------- Map Fills Component ---------- */
function MapFills({
  groups,
  userState,
  isStateLevel,
  hoveredEntity,
  onHover,
  onClick,
}: {
  groups: PolygonGroup[];
  userState?: string;
  isStateLevel: boolean;
  hoveredEntity: string | null;
  onHover: (name: string | null) => void;
  onClick?: (name: string) => void;
}) {
  const meshes = useMemo(() => buildFillsData(groups, userState, isStateLevel), [groups, userState, isStateLevel]);

  return (
    <group>
      {meshes.map(({ key, geometry, name, isUser }) => {
        const isHovered = hoveredEntity === name;
        return (
          <mesh
            key={key}
            geometry={geometry}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(name);
            }}
            onPointerOut={() => onHover(null)}
            onClick={(e) => {
              if (onClick) {
                e.stopPropagation();
                onClick(name);
              }
            }}
          >
            <meshBasicMaterial
              color={isUser ? '#ff9933' : isHovered ? '#60a5fa' : '#1e3a8a'}
              transparent
              opacity={isUser ? 0.5 : isHovered ? 0.3 : 0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------- Map Borders Component ---------- */
function MapBorders({
  groups,
  userState,
  hoveredEntity,
  isStateLevel,
  opacityMultiplier = 1.0,
}: {
  groups: PolygonGroup[];
  userState?: string;
  hoveredEntity: string | null;
  isStateLevel: boolean;
  opacityMultiplier?: number;
}) {
  const linesData = useMemo(
    () => buildLinesData(groups, userState, hoveredEntity, isStateLevel),
    [groups, userState, hoveredEntity, isStateLevel]
  );

  return (
    <group>
      {linesData.map(({ key, points, isUser, isHovered }) => {
        const color = isUser ? '#ff9933' : isHovered ? '#93c5fd' : 'rgba(148, 163, 184, 0.6)';
        const lineWidth = isUser ? 2.5 : isHovered ? 2 : 1;
        const opacity = (isUser ? 1 : 0.65) * opacityMultiplier;

        return (
          <line key={key}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} linewidth={lineWidth} transparent opacity={opacity} />
          </line>
        );
      })}
    </group>
  );
}

/* ---------- Atmosphere glow ---------- */
function Atmosphere() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
  `;

  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  );
}

/* ---------- Globe sphere ---------- */
function GlobeSphere() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <meshPhongMaterial
        color="#0a1628"
        emissive="#050d1a"
        specular="#1a2d50"
        shininess={25}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

/* ---------- Graticule (lat/lng grid) ---------- */
function Graticule() {
  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 5) {
        pts.push(latLngToVector3(lat, lng, GLOBE_RADIUS, 0.001));
      }
      result.push(pts);
    }
    for (let lng = -180; lng < 180; lng += 15) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        pts.push(latLngToVector3(lat, lng, GLOBE_RADIUS, 0.001));
      }
      result.push(pts);
    }
    return result;
  }, []);

  return (
    <group>
      {lines.map((pts, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e293b" transparent opacity={0.35} />
        </line>
      ))}
    </group>
  );
}

/* ---------- Initial camera position ---------- */
function GlobeController() {
  const { camera } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const phi = (90 - INDIA_CENTER.lat) * (Math.PI / 180);
      const theta = (INDIA_CENTER.lng + 180) * (Math.PI / 180);
      const distance = 3.5; // Starts closer to India map
      camera.position.set(
        -distance * Math.sin(phi) * Math.cos(theta),
        distance * Math.cos(phi),
        distance * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(0, 0, 0);
      initialized.current = true;
    }
  }, [camera]);

  return null;
}

/* ---------- Main Globe Scene (With Interaction Logic) ---------- */
function InteractiveScene({
  stateGroups,
  districtGroups,
  userState,
  hoveredEntity,
  setHoveredEntity,
  selectedState,
  setSelectedState,
}: {
  stateGroups: PolygonGroup[];
  districtGroups: PolygonGroup[];
  userState?: string;
  hoveredEntity: string | null;
  setHoveredEntity: (name: string | null) => void;
  selectedState: string | null;
  setSelectedState: (name: string | null) => void;
}) {
  const mainGlobeRef = useRef<THREE.Group>(null);
  const detachedStateRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);

  const selectedCentroid = useMemo(() => {
    if (!selectedState || stateGroups.length === 0) return null;
    const group = stateGroups.find(g => g.name === selectedState);
    if (!group) return null;
    let latSum = 0, lngSum = 0, count = 0;
    group.rings.forEach(ring => {
      ring.forEach(([lng, lat]) => {
        latSum += lat;
        lngSum += lng;
        count++;
      });
    });
    if (count === 0) return null;
    return latLngToVector3(latSum/count, lngSum/count, GLOBE_RADIUS, 0);
  }, [selectedState, stateGroups]);

  // When a state is selected, filter out its districts
  const detachedDistricts = useMemo(() => {
    if (!selectedState) return [];
    return districtGroups.filter((g) => g.parentState === selectedState);
  }, [districtGroups, selectedState]);

  // Animation loop
  useFrame(() => {
    // If a state is selected, the main globe hides, and the selected state group rotates 
    // to face the camera and scales up. This avoids fighting OrbitControls.
    if (mainGlobeRef.current) {
      const targetScale = selectedState ? new THREE.Vector3(0.001, 0.001, 0.001) : new THREE.Vector3(1, 1, 1);
      mainGlobeRef.current.scale.lerp(targetScale, 0.08);
      mainGlobeRef.current.visible = mainGlobeRef.current.scale.x > 0.05 || !selectedState;
    }

    if (detachedStateRef.current) {
      if (selectedState && selectedCentroid) {
        // Find rotation needed to move centroid to (0, 0, GLOBE_RADIUS)
        const currentCentroid = selectedCentroid.clone();
        const targetPoint = new THREE.Vector3(0, 0, GLOBE_RADIUS);
        
        const q = new THREE.Quaternion().setFromUnitVectors(
          currentCentroid.normalize(),
          targetPoint.normalize()
        );

        // Apply rotation and scale up so it "takes up the screen"
        detachedStateRef.current.quaternion.slerp(q, 0.08);
        detachedStateRef.current.scale.lerp(new THREE.Vector3(1.7, 1.7, 1.7), 0.08);
      } else {
        // Return to original state
        detachedStateRef.current.quaternion.slerp(new THREE.Quaternion(), 0.08);
        detachedStateRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#3b82f6" />

      <GlobeController />

      {/* Main Globe */}
      <group ref={mainGlobeRef} onClick={() => selectedState && setSelectedState(null)}>
        <GlobeSphere />
        <Atmosphere />
        <Graticule />
        <MapFills
          groups={stateGroups}
          userState={userState}
          isStateLevel={true}
          hoveredEntity={selectedState ? null : hoveredEntity}
          onHover={selectedState ? () => {} : setHoveredEntity}
          onClick={(name) => setSelectedState(name)}
        />
        <MapBorders
          groups={stateGroups}
          userState={userState}
          isStateLevel={true}
          hoveredEntity={selectedState ? null : hoveredEntity}
          opacityMultiplier={selectedState ? 0.3 : 1.0}
        />
      </group>

      {/* Detached State */}
      <group ref={detachedStateRef}>
        {selectedState && (
          <>
            <MapFills
              groups={detachedDistricts}
              userState={userState}
              isStateLevel={false}
              hoveredEntity={hoveredEntity}
              onHover={setHoveredEntity}
              onClick={() => setSelectedState(null)} // click again to dismiss
            />
            <MapBorders
              groups={detachedDistricts}
              userState={userState}
              isStateLevel={false}
              hoveredEntity={hoveredEntity}
              opacityMultiplier={1.0}
            />
          </>
        )}
      </group>

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={2.1}
        maxDistance={12}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        autoRotate={false}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

/* ---------- Tooltip overlay ---------- */
function Tooltip({
  entityName,
  isUserState,
  selectedState,
}: {
  entityName: string | null;
  isUserState: boolean;
  selectedState: string | null;
}) {
  const { t } = useTranslation();
  if (!entityName) return null;

  const label = selectedState ? t('globe.constituency', { name: entityName }) : t('globe.state', { name: entityName });

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 24px',
        background: isUserState
          ? 'linear-gradient(135deg, rgba(255,153,51,0.25), rgba(245,158,11,0.25))'
          : 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isUserState ? 'rgba(255,153,51,0.5)' : 'rgba(241,245,249,0.1)'}`,
        borderRadius: '12px',
        color: '#f1f5f9',
        fontSize: '0.95rem',
        fontWeight: 600,
        pointerEvents: 'none',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
      }}
    >
      {isUserState && <span style={{ fontSize: '1.1rem' }}>📍</span>}
      {label}
      {isUserState && !selectedState && (
        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#ff9933', marginLeft: '4px' }}>
          {t('globe.your_state')}
        </span>
      )}
    </div>
  );
}

/* ---------- Loading ---------- */
function LoadingOverlay() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.9)',
        zIndex: 20,
        gap: '16px',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(255,153,51,0.2)',
          borderTopColor: '#ff9933',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{t('globe.loading_map')}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function IndiaGlobe({ userState, onStateSelect }: IndiaGlobeProps) {
  const { t } = useTranslation();
  const [stateGroups, setStateGroups] = useState<PolygonGroup[]>([]);
  const [districtGroups, setDistrictGroups] = useState<PolygonGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(TOPOJSON_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const topology = await res.json();
        
        if (!cancelled) {
          // Convert TopoJSON to GeoJSON FeatureCollections
          const statesGeo = topojson.feature(topology, topology.objects.states) as unknown as FeatureCollection;
          const districtsGeo = topojson.feature(topology, topology.objects.districts) as unknown as FeatureCollection;

          // Parse into renderable polygon groups
          const sGroups = parseFeatures(statesGeo.features, 'st_nm');
          const dGroups = parseFeatures(districtsGeo.features, 'district', 'st_nm');

          setStateGroups(sGroups);
          setDistrictGroups(dGroups);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'Failed to load map data');
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync state upward
  useEffect(() => {
    if (onStateSelect) {
      onStateSelect(selectedState);
    }
  }, [selectedState, onStateSelect]);

  if (error) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '2rem' }}>⚠️</span>
        <p>{t('globe.failed_load', { error })}</p>
      </div>
    );
  }

  // Determine if the currently hovered entity belongs to the user's state
  const isHoveredUser = useMemo(() => {
    if (!hoveredEntity) return false;
    if (selectedState) {
      const group = districtGroups.find(g => g.name === hoveredEntity);
      return group?.parentState === userState;
    } else {
      return hoveredEntity === userState;
    }
  }, [hoveredEntity, selectedState, userState, districtGroups]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '20px', overflow: 'hidden' }}>
      {loading && <LoadingOverlay />}

      <Tooltip
        entityName={hoveredEntity}
        isUserState={isHoveredUser}
        selectedState={selectedState}
      />

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '12px 16px',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          border: '1px solid rgba(241,245,249,0.08)',
          zIndex: 10,
          fontSize: '0.8rem',
          color: '#94a3b8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff9933', boxShadow: '0 0 8px rgba(255,153,51,0.5)' }} />
          <span>{t('globe.your_state')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#1e3a8a', border: '1px solid #3b82f6' }} />
          <span>{t('globe.other_states')}</span>
        </div>
      </div>

      {/* Interaction hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          padding: '8px 14px',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '10px',
          border: '1px solid rgba(241,245,249,0.08)',
          zIndex: 10,
          fontSize: '0.75rem',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {selectedState ? t('globe.click_close') : t('globe.click_state')}
      </div>

      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        style={{ background: 'transparent' }} 
        dpr={[1, 2]}
        onPointerMissed={() => selectedState && setSelectedState(null)}
      >
        {!loading && stateGroups.length > 0 && (
          <InteractiveScene
            stateGroups={stateGroups}
            districtGroups={districtGroups}
            userState={userState}
            hoveredEntity={hoveredEntity}
            setHoveredEntity={setHoveredEntity}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
          />
        )}
      </Canvas>
    </div>
  );
}

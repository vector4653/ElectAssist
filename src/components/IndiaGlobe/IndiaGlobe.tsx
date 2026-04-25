import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { latLngToVector3 } from './geoUtils';

/* ---------- types ---------- */
interface GeoFeature {
  type: string;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

/** A state-level grouping of all district polygons */
interface StateGroup {
  name: string;
  rings: number[][][]; // Each ring is an array of [lng, lat] coordinates
}

interface IndiaGlobeProps {
  userState?: string;
}

/* ---------- constants ---------- */
const GLOBE_RADIUS = 2;
const INDIA_CENTER = { lat: 22, lng: 79 };

// New GeoJSON source – has all 36 states/UTs including Telangana,
// and shows India's official boundaries (J&K includes POK, Ladakh includes Aksai Chin)
const GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/india.geojson';

/* ---------- helpers ---------- */

/** Merge district-level features into state-level groups */
function groupByState(features: GeoFeature[]): StateGroup[] {
  const map = new Map<string, number[][][]>();

  for (const feature of features) {
    const stateName = (feature.properties.st_nm as string) ?? '';
    if (!stateName) continue;

    if (!map.has(stateName)) map.set(stateName, []);
    const stateRings = map.get(stateName)!;

    const { type, coordinates } = feature.geometry;

    if (type === 'MultiPolygon') {
      (coordinates as number[][][][]).forEach((poly) => {
        poly.forEach((ring) => stateRings.push(ring));
      });
    } else {
      // Polygon
      (coordinates as number[][][]).forEach((ring) => stateRings.push(ring));
    }
  }

  return Array.from(map.entries()).map(([name, rings]) => ({ name, rings }));
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

/* ---------- State Borders ---------- */
function StateBorders({
  stateGroups,
  userState,
  hoveredState,
}: {
  stateGroups: StateGroup[];
  userState?: string;
  hoveredState: string | null;
}) {
  const linesData = useMemo(() => {
    const items: {
      key: string;
      points: THREE.Vector3[];
      name: string;
      isUser: boolean;
    }[] = [];
    let idx = 0;

    for (const group of stateGroups) {
      const isUser = group.name === userState;

      for (const ring of group.rings) {
        const simplified = simplifyCoords(ring, isUser ? 1 : 3);
        const pts = simplified.map(([lng, lat]) =>
          latLngToVector3(lat, lng, GLOBE_RADIUS, 0.003)
        );
        if (pts.length > 2) {
          items.push({
            key: `border-${group.name}-${idx++}`,
            points: pts,
            name: group.name,
            isUser,
          });
        }
      }
    }
    return items;
  }, [stateGroups, userState]);

  return (
    <group>
      {linesData.map(({ key, points, name, isUser }) => {
        const isHovered = hoveredState === name;
        const color = isUser
          ? '#ff9933'
          : isHovered
          ? '#60a5fa'
          : 'rgba(148, 163, 184, 0.6)';
        const lineWidth = isUser ? 2.5 : isHovered ? 2 : 1;

        return (
          <line key={key}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={color}
              linewidth={lineWidth}
              transparent
              opacity={isUser ? 1 : 0.65}
            />
          </line>
        );
      })}
    </group>
  );
}

/* ---------- State Fills ---------- */
function StateFills({
  stateGroups,
  userState,
  onHover,
}: {
  stateGroups: StateGroup[];
  userState?: string;
  onHover: (name: string | null) => void;
}) {
  const meshes = useMemo(() => {
    const items: {
      key: string;
      geometry: THREE.BufferGeometry;
      name: string;
      isUser: boolean;
    }[] = [];
    let idx = 0;

    for (const group of stateGroups) {
      const isUser = group.name === userState;

      for (const ring of group.rings) {
        const simplified = simplifyCoords(ring, isUser ? 1 : 3);
        const pts = simplified.map(([lng, lat]) =>
          latLngToVector3(lat, lng, GLOBE_RADIUS, 0.002)
        );
        if (pts.length < 3) continue;

        // fan triangulation from centroid
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
        geo.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(verts, 3)
        );
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
  }, [stateGroups, userState]);

  return (
    <group>
      {meshes.map(({ key, geometry, name, isUser }) => (
        <mesh
          key={key}
          geometry={geometry}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(name);
          }}
          onPointerOut={() => onHover(null)}
        >
          <meshBasicMaterial
            color={isUser ? '#ff9933' : '#1e3a8a'}
            transparent
            opacity={isUser ? 0.45 : 0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
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

    // latitude lines every 15°
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 5) {
        pts.push(latLngToVector3(lat, lng, GLOBE_RADIUS, 0.001));
      }
      result.push(pts);
    }

    // longitude lines every 15°
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
              args={[
                new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e293b" transparent opacity={0.35} />
        </line>
      ))}
    </group>
  );
}

/* ---------- User state marker (pulsing dot) ---------- */
function StateMarker({ state, stateGroups }: { state: string; stateGroups: StateGroup[] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const position = useMemo(() => {
    const group = stateGroups.find((g) => g.name === state);
    if (!group) return null;

    const allCoords: number[][] = [];
    group.rings.forEach((ring) => allCoords.push(...ring));
    if (allCoords.length === 0) return null;

    let avgLat = 0,
      avgLng = 0;
    allCoords.forEach(([lng, lat]) => {
      avgLat += lat;
      avgLng += lng;
    });
    avgLat /= allCoords.length;
    avgLng /= allCoords.length;

    return latLngToVector3(avgLat, avgLng, GLOBE_RADIUS, 0.02);
  }, [state, stateGroups]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.3;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!position) return null;

  return (
    <group position={position}>
      {/* Inner dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#ff9933" />
      </mesh>
      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[0.035, 0.045, 32]} />
        <meshBasicMaterial
          color="#ff9933"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ---------- Initial camera position ---------- */
function GlobeController() {
  const { camera } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Position camera to look at India
      const phi = (90 - INDIA_CENTER.lat) * (Math.PI / 180);
      const theta = (INDIA_CENTER.lng + 180) * (Math.PI / 180);
      const distance = 5;
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

/* ---------- Scene ---------- */
function GlobeScene({
  stateGroups,
  userState,
  hoveredState,
  setHoveredState,
}: {
  stateGroups: StateGroup[];
  userState?: string;
  hoveredState: string | null;
  setHoveredState: (name: string | null) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#3b82f6" />

      <GlobeController />

      <group>
        <GlobeSphere />
        <Atmosphere />
        <Graticule />
        <StateFills
          stateGroups={stateGroups}
          userState={userState}
          onHover={setHoveredState}
        />
        <StateBorders
          stateGroups={stateGroups}
          userState={userState}
          hoveredState={hoveredState}
        />
        {userState && (
          <StateMarker state={userState} stateGroups={stateGroups} />
        )}
      </group>

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3.5}
        maxDistance={8}
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
  stateName,
  isUserState,
}: {
  stateName: string | null;
  isUserState: boolean;
}) {
  if (!stateName) return null;

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
      {stateName}
      {isUserState && (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#ff9933',
            marginLeft: '4px',
          }}
        >
          Your State
        </span>
      )}
    </div>
  );
}

/* ---------- Loading ---------- */
function LoadingOverlay() {
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
      <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
        Loading India Map…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function IndiaGlobe({ userState }: IndiaGlobeProps) {
  const [stateGroups, setStateGroups] = useState<StateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(GEOJSON_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GeoJSON = await res.json();
        if (!cancelled) {
          // Group district-level features into state-level groups
          const groups = groupByState(data.features);
          setStateGroups(groups);
          setLoading(false);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load map data');
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleHover = useCallback((name: string | null) => {
    setHoveredState(name);
  }, []);

  if (error) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '2rem' }}>⚠️</span>
        <p>Failed to load map: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      {loading && <LoadingOverlay />}

      <Tooltip
        stateName={hoveredState}
        isUserState={hoveredState === userState}
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
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#ff9933',
              boxShadow: '0 0 8px rgba(255,153,51,0.5)',
            }}
          />
          <span>Your State</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#1e3a8a',
              border: '1px solid #3b82f6',
            }}
          />
          <span>Other States</span>
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
        🖱️ Drag to rotate • Scroll to zoom
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        {!loading && stateGroups.length > 0 && (
          <GlobeScene
            stateGroups={stateGroups}
            userState={userState}
            hoveredState={hoveredState}
            setHoveredState={handleHover}
          />
        )}
      </Canvas>
    </div>
  );
}

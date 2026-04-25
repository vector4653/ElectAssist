import * as THREE from 'three';

/**
 * Converts lat/lng to a 3D point on a sphere
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
  offset = 0
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius + offset) * Math.sin(phi) * Math.cos(theta);
  const y = (radius + offset) * Math.cos(phi);
  const z = (radius + offset) * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Create a line geometry from an array of [lng, lat] coordinates on a sphere.
 */
export function createBorderLine(
  coords: number[][],
  radius: number,
  offset = 0.002
): THREE.Vector3[] {
  return coords.map(([lng, lat]) => latLngToVector3(lat, lng, radius, offset));
}

/**
 * Creates a filled polygon on the sphere surface from GeoJSON coordinates.
 * Uses triangulation for the polygon on the globe surface.
 */
export function createStateShape(
  coords: number[][],
  radius: number,
  offset = 0.003
): THREE.BufferGeometry | null {
  if (coords.length < 3) return null;

  const points = coords.map(([lng, lat]) =>
    latLngToVector3(lat, lng, radius, offset)
  );

  // Simple fan triangulation from centroid
  const centroid = new THREE.Vector3(0, 0, 0);
  points.forEach((p) => centroid.add(p));
  centroid.divideScalar(points.length);
  centroid.normalize().multiplyScalar(radius + offset);

  const vertices: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    vertices.push(
      centroid.x, centroid.y, centroid.z,
      points[i].x, points[i].y, points[i].z,
      points[i + 1].x, points[i + 1].y, points[i + 1].z
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.computeVertexNormals();
  return geometry;
}

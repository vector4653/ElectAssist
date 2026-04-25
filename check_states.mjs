// Check J&K and Ladakh boundary extent
const url = 'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/india.geojson';
fetch(url)
  .then(r => r.json())
  .then(data => {
    for (const region of ['Jammu and Kashmir', 'Ladakh']) {
      const features = data.features.filter(f => f.properties.st_nm === region);
      let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
      features.forEach(f => {
        const coords = f.geometry.type === 'MultiPolygon' 
          ? f.geometry.coordinates.flat(2)
          : f.geometry.coordinates.flat(1);
        coords.forEach(([lng, lat]) => {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });
      });
      console.log(`${region}: lat ${minLat.toFixed(2)}-${maxLat.toFixed(2)}, lng ${minLng.toFixed(2)}-${maxLng.toFixed(2)} (${features.length} districts)`);
      features.forEach(f => console.log(`  - ${f.properties.district}`));
    }
  });

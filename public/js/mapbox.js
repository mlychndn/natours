/* eslint-disable */

export const displayMap = (locations) =>{



// mapboxgl.workerUrl = "https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl-csp-worker.js";
mapboxgl.accessToken = 'pk.eyJ1IjoibWx5Y2huZG4iLCJhIjoiY2tuNmU3ajNuMGQ3NjJxcDkxamx3czZlcCJ9.lspK4bFS081I6qMgP9UoVw';


var map = new mapboxgl.Map({
container: 'map',


style: 'mapbox://styles/mlychndn/ckn78snui12en18pdgoeaabe6',
// center: [-118.113491,34.111745],
// zoom: 4,
// interactive:false,
scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // add popup

    new mapboxgl.Popup({
        offset:30
    }).setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

    // Extend map bouns to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding:{
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});
};


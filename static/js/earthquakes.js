// Get the Earthquake GeoJSON Data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Show earthquake data in console
d3.json(url).then(data => {
  console.log(data)
});

// Perform a GET request to the query URL/
d3.json(url).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      // Extract the necessary properties from the feature
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];

      //console.log(magnitude)

      // Define the color based on depth
      var color;
      if (depth < 10) {
        color = "#FBEAC1";
      } else if (depth < 30) {
        color = "#FEDA81";
    } else if (depth < 50) {
        color = "#FCBA12";          
      } else if (depth < 70) {
        color = "#FB8604";
    } else if (depth < 90) {
        color = "#FD4D0C";        
      } else {
        color = "#A8411F";
      }

      // Calculate radius based on magnitude
      if (magnitude > 0) {
        var radius = Math.sqrt(magnitude) * 50000; // Adjust the radius as needed
 
        // Calculate radius based on magnitude
      } else {
        var radius = 0;
      };
      
      // Create a circle marker and bind the popup
      var circle = L.circle(latlng, {
        color: 'black',
        fillColor: color,
        fillOpacity: 0.5,
        radius: radius
      });

      // Bind the popup to the circle marker
      circle.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude  ${(magnitude)}</p><p>Depth  ${(depth)} km</p>`);

      // Return the circle marker
      return circle;
    }
  });

  // Send our earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Topographic Map": topo,
    "Earth Map": street
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [-12.9925, 120.9607],
    zoom: 3.5,
    layers: [topo, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Create a legend control.
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<h4>Depth Legend</h4>';
  div.innerHTML += '<i style="background: #FBEAC1"></i><span>Depth < 10 km</span><br>';
  div.innerHTML += '<i style="background: #FEDA81"></i><span>Depth 10 - 30 km</span><br>';
  div.innerHTML += '<i style="background: #FCBA12"></i><span>Depth 30 - 50 km</span><br>';
  div.innerHTML += '<i style="background: #FB8604"></i><span>Depth 50 - 70 km</span><br>';
  div.innerHTML += '<i style="background: #FD4D0C"></i><span>Depth 70 - 90 km</span><br>';
  div.innerHTML += '<i style="background: #A8411F"></i><span>Depth > 90+ km</span><br>';
  div.innerHTML += '<h4>Magnitude Legend</h4>';
  div.innerHTML += '<div class="circle one"></div><span>1</span><br>';
  div.innerHTML += '<div class="circle two"></div><span>2</span><br>';
  div.innerHTML += '<div class="circle three"></div><span>3</span><br>';
  div.innerHTML += '<div class="circle four"></div><span>4</span><br>';
  div.innerHTML += '<div class="circle five"></div><span>5</span><br>';
  return div;
};

legend.addTo(myMap);
};


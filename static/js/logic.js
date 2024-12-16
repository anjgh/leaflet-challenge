
function markerColor(depth) {
    if (depth >= 90){
        return "red";
    }
    else if (depth >= 70 && depth < 90){
        return "#FE9932"; //dark orange
    }
    else if (depth >= 50 && depth < 70){
        return "#FECB98"; //light orange
    }
    else if (depth >= 30 && depth < 50){
        return "yellow";
    }
    else if (depth >= 10 && depth < 30){
        return "#008631"; //dark green
    }
    else if (depth >= -10 && depth < 10){
        return "#D1FFBD"; //light green
    }
}

function markerSize(mag) {
    return mag * 20000;
}

function createMap(data) {
    const myMap = L.map("map",{
    center: [37.09, -95.71],
    zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    data.features.forEach(feature => {
        let magnitude = feature.properties.mag;
        let coordinates = feature.geometry.coordinates;
        let location = [coordinates[1], coordinates[0]]; 

    // Create a circle for each earthquake
    L.circle(location, {
        fillOpacity: 0.75,
        color: "black",
        fillColor: markerColor(coordinates[2]),     // Use depth for color
        radius: markerSize(magnitude),              // Use magnitude for size
        weight: 1                                   //border thickness
    }).bindPopup("Location: " + feature.properties.place +
        "<br>Magnitude: " + magnitude + 
        "<br>Depth: " + coordinates[2]).addTo(myMap);  
        
    // Adding the legend to the map
    legend.addTo(myMap);         
})};

// Set up the legend.
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
let div = L.DomUtil.create("div", "info legend");
let depth = [-10, 10, 30, 50, 70, 90];
// div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

for (let i =0; i < depth.length; i++) {
    div.innerHTML += 
    '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
    depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
}
return div;    
};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMap);


// markerColor determins the color of the marker based on the eathquake depth
function markerColor(depth) {
    if (depth >= 90){
        return "red"; // deep earthquakes are red
    }
    else if (depth >= 70 && depth < 90){
        return "#FE9932"; // dark orange
    }
    else if (depth >= 50 && depth < 70){
        return "#FECB98"; // light orange
    }
    else if (depth >= 30 && depth < 50){
        return "yellow";
    }
    else if (depth >= 10 && depth < 30){
        return "#008631"; // dark green
    }
    else if (depth >= -10 && depth < 10){
        return "#D1FFBD"; // light green for shallow depths between -10 and 9
    }
}

// markerSize determines the size of the marker based on earthquake magnitude
function markerSize(mag) {
    return mag * 10000; // scale magnitude by 10,000 for visualization
}

// create the map and add earthquake data
function createMap(data) {
    // initialize the map and set its center and zoom level
    const myMap = L.map("map",{
    center: [37.09, -95.71],
    zoom: 5
    });

    // add openStreetMap tile layer as the base layer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // loop through each earthquake feature in the GeoJSON data
    data.features.forEach(feature => {
        let magnitude = feature.properties.mag; // extract earthquake magnitude
        let coordinates = feature.geometry.coordinates; // extract longitude, latitude, and depth
        let location = [coordinates[1], coordinates[0]]; // convert coordinates to [latitude, longitude]

    // Create a circle for each earthquake
    L.circle(location, {
        fillOpacity: 0.75, // opacity of the circle fill
        color: "black", // border color
        fillColor: markerColor(coordinates[2]),     // fill color determined by depth
        radius: markerSize(magnitude),              // radius determined by magnitude
        weight: 1                                   //border thickness
    }).bindPopup(
        "Location: " + feature.properties.place + // location information
        "<br>Magnitude: " + magnitude +           // display magnitude
        "<br>Depth: " + coordinates[2]            // display depth    
    ).addTo(myMap); // add the marker to the map
        
    // adding the legend to the map
    legend.addTo(myMap);         
})};

// set up the legend control
let legend = L.control({ position: "bottomright" }); // place legend at the bottom right corner 
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depth = [-10, 10, 30, 50, 70, 90]; // depth ranges
    let colors = depth.map(d => markerColor(d+1)); // map depth ranges to cooresponding colors
    
    // style the legend container
    div.style.backgroundColor = "white";
    div.style.padding = "10px";
    div.style.border = "2px solid #ccc";
    div.style.borderRadius = "10px"; // rounded corners for the legend box

    // loop through depth ranges and create color boxes with labels    
    for (let i = 0; i < depth.length; i++) {
        div.innerHTML += `
            <i style="
            background:${colors[i]}; 
            width: 20px; 
            height: 20px; 
            display: inline-block; 
            margin: 0px;
            vertical-align: middle;
            "></i> 
            ${depth[i]}${depth[i + 1] ? `–${depth[i + 1]}` : '+'}<br>`;
    }

return div;  // return the legend container
};

// fetch earthquake data from the USGS GeoJSON feed and call createMap
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMap);

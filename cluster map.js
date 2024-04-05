// map.on("load", () => {
//   map.addSource("crimesource", {
//     type: "geojson",
//     data: filteredData,
//   });

//   map.addLayer({
//     id: "crime",
//     type: "heatmap",
//     source: "crimesource",
//     minzoom: 5,
//     layout: {},
//     paint: {
//       "heatmap-color": [
//         "interpolate",
//         ["linear"],
//         ["heatmap-density"],
//         0,
//         "rgba(0, 0, 255, 0)",
//         0.1,
//         "royalblue",
//         0.3,
//         "cyan",
//         0.67,
//         "hsl(60, 100%, 50%)",
//         1,
//         "rgb(255, 0, 0)",
//       ],
//       "heatmap-opacity": [
//         "interpolate",
//         ["linear"],
//         ["zoom"],
//         0,
//         0.8,
//         12.11,
//         0.6,
//         15,
//         0.7,
//         22,
//         1,
//       ],
//       "heatmap-radius": [
//         "interpolate",
//         ["cubic-bezier", 1, 1, 1, 1],
//         ["zoom"],
//         0,
//         1,
//         10,
//         5,
//         11.59,
//         8,
//         13.7,
//         15,
//         16.02,
//         30,
//         16.76,
//         50,
//         22,
//         80,
//       ],
//       "heatmap-weight": [
//         "interpolate",
//         ["linear"],
//         ["zoom"],
//         0,
//         0.05,
//         7,
//         0.1,
//         10.07,
//         0.12,
//         12.75,
//         0.13,
//         16,
//         0.13,
//         22,
//         0.15,
//       ],
//       "heatmap-intensity": [
//         "interpolate",
//         ["linear"],
//         ["zoom"],
//         0,
//         0.5,
//         7.74,
//         0.2,
//         9.17,
//         0.2,
//         11.55,
//         0.5,
//         12.75,
//         0.8,
//         16.19,
//         1,
//         22,
//         1,
//       ],
//     },
//   });

//   let popup = new mapboxgl.Popup({
//     closeButton: false,
//     closeOnClick: false,
//   });

//   map.on("mousemove", "crime", (e) => {
//     if (e.features && e.features.length > 0) {
//       map.getCanvas().style.cursor = "pointer";
//       const closestCoords = computeclosestcoordsfromevent(e);
//       const filteredFeatures = e.features.filter((feature) => {
//         const geometry = feature?.geometry;
//         if (geometry?.type === "Point" && "coordinates" in geometry) {
//           const coordinates = geometry.coordinates;
//           return (
//             coordinates[0] === closestCoords[0] &&
//             coordinates[1] === closestCoords[1]
//           );
//         }
//         return false;
//       });

//       const coordinates = closestCoords.slice();
//       while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//       }
//       if (filteredFeatures.length > 0) {
//         const allLineItems = filteredFeatures.map((crime) => {
//           const properties = crime.properties || {};
//           const location = properties.address || "";
//           const crime_code = properties.crime_code || "";

//           return `<div>
//             <p>Address: ${location}</p>
//             <p>CrimeDesc: ${crime_code}</p>
//           </div>`;
//         });
//         popup.setLngLat(coordinates)
//           .setHTML(
//             `
//             <div style="width: 800px;">
//                 ${allLineItems.join("")}

//             </div>
//             <style>
//               .mapboxgl-popup-content {
//                 background: #212121e0;
//                 color: #fdfdfd;
//               }
//               td, th {
//                 text-align: left;
//                 padding: 8px;
//               }
//               .flexcollate {
//                 row-gap: 0.5rem;
//                 display: flex;
//                 flex-direction: column;
//               }
//             </style>`
//           )
//           .addTo(map);
//       }
//     }
//   });

//   map.on("mouseleave", "crime", () => {
//     map.getCanvas().style.cursor = "";
//     popup.remove();
//   });
// });

// const supercluster = new Supercluster({
//   radius: 1,
//   maxZoom: 16,
// });
// console.log(filteredData)
//     supercluster.load(filteredData?.features);
//     map.on("load", () => {
//       map.addSource("clusters", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: supercluster.getClusters(
//             [-180, -85, 180, 85],
//             map.getZoom()
//           ),
//         },
//       });

//       map.addLayer({
//         id: "crime",
//         type: "heatmap",
//         source: "clusters",
//         maxzoom: 24,
//         paint: {
//           "heatmap-color": [
//             "interpolate",
//             ["linear"],
//             ["heatmap-density"],
//             0,
//             "rgba(0, 0, 255, 0)",
//             0.1,
//             "royalblue",
//             0.3,
//             "cyan",
//             0.67,
//             "hsl(60, 100%, 50%)",
//             1,
//             "rgb(255, 0, 0)",
//           ],
//           "heatmap-opacity": [
//             "interpolate",
//             ["linear"],
//             ["zoom"],
//             0,
//             0.8,
//             12.11,
//             0.6,
//             15,
//             0.7,
//             22,
//             1,
//           ],
//           "heatmap-radius": [
//             "interpolate",
//             ["cubic-bezier", 1, 1, 1, 1],
//             ["zoom"],
//             0,
//             1,
//             10,
//             5,
//             11.59,
//             8,
//             13.7,
//             15,
//             16.02,
//             30,
//             16.76,
//             50,
//             22,
//             80,
//           ],
//         },
//       });

//       map.addLayer({
//         id: "unclustered-point",
//         type: "circle",
//         source: "clusters",
//         filter: ["!", ["has", "point_count"]],
//         paint: {
//           "circle-color": "rgba(0, 0, 255, 0)",
//           "circle-radius": 1,
//           "circle-stroke-width": 1,
//           "circle-stroke-color": "none",
//         },
//       });

//       map.on("click", "clusters", (e) => {
//         const features = map.queryRenderedFeatures(e.point, {
//           layers: ["clusters"],
//         });
//         const clusterId = features[0].properties.cluster_id;
//         map
//           .getSource("clusters")
//           .getClusterExpansionZoom(clusterId, (err, zoom) => {
//             if (err) return;

//             map.easeTo({
//               center: features[0].geometry.coordinates,
//               zoom: zoom,
//             });
//           });
//       });

//       map.on("mousemove", "crime", (e) => {
//         const features = map.queryRenderedFeatures(e.point, {
//           layers: ["crime"],
//         });
//         if (!features || features.length === 0) {
//           console.error("No features found");
//           return;
//         }

//         const clusterId = features[0].properties.cluster_id;
//         if (clusterId) {
//           map.getCanvas().style.cursor = "pointer";

//           const coordinates = features[0].geometry.coordinates.slice();
//           const count = features[0].properties.point_count;
//           const clusterPoints = supercluster.getLeaves(clusterId, Infinity, 0);
//           console.log(clusterPoints);
//           let popupContent = "<div><ul>";
//           clusterPoints.forEach((point) => {
//             const { address, crime_code, mo_codes } = point.properties;
//             popupContent += `<li>CrimeDesc: ${crime_code}</li>`;
//           });
//           popupContent += "</ul></div>";

//           popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
//         } else {
//           const individualFeature = features[0];
//           const { address, crime_code } = individualFeature.properties;
//           map.getCanvas().style.cursor = "pointer";
//           const coordinates = individualFeature.geometry.coordinates.slice();

//           let popupContent = `<div><ul>
//  <li>CrimeDesc: ${crime_code}</li> '</ul></div>`;

//           popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
//         }
//       });

//       map.on("mouseleave", "crime", () => {
//         map.getCanvas().style.cursor = "";
//         popup.remove();
//       });
//     });

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import Supercluster from "supercluster";
import { computeclosestcoordsfromevent } from "./getclosestcoordsfromevent";
mapboxgl.accessToken =
  "pk.eyJ1Ijoia2VubmV0aG1lamlhIiwiYSI6ImNsZG1oYnpxNDA2aTQzb2tkYXU2ZWc1b3UifQ.PxO_XgMo13klJ3mQw1QxlQ";

const Map = ({ data, options }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("3004");
  const shouldfilteropeninit =
    typeof window != "undefined" ? window.innerWidth >= 640 : false;
  const [selectedfilteropened, setselectedfilteropened] = useState("moCodes");
  const [filterpanelopened, setfilterpanelopened] =
    useState(shouldfilteropeninit);
  const [normalizeintensityon, setnormalizeintensityon] = useState(false);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-118.41, 34],
      zoom: 10,
    });
    mapRef.current = map;
    let filteredData = {
      type: "FeatureCollection",
      features: [],
    };
    // const popup = new mapboxgl.Popup({
    //   closeButton: false,
    //   closeOnClick: false,
    // });

    const filterData = () => {
      filteredData.features = [];
      data?.forEach((item) => {
        const [latitude, longitude] = item.Location?.replace("(", "")
          .replace("(", "")
          .replace(")", "")
          .split(", ")
          .map((coord) => parseFloat(coord));

        if (!isNaN(latitude) && !isNaN(longitude)) {
          const moCodes = item["MO Codes"].split(" ");
          if (selectedOption == "Select All") {
            filteredData.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              properties: {
                crime_code: item["Crime Code Description"],
                address: item.Address,
                mo_codes: item["MO Codes"].split(" "),
              },
            });
          } else if (moCodes.includes(selectedOption.toString())) {
            filteredData.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              properties: {
                crime_code: item["Crime Code Description"],
                address: item.Address,
                mo_codes: moCodes,
              },
            });
          }
        }
      });
      mapRef.current.getSource("crimesource").setData(filteredData);
    };
    map.on("load", () => {
      map.addSource("crimesource", {
        type: "geojson",
        data: filteredData,
      });
      if (normalizeintensityon === true) {
        map.addLayer({
          id: "crime",
          type: "heatmap",
          source: "crimesource",
          minzoom: 5,
          layout: {},
          paint: {
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0, 0, 255, 0)",
              0.1,
              "royalblue",
              0.3,
              "cyan",
              0.67,
              "hsl(60, 100%, 50%)",
              1,
              "rgb(255, 0, 0)",
            ],
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.8,
              12.11,
              0.6,
              15,
              0.7,
              22,
              1,
            ],
            "heatmap-radius": [
              "interpolate",
              ["cubic-bezier", 1, 1, 1, 1],
              ["zoom"],
              0,
              1,
              10,
              5,
              11.59,
              8,
              13.7,
              15,
              16.02,
              30,
              16.76,
              50,
              22,
              80,
            ],
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.01,
              7,
              0.05,
              10.07,
              0.06,
              12.75,
              0.07,
              16,
              0.08,
              22,
              0.1,
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.2,
              7.74,
              0.1,
              9.17,
              0.1,
              11.55,
              0.2,
              12.75,
              0.4,
              16.19,
              0.5,
              22,
              0.5,
            ],
          },
        });
      } else {
        map.addLayer({
          id: "crime",
          type: "heatmap",
          source: "crimesource",
          minzoom: 5,
          layout: {},
          paint: {
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0, 0, 255, 0)",
              0.1,
              "royalblue",
              0.3,
              "cyan",
              0.67,
              "hsl(60, 100%, 50%)",
              1,
              "rgb(255, 0, 0)",
            ],
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.8,
              12.11,
              0.6,
              15,
              0.7,
              22,
              1,
            ],
            "heatmap-radius": [
              "interpolate",
              ["cubic-bezier", 1, 1, 1, 1],
              ["zoom"],
              0,
              1,
              10,
              5,
              11.59,
              8,
              13.7,
              15,
              16.02,
              30,
              16.76,
              50,
              22,
              80,
            ],
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.05,
              7,
              0.1,
              10.07,
              0.12,
              12.75,
              0.13,
              16,
              0.13,
              22,
              0.15,
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.5,
              7.74,
              0.2,
              9.17,
              0.2,
              11.55,
              0.5,
              12.75,
              0.8,
              16.19,
              1,
              22,
              1,
            ],
          },
        });
      }
      let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mousemove", "crime", (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = "pointer";
          const closestCoords = computeclosestcoordsfromevent(e);
          const filteredFeatures = e.features.filter((feature) => {
            const geometry = feature?.geometry;
            if (geometry?.type === "Point" && "coordinates" in geometry) {
              const coordinates = geometry.coordinates;
              return (
                coordinates[0] === closestCoords[0] &&
                coordinates[1] === closestCoords[1]
              );
            }
            return false;
          });

          const coordinates = closestCoords.slice();
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          if (filteredFeatures.length > 0) {
            const allLineItems = filteredFeatures.map((crime) => {
              const properties = crime.properties || {};
              const location = properties.address || "";
              const crime_code = properties.crime_code || "";

              return `<div>
            <p>Address: ${location}</p>
            <p>CrimeDesc: ${crime_code}</p>
          </div>`;
            });
            popup
              .setLngLat(coordinates)
              .setHTML(
                `
            <div style="width: 800px;">
                ${allLineItems.join("")}

            </div>
            <style>
              .mapboxgl-popup-content {
                background: #212121e0;
                color: #fdfdfd;
              }
              td, th {
                text-align: left;
                padding: 8px;
              }
              .flexcollate {
                row-gap: 0.5rem;
                display: flex;
                flex-direction: column;
              }
            </style>`
              )
              .addTo(map);
          }
        }
      });

      map.on("mouseleave", "crime", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
      filterData();
    });

    return () => map.remove();
  }, [data, selectedOption, normalizeintensityon]);

  return (
    <div>
      <div className="absolute mt-[3.5em] ml-2 md:ml-3 top-0 z-5 flex flex-row gap-x-2 z-50">
        <button
          onClick={() => {
            setfilterpanelopened(!filterpanelopened);
          }}
          className="mt-2 rounded-full px-3 pb-1.5 pt-0.5 text-sm bold md:text-base bg-gray-800 bg-opacity-80 text-white border-white border-2"
        >
          <svg
            style={{
              width: "20px",
              height: "20px",
            }}
            viewBox="0 0 24 24"
            className="inline align-middle mt-0.5"
          >
            <path
              fill="currentColor"
              d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"
            />
          </svg>
          <span>Filter</span>
        </button>
      </div>
      <div
        className={` bottom-0 sm:bottom-auto md:mt-[6.2em] md:ml-3 w-screen sm:w-auto z-50 
            ${filterpanelopened === true ? "absolute " : "hidden"}
            `}
      >
        <div className="bg-zinc-900 w-content bg-opacity-90 px-2 py-1 mt-1 sm:rounded-lg">
          <div className="gap-x-0 flex flex-row w-full">
            <button
              onClick={() => {
                setselectedfilteropened("moCodes");
              }}
              className={`px-2 border-b-2 py-1 font-semibold ${
                selectedfilteropened === "moCodes"
                  ? "border-[#41ffca] text-[#41ffca]"
                  : "hover:border-white border-transparent text-gray-50"
              }`}
            >
              MO Codes
            </button>
          </div>
          <div className="flex flex-col">
            {selectedfilteropened === "moCodes" && (
              <>
                <div className="pl-5 pr-2 py-2 ">
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="align-middle text-white rounded-lg px-1  border border-gray-400 text-sm md:text-base bg-zinc-900"
                    id="wgtmsr"
                  >
                    {options?.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="w-40 h-56"
                      >
                        {option.label.length > 20
                          ? option.label.slice(0, 20) + "..."
                          : option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    onChange={(e) => {
                      setnormalizeintensityon(e.target.checked);
                    }}
                    className="h-4 w-4 border border-gray-300 rounded-sm focus:outline-none transition duration-200 mt-1 float-left mr-2 cursor-pointer"
                    type="checkbox"
                    checked={normalizeintensityon}
                  />
                  <label
                    className="form-check-label inline-block text-gray-100"
                    htmlFor="flexCheckChecked"
                  >
                    Normalize Intensity
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* <div className="absolute top-10 left-10 w-40 z-50 rounded-lg">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="align-middle text-white rounded-lg px-1  border border-gray-400 text-sm md:text-base"
          id="wgtmsr"
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value} className="w-40">
              {option.label.length > 20
                ? option.label.slice(0, 20) + "..."
                : option.label}
            </option>
          ))}
        </select>
      </div> */}

      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default Map;

import React, { useState, useEffect, useRef } from 'react';
import { faBars, faBell, faMessage,faAnglesRight, faAnglesLeft,faPenSquare, faTrash,faUpload, faArrowLeft,faSquareXmark, faFolderPlus, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { getToken } from '../services/LocalStorageService';
import { toast } from "react-toastify";
import { data } from 'autoprefixer';
import moment from "moment";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {faLeaf} from "@fortawesome/free-solid-svg-icons"
import { Hourglass, ThreeCircles } from  'react-loader-spinner'

const MapComponent = ({toggle}) => {
  const apiKey = 'AIzaSyBtZs5hI8Dzsn__RKWvo0ZDFpiJo53Pldc';
  const [farms, setFarms] = useState([]);                //fetch farms and set them
  const [fields, setFields] = useState([]);               //fetch fields and set them
  const [selectedItemId, setSelectedItemId] = useState(null); //to select farms
  const [filteredItems, setFilteredItems] = useState([]);     //for farms
  const [farmid, setfarmid] = useState('');           
  const [ cropFieldStatus, setcropFieldStatus] = useState(null);
  const dropdownRef = useRef(null);  
  const[farmlat, setfarmlat] = useState("30.3753");
  const[farmlon, setfarmlon] = useState("69.3451");
  const [fieldname, setFieldname] = useState('');
  const [cropType, setCropType] = useState('');
  var polygonCoordinates = [];
  const gridSpacing = 0.0000975;
  const [polygonCoordinatesString, setstring] = useState([]);
  const [polygonCoordString, setPolyCoordstring] = useState('');
  const [loadingofPredictions, setLoadingofPredictions] = useState(false);
  const [isAsideVisible, setIsAsideVisible] = useState(true);
  const toggleAsideVisibility = () => {
    setIsAsideVisible(!isAsideVisible);
  };
  
  const [polygonPointList, setPolygonPointList] = useState([]);
  const [selectedOption, setSelectedOption] = useState('No filling');
  const handlefillingChange = (event) => {
    setSelectedOption(event.target.value);
    setLoading(true);
  };

  const [polygonState, setPolygonState] = useState([]); // polygonState to handle the update polygons fields.
  const [showDropdown, setShowDropdown] = useState(false); //for draw and import

  const toggleDropdownDI = () => { // for draw and
    setShowDropdown(!showDropdown);
    console.log(showDropdown);
  };

  const [selectedOptionforDT, setSelectedOptionDT] = useState(null); //for add field display
  const [isImportPopupOpen, setIsImportPopupOpen] = useState(false); //for popup 

  const handleOptionClick = (option) => {
    if (option === 'Import') {
      setIsImportPopupOpen(true);
    } else {
      setSelectedOptionDT(option);
  
    }
    console.log(`Selected option: ${option}`);
    setShowDropdown(false);

  };


  const starting_date = "2023-08-20";
  const ending_date = "2023-08-24";
  const [polygonMap, setPolygonMap] = useState(); //set maps
  const [averagePolygonsComputedNDVI, setAveragePolygonsComputedNDVI] =
    useState([]);

  const [averagePointComputedNDVI, setAveragePointComputedNDVI] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shapesList, setShapeList] = useState([]);

//moez function 
  function valueToColor(value) {
    if (typeof value !== "number") {
      return "rgb(0, 0, 0)"; // Default color in case of invalid value
    }

    const colorStops = [
      { value: 0.0, color: [179, 0, 0] }, // Dark Red (Low NDVI)
      { value: 0.25, color: [253, 141, 60] }, // Dark Orange
      { value: 0.4, color: [254, 224, 139] }, // Light Orange
      { value: 0.5, color: [255, 255, 191] }, // Pale Yellow
      { value: 0.7, color: [168, 219, 168] }, // Light Green
      { value: 1.0, color: [0, 97, 39] }, // Dark Green (High NDVI)
    ];

    let lowerStop, upperStop;

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (value >= colorStops[i].value && value <= colorStops[i + 1].value) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    if (!lowerStop || !upperStop) {
      return "rgb(0, 0, 0)"; // Default color for out of range values
    }

    const weight =
      (value - lowerStop.value) / (upperStop.value - lowerStop.value);

    const interpolatedColor = lowerStop.color.map((channel, index) => {
      const diff = upperStop.color[index] - channel;
      return Math.round(channel + weight * diff);
    });

    return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
  }

//moez useffect
  useEffect(() => {
    averagePolygonsComputedNDVI.forEach((index, i) => {
      console.log(valueToColor(index.averageNDVI));
      const drawnPolygon = new window.google.maps.Polygon({
        paths: index.polygonVertices,
        
        strokeColor:  "#FFFFFF",
        strokeOpacity: 1.2,
        strokeWeight: 4,
        fillOpacity: 0.9,
        fillColor: valueToColor(index.averageNDVI),
      });

      setShapeList((prevshapesList) => [...prevshapesList, drawnPolygon]);

      //Polygon will be drawn on map
      drawnPolygon.setMap(polygonMap);
      const textMarker = new window.google.maps.Marker({
        position: index.polygonVertices[0],
        map: polygonMap,
        icon: {
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA5FBMVEUAAAANWpKVPzD///8AAABTVJL5+fmxq+2j7JhQVZV3hDe1txkPFcXFlitq6yxs7liem1Ccn2AAAAHHRSTlMABYh4EhERV0cMDxMbGyMiNjs+Pj5ESU1FfYWJkpGSxtrV2Nna29zd3eJhYmPjpKZmJ6cq6ysr7C3uMfG29ze5+vq8vn3+eTg6+3z9/b7///i5dUiAAABr0lEQVR42jXLAQ6DMAxF0RM/v9u0mljJhFKfw9++SlOGaLoqmgEH53gYxtsZpTfMmcmcznt2KdLZLLeJdCM0xL/ikyKZ5RrRBABQQQhF1CEgRBABBRBHxEyAQQQQAABBBBAAIEUhIEAEFBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIIIIAAAggggAACiRCxCQEEEAAAQQQQACBFISBAEBBBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIIIIAAAggggAACiRCxCQEEEAAAQQQQACBFISBAEBBBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIIIIAAAggggAACiRCxCQEEEAAAQQQQACBFISBAEBBBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIe4CcHPA13fjX1AAAAABJRU5ErkJggg==", // Transparent image
          labelOrigin: new window.google.maps.Point(0, 0),
        },
        label: {
          text: index.averageNDVI.toFixed(2).toString(),

          fontWeight: "bold",
          fontSize: "0.95rem",
        },
      });
      setShapeList((prevshapesList) => [...prevshapesList, textMarker]);
    });
  }, [averagePolygonsComputedNDVI]);

  const averageData = async () => {
    const dataToSend = {
      polygonList: polygonCoordinatesString,
      startDate: starting_date,
      endDate: ending_date,
    };
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/vegetation/average/",
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      setAveragePolygonsComputedNDVI(response.data.computedAverageNDVIList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false);
    }
  };
  
  //contrasted ndvi
  function adjustRectangleDimensions(center, spacing, polygon) {
    const halfSpacing = spacing / 2;

    // Calculate adjusted rectangle dimensions
    const polygonBounds = new window.google.maps.LatLngBounds();
    polygon
      .getPath()
      .getArray()
      .forEach((coordinate) => {
        polygonBounds.extend(coordinate);
      });

    const adjustedNorth = Math.min(
      center.lat + halfSpacing,
      polygonBounds.getNorthEast().lat()
    );
    const adjustedSouth = Math.max(
      center.lat - halfSpacing,
      polygonBounds.getSouthWest().lat()
    );
    const adjustedEast = Math.min(
      center.lng + halfSpacing,
      polygonBounds.getNorthEast().lng()
    );
    const adjustedWest = Math.max(
      center.lng - halfSpacing,
      polygonBounds.getSouthWest().lng()
    );

    return {
      north: adjustedNorth,
      south: adjustedSouth,
      east: adjustedEast,
      west: adjustedWest,
    };
  }


  useEffect(() => {
    averagePointComputedNDVI.forEach((index, i) => {
      const drawnPolygon = new window.google.maps.Polygon({
        paths: index.polygonVertices,
        strokeColor: "rgb(255, 231, 103)",
        strokeOpacity: 1.2,
        strokeWeight: 4,
        fillOpacity: 0.0,
      });

      setShapeList((prevshapesList) => [...prevshapesList, drawnPolygon]);
      //Polygon will be drawn on map
      drawnPolygon.setMap(polygonMap);

      if (drawnPolygon) {
        if (polygonMap && index.point_ndvi_data.length > 0) {
          index.point_ndvi_data.forEach((pointData, count) => {
            // Check if the point is inside the polygon
            if (
              window.google.maps.geometry.poly.containsLocation(
                pointData.point,
                drawnPolygon
              )
            ) {
              // Calculate adjusted dimensions to fit within the polygon
              const rectangleBounds = adjustRectangleDimensions(
                pointData.point,
                gridSpacing,
                drawnPolygon
              );

              let color = valueToColor(pointData.ndvi);

              const rectangle = new window.google.maps.Rectangle({
                bounds: rectangleBounds,
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.9,
                map: polygonMap,
              });

              if (count == 10) {
                const textMarker = new window.google.maps.Marker({
                  position: pointData.point,
                  map: polygonMap,
                  icon: {
                    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA5FBMVEUAAAANWpKVPzD///8AAABTVJL5+fmxq+2j7JhQVZV3hDe1txkPFcXFlitq6yxs7liem1Ccn2AAAAHHRSTlMABYh4EhERV0cMDxMbGyMiNjs+Pj5ESU1FfYWJkpGSxtrV2Nna29zd3eJhYmPjpKZmJ6cq6ysr7C3uMfG29ze5+vq8vn3+eTg6+3z9/b7///i5dUiAAABr0lEQVR42jXLAQ6DMAxF0RM/v9u0mljJhFKfw9++SlOGaLoqmgEH53gYxtsZpTfMmcmcznt2KdLZLLeJdCM0xL/ikyKZ5RrRBABQQQhF1CEgRBABBRBHxEyAQQQQAABBBBAAIEUhIEAEFBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIIIIAAAggggAACiRCxCQEEEAAAQQQQACBFISBAEBBBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIIIIAAAggggAACiRCxCQEEEAAAQQQQACBFISBAEBBBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIIIIAAAggggAACiRCxCQEEEAAAQQQQACBFISBAEBBBAjELEuAggggAACCCCAAAKJEKEkBBBAAAEEEEAAgRSEgQBAQQQIxCxLgIe4CcHPA13fjX1AAAAABJRU5ErkJggg==", // Transparent image
                    labelOrigin: new window.google.maps.Point(0, 0),
                  },
                  label: {
                    text: index.averageNdvi.toFixed(2).toString(),

                    fontWeight: "bold",
                    fontSize: "0.95rem",
                  },
                });
                setShapeList((prevshapesList) => [
                  ...prevshapesList,
                  textMarker,
                ]);
              }
              setShapeList((prevshapesList) => [...prevshapesList, rectangle]);
            }
          });
        }
      }
    });
  }, [averagePointComputedNDVI]);

  const pointsData = async () => {
    const dataToSend = {
      polyon_Point_List: polygonPointList,
      startDate: starting_date,
      endDate: ending_date,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/vegetation/pointwise/",
        dataToSend
      );
      console.log(response.data.computedPointNDVIList);
      setAveragePointComputedNDVI(response.data.computedPointNDVIList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pointsData();
  }, [polygonPointList]);

  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,places&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = initMap; // Ensuring initMap is globally accessible
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

//------------------------------------------------------------------------------//
  //functions from navbar/index.js
  const [isOpen, setOpen] = useState(false);
    
  const handleDropDown = () => {
    setOpen(!isOpen);
  };

  const { access_token } = getToken()

  
  //loads the user created farms
  useEffect(() => {
    fetchFarms();
}, []);
 
const [coordinatesArray, setCoordinatesArray] = useState([]);
//get user created farms 
   const fetchFarms = async () => {
     try {
       const response = await axios.get('http://127.0.0.1:8000/farms/my-farms/', {
         headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${access_token}`
         }
       });
       console.log(response.data)
       setFarms(response.data);
      //  initMap(farmlat,farmlon);
     } catch (error) {
       console.error('Error fetching farms:', error);
     }
   };
   const [selectedFile, setSelectedFile] = useState(null);

   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = function (event) {
        const kmlData = event.target.result;
  
        // Parse KML data
        const parser = new DOMParser();
        const kmlDocument = parser.parseFromString(kmlData, 'application/xml');
        var coordinatesArray = [];
  
        // // Extract coordinates
        // const coordinates = kmlDocument.querySelectorAll('coordinates');
        // coordinates.forEach((coordinate, index) => {
        //   const coordinateParts = coordinate.textContent.split(' '); // Split into individual coordinate parts
        
        //   coordinateParts.forEach((coordPart, partIndex) => {
        //     const values = coordPart.split(','); // Split each coordinate part by comma
        //     if (values.length >= 2) {
        //       const longitude = values[0].trim(); // Trim spaces from longitude
        //       const latitude = values[1].trim(); // Trim spaces from latitude
        
        //       coordinatesArray.push({ latitude, longitude });
        //       console.log(`Coordinate ${index + 1}, Part ${partIndex + 1}: Latitude ${latitude}, Longitude ${longitude}`);
        //     }
        //   });
        // });
  
        const coordinates = kmlDocument.querySelectorAll('coordinates');
        coordinates.forEach((coordinate, index) => {
          const coordinateParts = coordinate.textContent.trim().split(' '); // Split into individual coordinate parts
          const coordinateSet = []; // An array to hold coordinate parts
        
          coordinateParts.forEach((coordPart) => {
            const values = coordPart.split(','); // Split each coordinate part by comma
            if (values.length >= 2) {
              const longitude = parseFloat(values[0].trim()); // Trim spaces from longitude and convert to float
              const latitude = parseFloat(values[1].trim()); // Trim spaces from latitude and convert to float
        
              coordinateSet.push({ lat: latitude, lng: longitude });
            }
          });
        
          coordinatesArray.push(coordinateSet);
          console.log(`Coordinate Set ${index + 1}:`, coordinateSet);
        });
        
        console.log(coordinatesArray);

        // Create a KML layer
        const kmlLayer = new window.google.maps.KmlLayer({
          url: URL.createObjectURL(file),
          map: polygonMap, // Assuming polygonMap is your Google Map instance
        });
  
        // Now, you can set the coordinatesArray in your component's state or use it as needed.
        setCoordinatesArray(coordinatesArray);
      };
      reader.readAsText(file);
    }
  };
  function arrayToObject(array) {
    return array.reduce((obj, item, index) => {
      obj[index] = item;
      return obj;
    }, {});
  }

  const KML = () => {
    console.log(coordinatesArray)
    const myObject = arrayToObject(coordinatesArray);
    console.log(myObject);
   }

   // Function to handle item selection
   const handleSelectChange = (e) => {
     const selectedId = parseInt(e.target.value); // Parse selected ID to an integer
     setSelectedItemId(selectedId);
 
     // Filter the data based on the selected ID
     const filteredItems = farms.filter((item) => item.id === selectedId);
     setFilteredItems(filteredItems);
  
    }
    useEffect(() => {
      if (filteredItems.length === 1) {
        const item = filteredItems[0];
        const extractedlon = item.longitude;
        const extractedlat = item.latitude;
        const extractedid = item.id;
    
        setfarmlon(extractedlon);
        setfarmlat(extractedlat);
        setfarmid(JSON.parse(extractedid));
        console.log('Center Coordinates:', extractedlat, extractedlon, extractedid);
        // var coordinates= extractCoordinates(fields);
        // console.log(coordinates);
        // initMap(extractedlat, extractedlon,coordinates);
      
      }
    }, [filteredItems]);



useEffect(() => {
  if (farmid !== null) {
  fetchFields();
}
}, [farmid]);

const fetchFields = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/fields/my-fields/${farmid}/`, {
      headers: {
       'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    });
    console.log(response.data)
    setFields(response.data);
  } catch (error) {
    console.error('Error fetching farms:', error);
  }
};
 
const polygons= [];
// --useeffect to display the map with polygons
  useEffect(() => {
    if (polygonCoordinatesString !== null) {
    initMap(farmlat,farmlon,polygonCoordinatesString);
  console.log(polygonCoordinatesString)  
  }
  else
   initMap(farmlat,farmlon);
  }, [polygonCoordinatesString]);

  // --use effect to get and set the fetched polygon coordinates
  useEffect(() => {
    setstring(extractCoordinates(fields));
  }, [fields]);


  const initMap = (lat,long,extractedCoordinates) => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center:  { lat: parseFloat(lat), lng: parseFloat(long) },
      zoom: 13,
    });


    window.google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
      // Set the map to the state after it's fully loaded
      setPolygonMap(map);

    const marker = new window.google.maps.Marker({
      position: { lat: parseFloat(lat), lng: parseFloat(long) },
       map: map
       });

    //draw polygons
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon', 'circle'],
      },
    });
    drawingManager.setMap(map);
    
    const infoWindows = [];

///Construct the polygon.
   
    function createPolygon(map, coordinates,info,id) {
    const polygon = new window.google.maps.Polygon({
    paths: coordinates,
    // strokeColor:"rgb(255, 231, 103)",
    // strokeOpacity: 1.2,
    // strokeWeight: 4,
    // fillOpacity: 0.0,
    strokeColor: "yellow",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    editable: false,
    id: id, 
    });        

  const  LatLng = calculatePolygonCenter(coordinates)
  const anchorLatLng = new window.google.maps.LatLng(LatLng);
 
  const infoWindow = new window.google.maps.InfoWindow({
  content: info, 
  zIndex: 1000,  });
   infoWindow.setPosition(anchorLatLng)

   polygon.addListener("click", () => {
  console.log('Polygon Clicked');
  infoWindow.open(map, polygon); // Open the info window when the polygon is clicked
});

polygon.setMap(map);
setPolygonState(prevPolygons => [...prevPolygons, polygon]);
// polygons.push(polygon); 
infoWindows.push(infoWindow); 
// Store the polygon in the global array
    return polygon; // Return the created polygon object if needed
    }

    // function to display polygons on map
    extractedCoordinates.forEach((dataItem) => {
      const info =objectToHTMLString(dataItem.info)
      const polygonid =dataItem.id
      createPolygon(map, dataItem.coordinates, info,polygonid);
      console.log( JSON.stringify(dataItem.info));;
      
    });

    // function to get the coordinate of polygons
        function getPaths(polygon) {
          var polygonBounds = polygon.getPath();
          
          var bounds = [];
        
          for (var i = 0; i < polygonBounds.length; i++) {
            var point = {
              lat: polygonBounds.getAt(i).lat(),
              lng: polygonBounds.getAt(i).lng()
            };
            bounds.push(point);
          }
          polygonCoordinates = bounds;
        }
        
        drawingManager.addListener('polygoncomplete', (polygon) => {
          getPaths(polygon);
          
          // Create a separate variable for the string representation of coordinates
          var polygonCoordString = JSON.stringify(polygonCoordinates);
          setPolyCoordstring(polygonCoordString);
        });
  
      });
        };
//function for info 
function objectToHTMLString(obj) {
  const keys = Object.keys(obj);
  const contentString = keys.map((key) => {
    return `<strong>${key}:</strong> ${obj[key]}`;
  }).join("<br>");
  
  return `<div>${contentString}</div>`;
}
//function to calculate area

// ---function to post field data
const createField = async () => {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/fields/add-field/${farmid}/`, {
      farm:farmid,
      field_name:fieldname,
      crop_type:cropType,
      coordinates: polygonCoordString }, {
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${access_token}`
       }
    });
    console.log(response.data);
    toast.info("Field Successfully added to the farm. ", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });
    // Reset input fields
    document.getElementById('fieldname').value = '';
    document.getElementById('croptype').value = '';
  } catch (error) {
    console.error(error.response.data)
    console.error('Error creating field:', error);
    console.log(farmid);
  }
};

const makePredictions = async () => {
  setLoadingofPredictions(true);
  const coordinatesList = JSON.parse(polygonCoordString);
  const data = {
    polygon: [
      {
        coordinates: coordinatesList.map(coord => ({
          lat: coord.lat,
          lng: coord.lng,
        })),
      },
    ],
  };

  try {
    const response = await axios.post(`http://127.0.0.1:8000/modelsML/classifyc/`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    });

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      // Parse the JSON response.data
      const responseData = response.data;
      // Check the value and set the variable accordingly
      
      if (responseData.data === 0) {
        setcropFieldStatus(' Corn Field Found');
      } else {
        setcropFieldStatus('Corn Field Not Found');
      }

      // Now 'cropFieldStatus' holds the desired status
      console.log('Crop Field Status:', cropFieldStatus);
      
    } else {
      // Handle non-successful response (e.g., display an error message)
      console.error('Error:', response.statusText);
      toast.error('Error getting field predictions', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  } catch (error) {
    // Handle any exceptions that may occur during the request
    console.error('Error getting field predictions:', error);
    toast.error(`Error: ${error.message}`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  }finally {
    // Set the loading state to false after the request is complete (whether it was successful or not)
    setLoadingofPredictions(false);
  }
};


//getting the coordinates only from the backend data to be passed to the polygon function
function extractCoordinates(jsonData) {
  const result = [];
  jsonData.forEach((item) => {
    const coordinates = JSON.parse(item.coordinates);
    const latLngArray = coordinates.map((coord) => ({
      lat: coord.lat,
      lng: coord.lng,
    }));
   // Extract additional information (fieldname and crop type)
   const info = {
    fieldname: item.field_name,
    cropType: item.crop_type,
  };

  // Create an object that includes both coordinates and info
  const dataWithInfo = {
    id: item.id,
    coordinates: latLngArray,
    info: info,
  };

  result.push(dataWithInfo);
});
return result;
}

function calculatePolygonCenter(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  let sumLat = 0;
  let sumLng = 0;

  for (const point of coordinates) {
    sumLat += point.lat;
    sumLng += point.lng;
  }

  const numPoints = coordinates.length;
  const centerLat = sumLat / numPoints;
  const centerLng = sumLng / numPoints;

  return { lat: centerLat, lng: centerLng };
}

//function to convert to points for contrasted ndvi
const computePoints = (polygons) => {
  polygons.forEach((index, i) => {
    const drawnPolygon = new window.google.maps.Polygon({
      paths: index.coordinates,
    });

    if (drawnPolygon) {
      const polygonBounds = new window.google.maps.LatLngBounds();
      const coordinates = drawnPolygon.getPath().getArray();

      coordinates.forEach((coordinate) => {
        polygonBounds.extend(coordinate);
      });

      const newPointsInPolygon = [];

      for (
        let lat = polygonBounds.getSouthWest().lat() + gridSpacing / 2;
        lat <= polygonBounds.getNorthEast().lat();
        lat += gridSpacing
      ) {
        for (
          let lng = polygonBounds.getSouthWest().lng() + gridSpacing / 2;
          lng <= polygonBounds.getNorthEast().lng();
          lng += gridSpacing
        ) {
          newPointsInPolygon.push({ lat, lng });
        }
      }

      const polygonPointObject = {
        polygon: index,
        points: newPointsInPolygon,
      };

      setPolygonPointList((prevList) => [...prevList, polygonPointObject]);
    }
  });
};


const closeDropdownOnOutsideClick = (event) => {
  if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setShowDropdown(false);
  }
}; // for outside 

useEffect(() => {
  // Add event listener to close the dropdown when clicking outside
  document.addEventListener('mousedown', closeDropdownOnOutsideClick);

  // Clean up the event listener when the component unmounts
  return () => {
    document.removeEventListener('mousedown', closeDropdownOnOutsideClick);
  };
}, [showDropdown]);


const clearMap = () => {
  shapesList.forEach((index, i) => {
    index.setMap(null);
  });
  setShapeList([]);
};


                    
//use effect for different fillings of map
useEffect(() => {
  if (polygonMap) {
    clearMap();
    if (selectedOption === "NDVI") {
      averageData();
    } else if (selectedOption === "No filling") {
      polygonState.forEach((index, i) => {
        const drawnPolygon = new window.google.maps.Polygon({
          paths: index.coordinates,
          strokeColor: "rgb(255, 231, 103)",
          strokeOpacity: 1.2,
          strokeWeight: 4,
          fillOpacity: 0.0,
        });

        setShapeList((prevshapesList) => [...prevshapesList, drawnPolygon]);

        //Polygon will be drawn on map
        drawnPolygon.setMap(polygonMap);
      });
    } 
    else if (selectedOption === "Contrasted NDVI") {
      computePoints(polygonCoordinatesString);
     }
  }
}, [polygonMap, polygonCoordinatesString, selectedOption]);




return (
  <>
  
  <header className="">
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 py-2.5">
          <div className="flex-1">
          <div className="flex-row items-center px-5 mr-30">
    {loading ? (
      <div className="flex items-center justify-center mr-35">
        <ThreeCircles
          height="30"
          width="60"
        /> 
      </div>
    ) : (
      <div>
        {/* Your content goes here */}
      </div>
    )}
  </div>

          </div>

                        <ul className="flex flex-row gap-4 items-center">
                <li>

                </li>
                
                <li>
                  <span className="h-9 w-9 cursor-pointer text-gray-600">
                    <FontAwesomeIcon icon={faMessage} />
                  </span>
                </li>
                <li>
                  <span className="h-9 w-9 cursor-pointer text-gray-600">
                    <FontAwesomeIcon icon={faBell} />
                  </span>
                </li>
                <li>
                  <div>
                    <label htmlFor="dropdown">Selected Farm:</label>
                    <select id="dropdown" value={selectedItemId} onChange={handleSelectChange}>
                      <option value="">Select Farm</option>
                      {farms.map((farm) => (
                        <option key={farm.id} value={farm.id}>
                          {farm.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <label htmlFor="dropdown">Filling:</label>
                    <select value={selectedOption} onChange={handlefillingChange}>
                      <option value="NDVI">NDVI</option>
                      <option value="Contrasted NDVI">Contrasted NDVI</option>
                      <option value="No filling">No filling</option>
                    </select>
                  </div>
                </li>
              </ul>
          </div>
        </div>
    </header>
  
      <div>
          <div class="flex h-full">    
          <div class='flex items-center justify-center'> 
{/* ---icon for the navbar--- */}
{isAsideVisible && (
          <FontAwesomeIcon
            icon={faAnglesLeft}
            onClick={toggleAsideVisibility}
          ></FontAwesomeIcon>
        )}

        {!isAsideVisible && (
          <FontAwesomeIcon
            icon={faAnglesRight}
            onClick={toggleAsideVisibility}
          ></FontAwesomeIcon>
        )}
          </div>            
          {/* sidenav for add fields */}
              {isAsideVisible && (
          <aside>
             <div class="md:w-80 min-h-full flex-col flex flex-shrink-0">             
             <text className="font-extrabold text-2xl text-black px-6 py-1" style={{ textAlign: 'center' }}>FIELDS</text>
            {/* <text className='font-lighter text-sm items-center text-black px-6 py-4'>Fields are the core of your farm records. Enter the fields details and draw on map to add field to your farms.😊</text> */}
{/*                         button for add field or draw field */}
<div class="flex w-full py-6">
  {/* This div will take up the remaining space on the left */}
  <div class="flex-grow"></div>

  <button class="flex-shrink-0 bg-green-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm mr-4"
    type='button'
    onClick={toggleDropdownDI}
  >
    +Add Field 
  </button>

<div class='relative'>
{/* div for the drop down of button */}
{showDropdown && (
        <div
          ref={dropdownRef}
          class="absolute right-0 mt-10  mr-4 bg-white border rounded-md shadow-lg"
        >
          <ul>
            <li
              onClick={() => handleOptionClick('Draw')}
              class="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
             Draw
            </li>
            <li
              onClick={() => handleOptionClick('Import')}
              class="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
             Import
            </li>
          </ul>
        </div>
      )}
</div>
</div>
 {/* button div ends  */}
 {selectedOptionforDT === 'Draw' && (
        <div class="mt-4 bg-gray-200 p-3 rounded-lg mr-4 ">

                  {/* Field Name*/}
                  <text className='font-lighter text-sm items-right text-black px-2 py-2'> Field Name</text>
                  <div class="w-full px-2 pb-6 items-center flex relative"> 
                      <input
                        id="fieldname"
                        type="text"
                        name="fieldname"
                        label="Field Name"
                        onChange={(e) => setFieldname(e.target.value)}
                        class="border-b text-sm w-full px-3  focus:outline-none focus:border-green-400"
                        placeholder="Field Name"
                      />
                  </div>
                  {/* Crop Type */}
                  <text className='font-lighter text-sm items-right text-black px-2 py-2'> Crop Type</text>
                  <div class="w-full px-2 pb-6 items-center flex relative"> 
                      <input
                        id="croptype"
                        type="text"
                        name="croptype"
                        label="Crop Type"
                        onChange={(e) => setCropType(e.target.value)}
                        class="border-b text-sm w-full px-3  focus:outline-none focus:border-green-400"
                        placeholder="e.g Corn "
                      />

                  </div>
                  
                  <text className='font-lighter text-sm items-right text-gray-500 px-1'>Draw the field on the map.It can be a polygon or a circle shaped field.Make predictions to check if the field contains corn crops.</text>

<div class="flex w-full justify-center py-6">
                      <button class="w-1/2 bg-green-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        id="submitform"
                        type='submit'
                        onClick={makePredictions}
                      >
                          Predict
                      </button>                    
                  </div> 
                  <div className="flex-row items-center px-5 mr-30 mb-2">
    {loadingofPredictions ? (
      <div className="flex items-center justify-center mr-35">
        <Hourglass
          height="30"
          width="60"
        /> 
      </div>
    ) : (
      cropFieldStatus !== null && (
        <div>
         
          {/* Display your content related to cropFieldStatus here */}
          <label class="text-sm mr-1 font-bold text-green-700">Prediction:</label>
          <span class="text-black font-normal m-1">{cropFieldStatus}</span>
        </div>
      )
    )}
  </div>
  <text className='font-lighter text-sm items-right text-gray-500  px-2'>Satisfied with the field? Click "Add Field" to successfully add field to the farm </text>
          {/* ADD FIELD BUTTON */}
                  <div class="flex w-full justify-center py-6">
                      <button class="w-full bg-green-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        id="submitform"
                        type='submit'
                        onClick={createField}
                      >
                          Add field
                      </button>                    
                  </div> 

        </div>   //divs to appear for draws ends 
      )}

<Popup open={isImportPopupOpen} modal nested>
{
  close => (
      <div class='modal'>
          <div class="px-6 relative">
          <FontAwesomeIcon
          icon={faSquareXmark}
          className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-red-500 transform scale-125"
          onClick={() => {
            close();
            setIsImportPopupOpen(!isImportPopupOpen); // Toggle the state
          }}
          />
          </div>
          <div class="font-semibold text-3xl items-center text-green-700 px-4 py-6">
              <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> Import KML 
          </div>
              <text className='font-lighter text-sm items-center text-black px-6 py-4'>We support .kml files.</text>
    <br></br>
    
    {/* <div className="mt-4 px-6">
  <label htmlFor="kmlFileInput" className="text-sm text-gray-600">
    KML File:
  </label>
  <br />
  <label htmlFor="kmlFileInput" className="cursor-pointer">
    <div className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
      <div>
        <FontAwesomeIcon icon={faUpload} />
      </div>
      <span>Choose KML File</span>
    </div>
    <input type="file" id="kmlFileInput" accept=".kml" onChange={handleFileChange} className="hidden" />
  </label>
</div> */}
 {/* <div className="mt-4 px-6">
          <label htmlFor="largeInput" className="text-sm text-gray-600">
              KML File:
          </label>
          <br></br>
          <input type="file" id="kmlFileInput" accept=".kml" onChange={handleFileChange} />
      </div> */}
{/* <div className="mt-4 px-6">
  <label htmlFor="kmlFileInput" className="text-sm text-gray-600">
    KML File:
  </label>
  <br />
  <input
    type="file"
    id="kmlFileInput"
    accept=".kml"
    onChange={handleFileChange}
    className="bg-emerald-100 border-emerald-600 text-emerald-800 px-3 py-2 rounded-lg text-sm "
  />
</div> */}

   <div class="mt-4 px-6 ">
      <label htmlFor="kmlFileInput" class="text-sm text-gray-600">
        KML File:
      </label>
      <br />
      <div class="relative  border border-emerald-600 rounded-lg  px-3 py-2 ">
        <input
          type="file"
          id="kmlFileInput"
          accept=".kml"
          onChange={handleFileChange}
          class="hidden"
        />
        <label
          htmlFor="kmlFileInput"
          class="bg-emerald-100 border-emerald-600 text-emerald-800 px-3 py-2 rounded-lg text-sm cursor-pointer"
        >
          Choose File
        </label>
        <span class="text-emerald-800 ml-2 ">
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
      </div>
    </div>
 
{/* button to upload the kml */}
<div class="mt-6 flex flex-row gap-4 px-6 justify-center">
  <button onClick={KML} class="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
    <div>
      <FontAwesomeIcon icon={faSquarePlus} />
    </div>
    <span>Upload KML</span>
  </button>
</div>
<br></br>


      </div>
  )
}
</Popup>


             </div>
          </aside>
          )}
   






              <div id="map" style={{ height: '660px', width: '100%' }}></div>
          </div>
    </div> 
  </>
  );
};


export default MapComponent;

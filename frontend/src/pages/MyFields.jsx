import React, { useState, useEffect } from 'react';
import { faBars, faBell, faMessage,faAnglesRight, faAnglesLeft,faPenSquare,faEye,faCircleChevronRight,faSquarePlus,faPersonDigging, faTrash, faArrowLeft, faPencil, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { getToken } from '../services/LocalStorageService';
import { toast } from "react-toastify";
import { data } from 'autoprefixer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import { ThreeCircles, Hourglass } from  'react-loader-spinner';
import icon from "./icon.png";


const MyFields = ({toggle}) => {
  const apiKey = 'AIzaSyBtZs5hI8Dzsn__RKWvo0ZDFpiJo53Pldc';
  const [farms, setFarms] = useState([]);                //fetch farms and set them
  const [seasons, setSeasons] = useState([]);             //fetch seasons
  const [selectedItemId, setSelectedItemId] = useState(null); 
  
  const [cordinatesofField, setCordinatesofField] = useState(null); 
  const [filteredJob, setFilteredJob] = useState([]);  
  const [farmId, setfarmId] = useState(null);
  const [seasonId, setSeasonId] = useState(null);
  const[farmlat, setfarmlat] = useState("30.3753");
  const[farmlon, setfarmlon] = useState("69.3451");
  const [fieldId, setFieldId] = useState(null);

  const [fieldsDataId, setFieldDataId] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const gridSpacing = 0.0000975;
  const [isAsideVisible, setIsAsideVisible] = useState(true);
  const [loadingofPredictions, setLoadingofPredictions] = useState(false);

  const toggleAsideVisibility = () => {
    setIsAsideVisible(!isAsideVisible);
    setFieldDetailVisable(false);
    setSelectedDisplay(null);
  };
  
  const [polygonPointList, setPolygonPointList] = useState([]);
  const [isFieldDetail, setFieldDetailVisable] = useState(false);
  const [selectedOption, setSelectedOption] = useState('No filling');
  const handlefillingChange = (event) => {
    setSelectedOption(event.target.value);
    setLoading(true);

  };

  const [inputType, setInputType] = useState('null');
  const [inputUnit, setInputUnit] = useState('null');
  const handleInputTypeChange = (event) => {
    setInputType(event.target.value);
  };
  const handleInputUnitChange = (event) => {
    setInputUnit(event.target.value);
  };

  const [polygonState, setPolygonState] = useState([]); // polygonState to handle the update polygons fields.
  const starting_date = "2023-08-20";
  const ending_date = "2023-08-24";
  
  const [polygonMap, setPolygonMap] = useState(); //set maps
  const [averagePolygonsComputedNDVI, setAveragePolygonsComputedNDVI] =  useState([]);

  const [averagePointComputedNDVI, setAveragePointComputedNDVI] = useState([]);
  const [shapesList, setShapeList] = useState([]);
  const[cropType, setCropType] = useState(null);//for fetching
  const[croptype, setcroptype] = useState(null);//for updating

  const[fieldName, setFieldName] = useState(null); //for fetching
  const[fieldname, setfieldname] = useState(null);//for changing
  const [loading, setLoading] = useState(false);


  
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
        strokeColor: "#FFFFFF",
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
      polygonList: mapData,
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
      console.log(response.data);;
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

  function recenterMap(lat, lng) {
    if (polygonMap && lat !== null && lng !== null) {
      const newCenter = new window.google.maps.LatLng(lat, lng);
      polygonMap.setCenter(newCenter);
    }
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing`;
    script.async = true;
    script.defer = true;
  
    // Create a function to initialize the map
    function initializeMap() {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 28.486753029366852, lng: 70.0956817623839 },
        zoom: 17,
      });
      setPolygonMap(map);
    }
  
    // Add an event listener to execute the initialization function when the script is loaded
    script.addEventListener("load", initializeMap);
  
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
     } catch (error) {
       console.error('Error fetching farms:', error);
     }
   };




const fetchSeason = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/season/my-seasons/', {
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data)
      setSeasons(response.data);
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  };




  useEffect(() => {
    fetchSeason();
   }, []);
   const [centerLat, setcenterLat] = useState(null);    
   const [centerLon, setcenterLon] = useState(null);   
   
   //use states for ML models
   const [harvestDate, setharvestDate] = useState(null);   
   const [loadingofharvestPredictions, setLoadingofharvestPredictions] = useState(false);
   
// ------------------------------------------------------------------------------
const handleFarm = (e) => {
    const selectedFarmId = (e.target.value);

    const filteredFarm = farms.find((item) => item.id === parseInt(e.target.value));
    setcenterLat(filteredFarm.latitude);
    setcenterLon(filteredFarm.longitude);
    setfarmId(selectedFarmId);


  };

  const handleSeasonSelect = (e) => {
    const selectedId = parseInt(e.target.value); // Parse selected ID to an integer
    setSelectedSeason(e.target.value); // Update selectedMonth state
    
    setSeasonId(selectedId);
  }

  useEffect(() => {
    if (farmId !== null && seasonId !== null) {
      fetchFieldsData(); // Call fetchFieldsData when both conditions are met
    }
  }, [farmId, seasonId]);

  
  const [mapData, setDataforMap] = useState([]); 
  const [fieldsData, setfieldsData] = useState([]); //for fields 
  const fetchFieldsData = async () => {
    try {
      if (farmId !== null && seasonId !== null) {
          const response = await axios.get(`http://127.0.0.1:8000/data/field-data/${farmId}/${seasonId}/`, {
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data);
      setfieldsData(response.data);
      setDataforMap(extractCoordinates(response.data));
  }
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  //to display Edit Field Functionality
  const [isEditField, setEditField] = useState(false);
  const toggleEditField = () => {
    setEditField(true);
  };
  const [isEditDate, setEditDate] = useState(false);
  const toggleEditDate = () => {
    setEditDate(true);
  };



        //for boundary 
  const [iseditable, setiseditable] = useState(false);      
  const [isEditBoundary, setEditBoundary] = useState(false);
  const toggleEditBoundary = () => {
    setEditBoundary(true);
    selectedPolygon.setEditable(true);
  };

  const makeharvestPredictions = async () => {
    setLoadingofharvestPredictions(true);
    const data = {
      season:"Winter",
      cropType:cropType,
      sowing_date:sowingdate,
    };
  
    try {
      const response = await axios.post(`http://127.0.0.1:8000/modelsML/harvestdate/`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
  
      // Check if the request was successful (status code 200)
      if (response.status === 200) {
       
        setharvestDate(response.data.Model_Predictions);
        // Now 'cropFieldStatus' holds the desired status
        console.log ("Response", response);
        
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
      setLoadingofharvestPredictions(false);
    }
  };

  const [ cropFertilizerStatus, setFertilizerStatus] = useState(null);
  const [loadingofFertilizerPredictions, setLoadingofFertilizerPredictions] = useState(false);
  const makeFertilizerPredictions = async () => {
    setLoadingofFertilizerPredictions(true);
    const coordinatesList = JSON.parse(cordinatesofField);
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
      const response = await axios.post(`http://127.0.0.1:8000/modelsML/fertilizerd/`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
  
      // Check if the request was successful (status code 200)
      if (response.status === 200) {
        // Parse the JSON response.data
        const modelPredictions = response.data['Model Predictions']
        if (modelPredictions == '[0]') {
          setFertilizerStatus('Field is not Fertilized');
        } else {
          setFertilizerStatus('Field is Fertilized');
        }
        console.log ("Response", response);
      } else {
        // Handle non-successful response (e.g., display an error message)
        console.error('Error:', response.statusText);
        toast.error('Error getting field fertilizer predictions', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Handle any exceptions that may occur during the request
      console.error('Error getting field fertilizer predictions:', error);
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }finally {
      // Set the loading state to false after the request is complete (whether it was successful or not)
      setLoadingofFertilizerPredictions(false);
    }
  };
  
  
  const handleMainDivClick = (id) => {
    // Assuming you want to set "JobDetailsDisplay" when a div is clicked
    const filteredItems = fieldsData.find((item) => item.id ===id);
    handleJobsFetchingonFieldClick(id);
    handleFetchingFieldDetailsonClick(filteredItems.field);
    setSelectedDisplay("JobDisplay");
    console.log(`Div clicked! Field: ${id}`);
  };





  const handleDivClick = (id) => {
    // Assuming you want to set "JobDetailsDisplay" when a div is clicked
    setSelectedDisplay("JobDetailsDisplay");
  
      // Filter the jOB based on the selected ID
      const filteredJob = jobsData.find((item) => item.id === id);
     setFilteredJob(filteredJob);
   

    console.log(`Div clicked! Field: ${id}`);
    // You can also use the field parameter if needed, for example:
    // setSelectedDisplay(`JobDetailsDisplay-${field}`);
  };



  const cancelButton  = () => {
  setEditBoundary(false);
  setEditCrop(false);
  setEditField(false);
  setEditDate(false);
  setSowingDate(null);
  setfieldname(null);
  setcroptype(null);
  
  selectedPolygon.setEditable(false);
  };

  const [isEditCrop, setEditCrop] = useState(false);
  const toggleEditCrop = () => {
    setEditCrop(true);
  };

//function for creating polygon adding info to id and giving it an id
const infoWindows = [];
function createPolygon(map, coordinates,info,id) {
    if (polygonState.some(p => p.id === id)) {
        return; // Return early if a polygon with the same id already exists
      }
      

const polygon = new window.google.maps.Polygon({
paths: coordinates,
strokeColor: "yellow",
strokeOpacity: 0.8,
strokeWeight: 3,
fillColor: "#FF0000",
fillOpacity: 0.35,
editable: false,
id: id, 
});        

// Add event listeners to track changes to the polygon
window.google.maps.event.addListener(polygon.getPath(), "set_at", function () {
var allCoordinates = JSON.stringify(getAllCoordinatesFromPolygon(polygon));
// setPolyCoordstring(allCoordinates);
// console.log(allCoordinates);
// console.log(polygonCoordString);

});

window.google.maps.event.addListener(polygon.getPath(), "insert_at", function () {
// Call your function to get all coordinates and do something with them
var allCoordinates = JSON.stringify(getAllCoordinatesFromPolygon(polygon));
// setPolyCoordstring(allCoordinates);
// console.log(allCoordinates);
// console.log(polygonCoordString);
});

function calculatePolygonArea(polygon) {
  const path = polygon.getPath();
  let area = 0;
  const numPoints = path.getLength();

  for (let i = 0; i < numPoints; i++) {
    const point1 = path.getAt(i);
    const point2 = path.getAt((i + 1) % numPoints);
    area += (point2.lng() - point1.lng()) * (point2.lat() + point1.lat());
  }

  area = Math.abs(area) / 2;
  return area;
}
const  LatLng = calculatePolygonCenter(coordinates)
const anchorLatLng = new window.google.maps.LatLng(LatLng);
const polygonArea = calculatePolygonArea(polygon);


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

 
//function for info 
function objectToHTMLString(obj) {
  const keys = Object.keys(obj);
  const contentString = keys.map((key) => {
    return `<strong>${key}:</strong> ${obj[key]}`;
  }).join("<br>");
  
  return `<div>${contentString}</div>`;
}

// //function to calculate area
// function calculateArea(coordinates) {
//   if (coordinates.length === 2) {
//     // Check if it's a circle (two coordinates represent the center and the radius)
//     const [center, radius] = coordinates;
//     const circleArea = Math.PI * Math.pow(radius, 2);
//     return circleArea;
//   } else if (coordinates.length === 4) {
//     // Check if it's a rectangle (four coordinates represent the corners)
//     // const pointA = coordinates[0];
//     // const pointB = coordinates[1];
//     // const pointC = coordinates[2];
//     // const pointD = coordinates[3];
//     // // Calculate the side lengths
//     // const width = Math.sqrt(Math.pow(pointB.lat - pointA.lat, 2) + Math.pow(pointB.lng - pointA.lng, 2));
//     // const height = Math.sqrt(Math.pow(pointC.lat - pointB.lat, 2) + Math.pow(pointC.lng - pointB.lng, 2));

//     // const rectangleArea = width * height;
//     let area = 0;
//     const numPoints = coordinates.length;

//     for (let i = 0; i < numPoints; i++) {
//       const point1 = coordinates[i];
//       const point2 = coordinates[(i + 1) % numPoints];
//       area += (point2.lng - point1.lng) * (point2.lat + point1.lat);
//     }

//     area = Math.abs(area) / 2;
//     return convertArea(area);
//     // return  rectangleArea;
//   } else {
//     return "Unsupported shape. Please provide either a circle (2 coordinates) or a rectangle (4 coordinates).";
//   }
// }
// //conversion of map area to acutal area
// function convertArea(area, targetUnit) {
//   const squareMetersToAcres = 0.000247105;
  
//   switch (targetUnit) {
//     case 'acres':
//     return (area * squareMetersToAcres).toPrecision(5);
//     case 'square-kilometers':
//       return (area * 1e-6).toPrecision(3);
//     default:
//       return area.toPrecision(5); // Default to square meters
//   }
// }



function extractCoordinates(fieldData) {
    const result = [];
    fieldData.forEach((item) => {
      const coordinates = JSON.parse(item.fieldscoordinates);
      const latLngArray = coordinates.map((coord) => ({
        lat: coord.lat,
        lng: coord.lng,
      }));
  
      // Extract additional information (field name and season)
      const info = {
        fieldName: item.field_name,
        crop:item.crop_type,
     
      };
  
      // Create an object that includes both coordinates and info
      const dataWithInfo = {
        id: item.field,
        coordinates: latLngArray,
        info: info,
        job: item.jobs, // Add the 'job' attribute here
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


const clearMap = () => {
  shapesList.forEach((index, i) => {
    index.setMap(null);
  });
  setShapeList([]);
};

const [selectedPolygon, setselectedPolygon] = useState(null); 

const handleAddJob = (itemId) => {
//  setSelectedDisplay("addJob");
 const filteredItems = fieldsData.find((item) => item.field === itemId);
 setFieldDataId(filteredItems.id);
}

          //fetch farms and set them
const [jobsData, setjobsData] = useState([]);  

const fetchFieldsJobs = async (id) => {
  try {
        const response = await axios.get(`http://127.0.0.1:8000/data/field-data/${id}/jobs/`, {
      headers: {
       'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    });
    console.log(response.data);
    setjobsData(response.data);
   

  } catch (error) {
    console.error('Error fetching Jobs:', error);
  }
};


const handleJobsFetchingonFieldClick = (itemId) => {
   fetchFieldsJobs(itemId);
   fetchCompeltedJobs(itemId);
   fetchInCompelteJobs(itemId);
   const filteredItems = fieldsData.find((item) => item.id === itemId);
   setFieldDataId(filteredItems.id);
  }
  


const handleFetchingFieldDetailsonClick = (itemId) => {
 // Filter the data based on the selected ID
 const filteredItems = fieldsData.find((item) => item.field === itemId);
 setCropType(filteredItems.crop_type);
 setFieldName(filteredItems.field_name);
 setFieldId(filteredItems.field);
 setFieldDataId(filteredItems.id);
 setsowingdate(filteredItems.sowing_date); //date to be passed 
 setCordinatesofField(filteredItems.fieldscoordinates);
 

//  console.log(typeof polygonCoordString);
    const matchingPolygon = polygonState.find(polygon => polygon.id === itemId);

  if (matchingPolygon) {
    recenterMap(calculatePolygonCenter (JSON.parse(filteredItems.fieldscoordinates)));
    setselectedPolygon(matchingPolygon); 
  } 

 
 

 //else {
  //   console.log('not working');
  //   console.log('Number of polygons in the array:', polygonState.length);
  //   console.log(itemId);
  //   polygonState.forEach(polygon => {
  //     console.log('Polygon ID:', polygon.id);
  //   });
  // }
};




function getAllCoordinatesFromPolygon(polygon) {
  const allCoordinates = [];
  polygon.getPaths().forEach(path => {
    const pathCoordinates = path.getArray().map(latlng => ({
      lat: latlng.lat(),
      lng: latlng.lng(),
    }));
    allCoordinates.push(pathCoordinates);
  });
  return allCoordinates;
}


const updateBoundary = async () => {
  const polygonCoordinates = JSON.stringify(getAllCoordinatesFromPolygon(selectedPolygon)[0]);
  try {
    const response = await axios.patch(` http://127.0.0.1:8000/data/field-data/${fieldsDataId}/update/`, {
      fieldscoordinates:polygonCoordinates,
  }, {
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${access_token}`
       }
    });
    toast.info("Coordinates Successfuly Updated", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });
    // Reset input fields
    selectedPolygon.setEditable(false);
    setiseditable(false);
    fetchFieldsData();
    setEditBoundary(false);
  } catch (error) {
      toast.info("Unable to change edit coordinates. ", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        }); 
        console.error(error.response.data)
     
      }
};

const updateSowingDate = async () => {
 ;
  try {
    const response = await axios.patch(` http://127.0.0.1:8000/data/field-data/${fieldsDataId}/update/`, {
      sowing_date:sowingDate
  }, {
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${access_token}`
       }
    });
    toast.info("Sowing Date Successfuly Updated", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });
    // Reset input fields
    fetchFieldsData();
    setEditDate(false);
    setsowingdate(sowingDate);
    setSowingDate(null);
  } catch (error) {
      toast.info("Unable to change edit sowing date. ", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        }); 
        console.error(error.response.data)
     
      }
};



const updateFieldname = async () => {
    try {
      const response = await axios.patch(` http://127.0.0.1:8000/data/update-field-name/${fieldId}/`, {
        field_name:fieldname,
    }, {
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${access_token}`
         }
      });
      console.log(response.data);
      toast.info("Field Name Successfully updated. ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      // Reset input fields
      document.getElementById('fieldname').value =null;
      setEditField(false);
      setFieldName(fieldname);
      fetchFieldsData();
    } catch (error) {
        toast.info("Unable to change name. ", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });  
          console.log(fieldName);}
  };

const updateCropName = async () => {
    try {
      const response = await axios.patch(` http://127.0.0.1:8000/data/field-data/${fieldsDataId}/update/`, {
        crop_type:croptype,
    }, {
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${access_token}`
         }
      });
      console.log(response.data);
      console.log(croptype);
      toast.info("Crop Type Successfully updated. ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      // Reset input fields
      document.getElementById('croptype').value =null;
      setEditCrop(false);
      setCropType(croptype);
      fetchFieldsData();
    } catch (error) {
        toast.info("Unable to change crop type. ", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          }); 
          console.error(error.response.data)
       
        }
  };


  const markasDone = async (id) => {
    try {
      const response = await axios.patch(` http://127.0.0.1:8000/data/update-job-complete/${id}/`, {
    }, {
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${access_token}`
         }
      });
      toast.info("Job Successfuly marked as done", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      // Reset jobs fetching 
      fetchCompeltedJobs(fieldsDataId);
      fetchInCompelteJobs(fieldsDataId);
     
    } catch (error) {
        toast.info("Unable to change mark job as done. ", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          }); 
          console.error(error.response.data)
       
        }
  };
  


useEffect(() => {
  if (polygonMap) {
    clearMap();
    if (selectedOption === "NDVI") {
      averageData();
    } else if (selectedOption === "No filling") {
      recenterMap(centerLat,centerLon)
      mapData.forEach((dataItem) => {
      const info =objectToHTMLString(dataItem.info)
      const polygonid =dataItem.id;
      createPolygon(polygonMap, dataItem.coordinates, info,polygonid);
      
    });
      
    } 
    else if (selectedOption === "Contrasted NDVI") {
      computePoints(mapData);
     }
  }
}, [ polygonState, mapData, selectedOption]);

const [selectedDisplay, setSelectedDisplay] = useState(null);

//function to display the add new field menu
const displayAddField = () => {
  setFieldDetailVisable(true);
  };
  const [sowingDate, setSowingDate] = useState(null); //for updating...
  const [sowingdate, setsowingdate] = useState(null); //date to be passed/fetched from backend
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleStartDateChange = (date) => {
      setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
};
const handleSowingDateChange = (date) => {
  setSowingDate(date);
};
  //function to cancel and go back to displaying the list of Fields
  const cancelEditField = () => {
    setFieldDetailVisable(false);
    setSelectedDisplay(null);
    setEditBoundary(false);
    setEditCrop(false);
    setCropType(null);
    setfieldname(null);
    setFieldId(null);
    setFieldDataId(null);
    setStartDate(null);
    setEndDate(null);
    setInputType('null');
    setInputUnit('null');
    setJobType(null);
    setWeight(null);
    setInputName(null);
    setN(null);
    setP(null);
    setNa(null);
    setK(null);
    setMg(null); 
    setS(null);
    
    };

    const backJobDetails = () => {
      setSelectedDisplay('JobDisplay');
            };
    const backtoJob = () => {
       setSelectedDisplay('JobDisplay');
            };
  
//function to extract only usefull stuff from the input fields of jobs
function filterNonNullFields(inputString) {
  const fieldPairs = inputString.split(', ');

  // Filter out fields with null values or values like '%null'
  const nonNullFields = fieldPairs
    .map(pair => pair.split(':'))
    .filter(([_, value]) => value !== 'null' && value !== '%null')
    .map(([field, value]) => `${field}:${value}`)
    .join(', ');
  return nonNullFields;
}           

const [jobType, setJobType] = useState(null);
const handleRadioChange = (event) => {
  setJobType(event.target.value);
};
const[weight, setWeight] = useState(null);
const[inputName, setInputName] = useState(null);
const [N, setN] = useState(null);
const [P, setP] = useState(null);
const [K, setK] = useState(null);
const [Na, setNa] = useState(null);
const [Mg, setMg] = useState(null);
const [S, setS] = useState(null);


const [selectedJobsDisplay, setSelectedJobsDisplay] = useState('jobsincomplete');
const [jobsComplete, setCompleteJobs] = useState([]);
const [jobsInComplete, setInCompleteJobs] = useState([]);
const handleJobFetch = (e) => {
  if (e.target.value === "jobscomplete" || e.target.value === "jobsincomplete") {
     setSelectedJobsDisplay(e.target.value);
    }
    else 
 setSelectedDisplay(e.target.value)  ;
};


  const fetchCompeltedJobs = async (id) => {
    try {
          const response = await axios.get(`http://127.0.0.1:8000/data/fields/${id}/complete-jobs/`, {
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data);
      setCompleteJobs(response.data);
     
  
    } catch (error) {
      console.error('Error fetching Completed Jobs:', error);
    }
  };
  
  const fetchInCompelteJobs = async (id) => {
    try {
          const response = await axios.get(`http://127.0.0.1:8000/data/fields/${id}/incomplete-jobs/`, {
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data);
      setInCompleteJobs(response.data);
     
  
    } catch (error) {
      console.error('Error fetching In-Complete Jobs:', error);
    }
  };


  const [dataWeather, setDataWeather] = useState({})
  const apiKeyOpenWeather = "307e6140e27ea53dea55978dc39f2724"
  // const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${centerLat}&lon=${centerLon}&units=imperial&appid=${apiKeyOpenWeather}`;

  // const searchLocation = (event) => {
  //   if (event.key === 'Enter') {
  //     axios.get(url).then((response) => {
  //       setData(response.data)
  //       console.log(response.data)
  //     })
  //     setLocation('')
  //   }
  // }
  useEffect(() => {
    // Fetch weather data whenever latitude and longitude values change
    if (centerLat !== '' && centerLon !== '') {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${centerLat}&lon=${centerLon}&units=imperial&appid=${apiKeyOpenWeather}`;

      axios.get(url).then((response) => {
        setDataWeather(response.data);
        console.log(response.data);
      });
    }
  }, [centerLat, centerLon, apiKeyOpenWeather]);

    const handleNChange = (event) => {
      setN(event.target.value);
    };
  
    const handlePChange = (event) => {
      setP(event.target.value);
    };
  
    const handleKChange = (event) => {
      setK(event.target.value);
    };
  
    const handleNaChange = (event) => {
      setNa(event.target.value);
    };
  
    const handleMgChange = (event) => {
      setMg(event.target.value);
    };
  
    const handleSChange = (event) => {
      setS(event.target.value);
    };

    const dataString = `Name:${inputName}, Type:${inputType}, Weight:${weight} ${inputUnit}, N%:${N}, P%:${P}, K%:${K}, Na%:${Na}, Mg%:${Mg}, S:%${S}`;
    const AddJob = async () => {
     ;
      try { 
        const response = await axios.post( `http://127.0.0.1:8000/data/fields/${fieldsDataId}/jobs/`
        , {
         job_type:jobType,
         start_month:startDate,
         end_month:endDate,
         input:dataString
          
      }, {
          headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${access_token}`
           }
        });
        toast.info("Job Added Successfully", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        // Reset input fields
        setFieldDataId(null);
        setStartDate(null);
        setEndDate(null);
        setInputType('null');
        setInputUnit('null');
        setJobType(null);
        setWeight(null);
        setInputName(null);
        setN(null);
        setP(null);
        setNa(null);
        setK(null);
        setMg(null); 
        setS(null);
           } catch (error) {
          toast.info("Unable to Add Job. ", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1000,
            }); 
            console.error(error.response.data)
         
          }
    };

    return (
  <>
  
  <header class="">
        <div class="shadow-sm bg-pink-900">
          <div class="relative bg-white flex w-full items-center px-5 py-2.5">
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

            <div class="">
              <ul class="flex flex-row gap-4 items-center">
                <li>
                  <span class="h-9 w-9 cursor-pointer text-gray-600">
                    <FontAwesomeIcon icon={faMessage} />
                  </span>
                </li>
                <li>
                  <span class="h-9 w-9 cursor-pointer text-gray-600">
                    <FontAwesomeIcon icon={faBell} />
                  </span>
                </li>
                <li>
                  <span>
                    {/* dropdown code */}
                    <div>
                      <label htmlFor="dropdown">Selected Farm:</label>
                      <select id="dropdown" value={selectedItemId} onChange={handleFarm}>
                      <option value="">Select Farm</option>
                        {farms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.name}
                          </option>
                        ))}
                      </select> 
                   </div>      
                  </span>
                </li>
                <li>
                  <span>
                    {/* dropdown code */}
                    <div>
                      <label htmlFor="dropdown">Selected Season:</label>
                      <select value={selectedSeason} onChange={handleSeasonSelect}>
                        <option value="">Select a season</option>
                        {seasons.map((season) => (
                          <option key={season.id} value={season.id}>
                            {season.name}
                          </option>
                        ))}
                      </select>
                   </div>      
                  </span>
                </li>
                <li>
                  <span>
                    {/* dropdown code */}
                    <div>
                      <label htmlFor="dropdown">Filling:</label>
                      <select value={selectedOption} onChange={handlefillingChange}>
                        <option value="NDVI">NDVI</option>
                        <option value="Contrasted NDVI">Contrasted NDVI</option>
                        <option value="No filling">No filling</option>
                      </select>
                   </div>      
                  </span>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </header>
  
<div class='h-screen overflow-hidden'>
          <div class="flex h-full">
          <div class='flex items-center justify-center bg-white'> 
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
          <aside class=' h-full '>
             <div class="md:w-80  h-full flex-col flex flex-shrink-0">
             {/* div to display the back button on adding field */}
             {selectedDisplay === 'addJob' || selectedDisplay === 'FieldUpdate' || selectedDisplay === 'JobDisplay' || selectedDisplay === 'JobDetailsDisplay'|| selectedDisplay === 'makepredictionDisplay' ?  (
    <div class="top-0 left-0">
      <FontAwesomeIcon
        icon={faArrowLeft}
        onClick={selectedDisplay === 'JobDetailsDisplay' 
         ? backJobDetails 
        : selectedDisplay === 'addJob'
        ? backtoJob
        : cancelEditField}
        // onClick={cancelEditField}
        className="fa-lg cursor-pointer"
      />
    </div>
  )  : null}

             <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-3">
<div className="flex items-center justify-center space-x-2">
  <img
    src={icon}
    alt="Your Icon Alt Text"
    className="h-20 w-20"
  />
  <span className="font-extrabold text-2xl text-green-700 px-6 py-1">My Fields</span>
</div>
</div>
             {/* <p className="font-extrabold text-2xl text-black px-6 py-1" style={{ textAlign: 'center' }}>FIELDS</p> */}

        
          {/* div to map display divs */}
        
          {selectedDisplay === 'FieldUpdate' ? (
        <div>
 <div class='overflow-y-auto mr-4'>

<div class="grid grid-rows-5 gap-1 mb-5">
      <div class=" p-2 mb-3">
      <div class="grid grid-cols-3 h-5 gap-2">
        <div class=" ...">
            <h2 class="text-green-600 font-bold">Boundary</h2>
        </div>
        <div class="..."> </div>
        <div class="... ">
        <button onClick={toggleEditBoundary} class="bg-transparent text-emerald-600 rounded-lg shadow-lg text-xl flex items-center">
        <FontAwesomeIcon icon={faPenSquare} />
      </button>
        </div>
  </div>
  {isEditBoundary && (
    <div class="grid grid-rows-2 gap-2">
     
      <div class="text-sm ...">
        Adjust the boundaries on the map by dragging them to the desired location
      </div>
      <div class="mx-auto space-x-4"> {/* Adjust the mt and space-x values as needed */}
        <button
          onClick={updateBoundary}
          class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Save
        </button>
        <button
          onClick={cancelButton}
          class="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
     {!isEditBoundary && (
    <div class="grid grid-rows-2">
       <div class="bg-green-500 mt-3 h-1"></div>
       <div class="px-4 text-base text-gray-500 italic">
</div>
    </div>
  )}
  
      </div>
      <div class=" p-2 mb-3">
      <div class="grid grid-cols-3 h-5 gap-2">
        <div class="...">
            <h2 class="text-green-600 font-bold">Field Name</h2>
        </div>
        <div class="..."> </div>
        <div class="... ">
        <button onClick={toggleEditField} class="bg-transparent text-emerald-600 rounded-lg shadow-lg text-xl flex items-center">
        <FontAwesomeIcon icon={faPenSquare} />
      </button>
        </div>
  </div>
  {!isEditField && (
    <div class="grid grid-rows-2">
       <div class="bg-green-500  mt-3 h-1"></div>
       <div class=" px-4 text-base text-gray-500 italic">
  {fieldName}
</div>
    </div>
  )}

  {isEditField && (
    <div class="grid grid-rows-2">
       <div class="...">
        <input
          id="fieldname"
          type="text"
          name="fieldname"
          label="Field Name"
          onChange={(e) => setfieldname(e.target.value)}
          class="border-b text-sm w-full px-3 focus:outline-none focus:border-green-400"
          placeholder="Field Name"
        />
      </div>
     
          <div class="mx-auto space-x-4"> {/* Adjust the mt and space-x values as needed */}
        <button
          onClick={updateFieldname}
          class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Save
        </button>
        <button
          onClick={cancelButton}
          class="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

      
      </div>   
      <div class=" p-2 mb-5">
      <div class="grid grid-cols-3 h-5 gap-2">
        <div class="...">
            <h2 class="text-green-600 font-bold">Crop Name</h2>
        </div>
        <div class="..."> </div>
        <div class="... ">
        <button onClick={toggleEditCrop} class="bg-transparent text-emerald-600 rounded-lg shadow-lg text-xl flex items-center">
        <FontAwesomeIcon icon={faPenSquare} />
      </button>
        </div>
  </div>
  {isEditCrop && (
    <div class="grid grid-rows-2 gap-2">
       <div class="...">
        <input
          id="croptype"
          type="text"
          name="croptype"
          label="Crop Name"
          onChange={(e) => setcroptype(e.target.value)}
          class="border-b text-sm w-full px-3 focus:outline-none focus:border-green-400"
          placeholder="Crop Type"
        />
      </div>
     
          <div class="mx-auto space-x-4"> {/* Adjust the mt and space-x values as needed */}
        <button
          onClick={updateCropName}
          class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Save
        </button>
        <button
          onClick={cancelButton}
          class="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

{!isEditCrop && (
    <div class="grid grid-rows-2">
       <div class="bg-green-500 mt-3 h-1"></div>
       <div class=" px-4 text-base text-gray-500 italic">
  {cropType}
</div>
    </div>
  )}

      
      
      
      
      
      
      </div>
      <div class=" p-2 mb-3">
      <div class="grid grid-cols-3 h-5 gap-2">
        <div class="...">
            <h2 class="text-green-600 font-bold">Sowing Date</h2>
        </div>
        <div class="..."> </div>
        <div class="... ">
        <button onClick={toggleEditDate} class="bg-transparent text-emerald-600 rounded-lg shadow-lg text-xl flex items-center">
        <FontAwesomeIcon icon={faPenSquare} />
      </button>
        </div>
  </div>
  {!isEditDate && (
    <div class="grid grid-rows-2">
       <div class="bg-green-500  mt-3 h-1"></div>
       <div class=" px-4 text-base text-gray-500 italic">
    {moment(sowingdate).format('YYYY-MM-DD')}
</div>
    </div>
  )}

  {isEditDate && (
    <div class="grid grid-rows-2">
       <div class="..."> 
       <div class="flex px-2 mr-10 mb-2 mt-2">
   <DatePicker
     selected={sowingDate}
     onChange={handleSowingDateChange}
     placeholderText="Select Sowing Date"
     dateFormat="dd MMMM yyyy"
     className="text-green-700 text-center placeholder-green-700 px-2 mr-10 rounded-md border border-green-900 w-full  focus:outline-none focus:border-green-900 mt-1"
   />
 </div>
      </div>
           
          <div class="mx-auto space-x-5"> {/* Adjust the mt and space-x values as needed */}
        <button
          onClick={updateSowingDate}
          class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Save
        </button>
        <button
          onClick={cancelButton}
          class="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white rounded-lg shadow-lg text-sm px-5 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

      
      
      
      
      
      
      </div>  
        </div>
</div>          
          
          
          
          {/* Content for Option 1 */}
        </div>
      ) : selectedDisplay === 'addJob' ? (
        <div class="flex:1 flex">
{/* so everything is scrollable */}
        <div class="flex flex-col">
{/* flex that has dynamic rows */}
        <div class=" p-1 mb-2">
{/* row 1  */}
          <div class="mr-2">
            <span class="text-green-600 font-bold">Select Job Type:</span>
          </div>
              <div class="flex flex-col px-3 py-1">
              <div class="flex flex-col">
                <label class="inline-flex items-center">
                  <input type="radio" class="form-radio bg-green-900 " name="options" value="Fertilizing" onChange={handleRadioChange}/>
                  <span class="ml-2 text-green-700 font-bold text-sm">Fertilizing</span>
                </label>
              </div>
              <div class="flex flex-col">
                <label class="inline-flex items-center">
                  <input type="radio" class="form-radio bg-green-900 " name="options" value="Harvesting" onChange={handleRadioChange} />
                  <span class="ml-2 text-green-700 font-bold text-sm">Harvesting</span>
                </label>
              </div>
              <div class="flex flex-col">
                <label class="inline-flex items-center">
                  <input type="radio" class="form-radio bg-green-900 checked:bg-green-900 text-green-500 " name="options" value="Irrigating" onChange={handleRadioChange} />
                  <span class="ml-2 text-green-700 font-bold text-sm">Irrigating</span>
                </label>
              </div>
            </div>
       
          
          
        </div>
          <div class=" p-2">
          <div class="mr-2">
            <span class="text-green-600 font-bold">Select Start Date:</span>
          </div>
          <div class="flex px-5 mr-5">
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        // autoComplete="off"
        // showMonthYearPicker
        placeholderText="Select Start Date"
        dateFormat="dd MMMM yyyy"
        className="text-green-700 text-center placeholder-green-700 px-2 mr-5 rounded-md border border-green-900 w-3/4  focus:outline-none focus:border-green-900 mt-1"
      />
    </div>




          </div>
         <div class=" p-2">
         <div class="mr-2 mb-2">
            <span class="text-green-600 font-bold">Select Input Type and Unit:</span>
          </div> 
     
                      
         <div class="flex flex-wrap mb-2">
          
          <div class="flex-1">
            <label class="text-sm mr-1 font-bold text-green-700">Weight:</label>
            <input
              id="weight"
              type="number"
              name="weight"
              label="Weight"
              onChange={(e) => setWeight(e.target.value)}
              class="border-b text-sm w-2/4 focus:outline-none focus:border-green-400"
              placeholder="Weight"
            />
          </div>
          <div class="flex-1">
            <label class="text-sm font-bold mr-1 text-green-700" htmlFor="dropdown">Unit:</label>
            <select value={inputUnit} onChange={handleInputUnitChange}>
              <option value="Litres">Litres</option>
              <option value="Kilograms">Kilograms</option>
              <option value="Gallons">Gallons</option>
              <option value="null">Choose one</option>
            </select>
          </div>

        
         </div>
        <div class='flex flex-wrap'>
        <div class="flex-1">
            <label class="text-sm mr-1 font-bold text-green-700">Name:</label>
            <input
              id="inputname"
              type="text"
              name="InputName"
              label="InputName"
              onChange={(e) => setInputName(e.target.value)}
              class="border-b text-sm w-2/4 focus:outline-none focus:border-green-400"
              placeholder="Weight"
            />
          </div>

          
          <div class='flex-1'>
                      <label class='text-sm font-bold mr-1  text-green-700 ' htmlFor="dropdown">Type:</label>
                      <select value={inputType} onChange={handleInputTypeChange}>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Seed">Seed</option>
                        <option value="Spray">Spray</option>
                        <option value="null">Choose one</option>
                      </select>
        </div> 

        </div>   
        </div>           

        {inputType === 'Fertilizer' ? (
  <div class="flex flex-wrap">
    <div class="w-1/3 p-2">
      <label for="number1" class="block text-gray-700 text-sm font-bold">  N %
:</label>
      <input type="number" id="N" class="w-full border border-gray-300 rounded p-1" value={N} onChange={handleNChange}/>
    </div>

    <div class="w-1/3 p-2">
      <label for="number2" class="block text-gray-700 text-sm font-bold"><p>
 P- P<sub>2</sub> O<sub>5</sub>       %:
</p>
</label>
      <input type="number" id="P" class="w-full border border-gray-300 rounded p-1" value={P} onChange={handlePChange}/>
    </div>

    <div class="w-1/3 p-2">
      <label for="number3" class="block text-gray-700 text-sm font-bold">
      <p>
      K - K<sub>2</sub> O%:
    </p>
      
      </label>
      <input type="number" id="K" class="w-full border border-gray-300 rounded p-1" value={K} onChange={handleKChange}/>
    </div>

    <div class="w-1/3 p-2">
      <label for="number4" class="block text-gray-700 text-sm font-bold"> <p> Na-Na<sub>2</sub>O%:</p> 
</label>
      <input type="number" id="Na" class="w-full border border-gray-300 rounded p-1" value={Na} onChange={handleNaChange}/>
    </div>

    <div class="w-1/3 p-2">
      <label for="number5" class="block text-gray-700 text-sm font-bold">MgO %:</label>
      <input type="number" id="Mg" class="w-full border border-gray-300 rounded p-1" value={Mg} onChange={handleMgChange}/>
    </div>

    <div class="w-1/3 p-2">
      <label for="number6" class="block text-gray-700 text-sm font-bold">
      <p> S-SO<sub>3</sub>%:</p> 
    </label>
      <input type="number" id="S" class="w-full border border-gray-300 rounded p-1" value={S} onChange={handleSChange}/>
    </div>
  </div>
 ) : null}



         <div class=" p-2">
          
            <div class="mr-2">
              <span class="text-green-600 font-bold">Select End Date</span>
            </div>
            <div class="flex px-5 mr-5">
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    // autoComplete="off"
                    // // placeholderText="Select a date"
                    // showMonthYearPicker
                    placeholderText="Select End Date"
                    dateFormat="dd MMMM yyyy"
                    className="text-green-700 text-center placeholder-green-900 px-2 mr-5 rounded-md border border-green-900 w-3/4  focus:outline-none focus:border-green-900 mt-1"
                  />
            </div>

             
         </div>


          
          <div class="flex justify-center items-center p-2">
                        <button 
                        onClick={AddJob}
                          class="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
                        <div>
                            <FontAwesomeIcon icon={faSquarePlus} />
                        </div>
                        <span>Add Job</span>
                        </button>
                </div>

          
        
        </div>
        
      </div>
      ) : selectedDisplay === 'makepredictionDisplay' ? (
        <div class="flex:1 flex">
{/* so everything is scrollable */}
        <div class="flex flex-col">
{/* flex that has dynamic rows */}
        <div class="bg-white p-1 mb-2">
{/* row 1  */}
          <div class="mr-2">
            <span class="text-green-600 font-bold">Harvest Date Prediction</span>
          </div>
          <text className='font-lighter text-sm items-right text-gray-500 px-1'>Predict the optimal harvest date for your crops using advanced machine learning algorithms. Our system will analyze relevant factors to provide you with an accurate estimate.</text>  
              <div>
  {/* //div for harvest date button and prediciton */}
<div class="flex w-full justify-center py-6">
                      <button class="w-1/2 bg-green-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        id="submitform"
                        type='submit'
                        onClick={makeharvestPredictions}
                      >
                          Predict Harvest Date
                      </button>                    
                  </div> 
                  <div className="flex-row items-center px-5 mr-30 mb-2">
    {loadingofharvestPredictions ? (
      <div className="flex items-center justify-center mr-35">
        <Hourglass
          height="30"
          width="60"
        /> 
      </div>
    ) : (
      harvestDate !== null && (
        <div>
         
          {/* Display your content related to cropFieldStatus here */}
          <label class="text-sm mr-1 font-bold text-green-700">Prediction:</label>
          <span class="text-black font-normal m-1">{harvestDate}</span>
        </div>
      )
    )}
  </div>
            </div>          
        </div>
<div class="bg-white p-1 mb-2">
{/* row 2  */}
          <div class="mr-2">
            <span class="text-green-600 font-bold">Fertilizser Detection</span>
          </div>
          <text className='font-lighter text-sm items-right text-gray-500 px-1'>Predict whether the crop has been fertilized or not using our advanced machine learning algorithms. Our system will analyze relevant factors to provide you with an accurate estimate.</text>
              <div>
  {/* //div for harvest date button and prediciton */}
<div class="flex w-full justify-center py-6">
                      <button class="w-1/2 bg-green-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        id="submitform"
                        type='submit'
                        onClick={makeFertilizerPredictions}
                      >
                          Detect Fertilizer
                      </button>                    
                  </div> 
                  <div className="flex-row items-center px-5 mr-30 mb-2">
    {loadingofFertilizerPredictions ? (
      <div className="flex items-center justify-center mr-35">
        <Hourglass
          height="30"
          width="60"
        /> 
      </div>
    ) : (
      cropFertilizerStatus !== null && (
        <div>
         
          {/* Display your content related to cropFieldStatus here */}
          <label class="text-sm mr-1 font-bold text-green-700">Prediction:</label>
          <span class="text-black font-normal m-1">{cropFertilizerStatus}</span>
        </div>
      )
    )}
  </div>
            </div>          
        </div>

        </div>
        
      </div>
      ): selectedDisplay === 'JobDisplay' ? (
//div for displaying job
<div class='h-full relative'>
      <div className="text-right mr-4">
      <label class="text-sm font-bold mr-1 text-green-700" htmlFor="dropdown">Display</label>
      <select
        value={selectedJobsDisplay}
        onChange={handleJobFetch}
      class='text-center'>
        {/* <option value="option1">All Jobs </option> */}
        <option value="jobscomplete">Completed Jobs</option>
        <option value="jobsincomplete">Incomplete Jobs</option>
        <option value="makepredictionDisplay">Make Predictions</option>
        <option value="FieldUpdate">Edit Field</option>

      </select>
    </div>
                     

{jobsData.length === 0 ? (
    // Display this when fieldsData is empty
    <div class='flex flex-col items-center mt-16'>
    <div class='p-2 text-center'>
      No job Data found
    </div>
    
<div  class='p-2  h-[10%] bottom-0 left-0 w-full  flex justify-center items-center ' > 
{/* div containing add field button at button */}
      <button
        onClick={() => {
          setSelectedDisplay("addJob");
        }}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mb-2 w-1/2"
      >
        <span>
          <FontAwesomeIcon icon={faPersonDigging} />
          Add Job
        </span>
      </button>
</div>
  </div>
  ) : (
<div  class='m-2 p-2 h-[90%]  mb-3' >
<div  class='m-2 p-2 max-h-[80%] h-[80%] mb-3 overflow-y-auto' >
  {/* //div to display the jobs data.  */}
 {selectedJobsDisplay === 'jobscomplete' ? (
      <div>
        {/* Render jobsComplete here */}
        {jobsComplete.map((item) => (
   <div class ="w-full p-3 m-1 mr-2 bg-white border border-gray-300 rounded-lg transition hover:bg-green-500 hover:text-white relative"
   key={item.field}
   onClick={() => handleDivClick(item.id)} 
   >
       <div class="mr-2">
      <span class="text-green-800 font-bold">Job Type: </span>
      <span class="text-black font-normal">{item.job_type}</span>
          </div>
      <div class="mr-2">
      <span class="text-green-800 font-bold">End Date: </span>
      <span class="text-black font-normal">{moment(item.end_month).format('YYYY-MM-DD')}</span>
          </div>

    </div>
  )) }
      </div>
    ) : selectedJobsDisplay === 'jobsincomplete' ? (
      <div>
        {/* Render jobsInComplete here */}
        {jobsInComplete.map((item) => (
   <div class ="w-full p-3 m-1 mr-2 bg-white border border-gray-300 rounded-lg transition hover:bg-green-500 hover:text-white relative"
   key={item.id}
   onClick={() => handleDivClick(item.id)} 
   >
       <div class="mr-2">
      <span class="text-green-800 font-bold">Job Type: </span>
      <span class="text-black font-normal">{item.job_type}</span>
          </div>
      <div class="mr-2">
      <span class="text-green-800 font-bold">End Date: </span>
      <span class="text-black font-normal">{moment(item.end_month).format('YYYY-MM-DD')}</span>
          </div>
       </div>
  )) }
      </div>
    ) : (
  <div>
      {jobsData.map((item) => (
   <div 
   class ="w-full p-3 m-1 mr-2 bg-white border border-gray-300 rounded-lg transition hover:bg-green-500 hover:text-white relative"
   key={item.field}>

    <div >{item.job_type}</div>
    
    </div>

  ))
  } 
</div>
    )}


</div>

<div  class='p-2  h-[10%] bottom-0 left-0 w-full  flex justify-center items-center ' > 
{/* div containing add field button at button */}
      <button
        onClick={() => {
          setSelectedDisplay("addJob");
        }}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mb-2 w-1/2"
      >
        <span>
          <FontAwesomeIcon icon={faPersonDigging} />
          Add Job
        </span>
      </button>
</div>

 
 
  </div>


      )
      
}
</div>
      ):selectedDisplay === 'JobDetailsDisplay' ? (
        <div class='h-full relative'>
          <span className="p-3 text-black font-semibold text-xl">Job Details</span>
      <div  class='m-2 p-2  mb-3 overflow-y-auto'>
      <div class="mr-2">
      <span class="text-green-800 font-bold">Job Type: </span>
      <span class="text-black font-normal">{filteredJob.job_type}</span>
          </div>
      <div class="mr-2">
      <span class="text-green-800 font-bold">Input: </span>
      <span class="text-black font-normal">{filterNonNullFields(filteredJob.input)}</span>
          </div>
          <div class="mr-2">
      <span class="text-green-800 font-bold">Start Date: </span>
      <span class="text-black font-normal"> {moment(filteredJob.start_month).format('YYYY-MM-DD')}</span>
          </div>
  
          <div class="mr-2">
      <span class="text-green-800 font-bold">End Date: </span>
      <span class="text-black font-normal">{moment(filteredJob.end_month).format('YYYY-MM-DD')}</span>
          </div>
</div>
<div  class='p-2  h-[10%] bottom-0 left-0 w-full  flex justify-center items-center ' > 
{/* div containing mark as done button only if job_complete not true  */}
  {filteredJob.job_complete ? null : (
    <button
      onClick={() => {
        markasDone(filteredJob.id);
        setSelectedDisplay('JobDisplay');
      }}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded mb-2 w-1/2"
    >
      <span>
        <FontAwesomeIcon icon={faCircleCheck} />
        Mark as Done
      </span>
    </button>
  )}
</div>

 
 
  </div>

      ) : (
<div class='relative h-full'>
      {/* // default of mapping */}
<div class='flex justify-between h-full'>
  
{fieldsData.length === 0 ? (
    // Display this when fieldsData is empty
    <div class='flex items-center  mt-16'>
  <div class='p-2 text-center'>
    Select the season and farm from the dropdown to display the fields of that season 😊
  </div>
</div>
  ) : (



<div  class='m-3 p-2 max-h-[90%]  overflow-y-auto mb-3' >
{/* <div className="bg-gradient-to-r from-green-500 to-yellow-400 h-30 w-full flex flex-col justify-center items-center text-white text-opacity-90 rounded-lg p-4">
    <div className="text-4xl">{dataWeather.name}</div>
    <div className="text-5xl"> {dataWeather.main ? <h1>{dataWeather.main.temp.toFixed()}°F</h1> : null}</div>
    <div className="text-1xl">   {dataWeather.wind ? <p className='bold'> Wind Speed:  {dataWeather.wind.speed.toFixed()} MPH</p> : null}
  
</div>
<div className="text-1xl"> {dataWeather.weather ? <p>{dataWeather.weather[0].main}</p> : null}
   
</div>
  </div> */}
  
<div  class='flex flex-wrap' >
  {fieldsData.map((item) => (
  <div 
   class ="w-full p-2 m-1 mr-2 bg-white border border-gray-300 rounded-lg  transition hover:bg-green-500 hover:text-white  relative"
   key={item.field}
   onClick={() => handleMainDivClick(item.id)} > 
    {/* <div class="absolute top-2 right-2 flex flex-col">
  <button
    id={`edit-button-${item.field}`} 
    onClick={() => {
      handleEditClick(item.field);
      // setFieldDetailVisible(!isFieldDetail);
      setSelectedDisplay("FieldUpdate");
    }}
    class="bg-white hover:bg-green-500 hover:text-white text-green-800 text-sm font-bold mb-2"
  >
    <FontAwesomeIcon icon={faPencil} />
  </button>
  <button
    id={`job-button-${item.field}`} 
    onClick={() => {
      handleFieldClick(item.id);
      setSelectedDisplay("JobDisplay");
      
    }}
    class="bg-white hover:bg-green-500 hover:text-white text-green-800 text-sm font-bold mb-2"
  >
    <FontAwesomeIcon icon={faEye} />
  </button>
</div> */}

      <div >Crop Name: {item.field_name}</div>
      <div>Crop Type: {item.crop_type}</div>
     {/* <div>Area: {calculateArea(JSON.parse(item.coordinates))}  Acres </div> */}

    
    </div>

  ))}
</div>

</div>



)}     
  </div> 


        </div>
      )
    }

          

             </div>
          </aside>
          )}
            {/* {!isAsideVisible && (
                <aside class=' h-full w-1/4  '>             
<div className="flex  items-center justify-center space-x-2 px-2 py-2 mr-2 ">
  <img
    src={icon}
    alt="Your Icon Alt Text"
    className="h-20 w-20"
  />
  <span className="font-extrabold text-2xl text-green-700 px-6 py-1">Weather</span>
</div>

<div className="px-2 py-2 bg-gradient-to-r from-green-500 to-yellow-400 h-40 w-full flex flex-col justify-center items-center text-white text-opacity-90 rounded-lg ">
    <div className="text-4xl">{dataWeather.name}</div>
    <div className="text-5xl"> {dataWeather.main ? <h1>{dataWeather.main.temp.toFixed()}°F</h1> : null}</div>
    <div className="text-1xl">   {dataWeather.wind ? <p className='bold'> Wind Speed:  {dataWeather.wind.speed.toFixed()} MPH</p> : null}
  
</div>
<div className="text-1xl"> {dataWeather.weather ? <p>{dataWeather.weather[0].main}</p> : null}
   
</div>
  </div>

              </aside>
                 )}
 */}

                          <div id="map" style={{ height: '700px', width: '100%' }}>
                
              </div>
            
                     </div>
    
    </div> 
  </>
  );
};


export default MyFields;
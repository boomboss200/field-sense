import React, { useState, useEffect , useRef} from 'react';
import {
  faLeaf,
  faLocationPin,
  faDrawPolygon
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken, removeToken } from '../services/LocalStorageService';
import axios from 'axios';
import { toast } from "react-toastify";
import icon from "./icon.png";



const AddFarm = () => {
  const apiKey = 'AIzaSyBtZs5hI8Dzsn__RKWvo0ZDFpiJo53Pldc';
  const [farmName, setFarmName] = useState("");
  const [scButton, setScButton] = useState(false);
  const [lat, setLatitude] = useState("");
  const [long, setLongitude] = useState("");
  const { access_token } = getToken()

  const [checker, setchecker] = useState(false);
 
  const createFarm = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/farms/add/', { name:farmName, longitude: long, latitude: lat }, {
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${access_token}`
         }
      });
      console.log(response.data)
      toast.info("Farms successfully added. ", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
      });
      
    // Reset input fields
    document.getElementById('farmname').value = '';
    document.getElementById('pac-input').value = '';

    } catch (error) {
      console.error(error.response.data)
      console.error('Error creating farm:', error);
    }
  };


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

// function for User location 
      
// // function for User location 
//   function handleUserLocationButtonClick() {
//     navigator.geolocation.getCurrentPosition(
//       function (position) {
//         const userlat = position.coords.latitude;
//         const userlong = position.coords.longitude;
        
//         setLatitude(userlat);
//         setLongitude(userlong);
        
//         const mp = new window.google.maps.Map(document.getElementById('map'), {
//           center: { lat: userlat, lng: userlong },
//           zoom: 13,
//         });
    
//         const marker = new window.google.maps.Marker({
//           position: { lat: userlat, lng: userlong },
//           map: mp
//         });   
        
//         console.log('Center Coordinates:', userlat, userlong);
//       },
//       function errorCallback(error) {
//         console.log(error);
//       }
//     );
  

//   }
      
function getCurrentPositionPromise() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error)
    );
  });
}

// Usage:
function handleUserLocationButtonClick(){
getCurrentPositionPromise()
  .then((position) => {
    // Handle success (position object)
    const userlat = position.coords.latitude;
    const userlong = position.coords.longitude;

    setLatitude(userlat);
    setLongitude(userlong);

    const mp = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: userlat, lng: userlong },
      zoom: 13,
    });

    const marker = new window.google.maps.Marker({
      position: { lat: userlat, lng: userlong },
      map: mp
    });

    console.log('Center Coordinates:', userlat, userlong);
  })
  .catch((error) => {
    // Handle error
    console.error('Geolocation error:', error);
  });
}

  useEffect(() => {
    if (lat && long) {
      const mp = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: parseFloat(lat), lng: parseFloat(long) },
        zoom: 13,
      });
  
      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(long) },
        map: mp
      });
    }
  }, [lat, long]);
  
  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 13,
    });


    //search to center
    const input = document.getElementById('pac-input');
    const searchBox = new window.google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
      const updatedCenter = map.getCenter();
      setLatitude(updatedCenter.lat());
      setLongitude(updatedCenter.lng());
      console.log('Updated Center Coordinates:', updatedCenter.lat(), updatedCenter.lng());
        });

     

    let markers = [];
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      markers.forEach(marker => {
        marker.setMap(null);
      });
      markers = [];

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }

        markers.push(
          new window.google.maps.Marker({
            map,
            title: place.name,
            position: place.geometry.location,
          })
        );

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

   
          


  };

    //loads the user created farms
     useEffect(() => {
        fetchFarms();
    }, []);
     
    //use state to store farms data
    const [farms, setFarms] = useState([]);

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


  return (
     <main className="h-full">
        <div className="flex h-full">
          <div className="w-2/8">
          <aside className="hidden lg:block">
      <div className="md:w-80 min-h-full border-r-2 px-2 py-2 border-gray-100 flex-col flex flex-shrink-0">
        {/* <div className="font-semibold text-3xl items-center text-green-700 px-4 py-6">
          <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> Add Farm
        </div> */}
                                      <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-3">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={icon}
                                  alt="Your Icon Alt Text"
                                  className="h-30 w-20"
                                />
                                <span className="whitespace-nowrap">Add Farms</span>
                              </div>
                            </div>
                       
            <text className="font-extrabold text-2xl items-center text-black px-3 py-3">CREATE YOUR FARM</text>
                 <text className='font-lighter text-sm items-center text-black px-3 py-3'>Once you have set up your farm location you will be able to start mapping your farm and recording work😊</text>
                  {/* Field Name */}
                  <text className='font-lighter text-sm items-right text-black px-2 py-2'> Farm Name</text>
                  <div className="w-full px-2 pb-6 items-center flex relative"> 
                      <div className=" items-center justify-center absolute right-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faDrawPolygon} />
                      </div>
                      <input
                        id="farmname"
                        type="text"
                        name="farmname"
                        label="Farm Name"
                        onChange={(e) => setFarmName(e.target.value)}
                        className="border-b text-sm w-full px-3  focus:outline-none focus:border-green-400"
                        placeholder="Farm Name"
                      />
                    </div>
                  

        {/* Search Location */}
        <text className='font-lighter text-sm items-right text-black  px-2'> Farm Location</text>
        <div className="w-full pb-6 px-2 items-center flex relative">
          <input
            type="text"
            name=""
            placeholder="Search Location"
            id="pac-input"
            className="border-b text-sm w-full px-3  focus:outline-none focus:border-green-400"
          />

          {!scButton && (
            <FontAwesomeIcon
              className="absolute right-6 text-slate-500"
              icon={faLocationPin}
            ></FontAwesomeIcon>
          )}

        </div>
        <text className='font-lighter text-sm items-right text-gray-500  px-2'>Click create farm if you are happy with your location or move it by clicking on the map.</text>

        <div className="relative mt-6 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    OR
                  </span>
                </div>
              </div>
{/* User Location Button */}
<div className="flex w-full justify-center py-4">
<button className="w-1/2 bg-green-600 hover:bg-green-800  text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
onClick={handleUserLocationButtonClick}>
                Use my Location
</button>
                  
</div>
{/* Sumbit Button */}
<div className="flex w-full justify-center py-6">
<button className="w-full bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-xl"
onClick={createFarm}
type='submit'>
                Create Farm 
</button>
                  
</div>
      </div>
    </aside>
  




          </div>

        {/* COMPONENT THATS SEPERATE FROM THE BAR */}
          <div className="w-3/4">
          <div>
      
      <div id="map" style={{ height: '740px', width: '100%' }}></div>
    </div>
          </div>
        </div>
     </main>





  );
};

export default AddFarm;

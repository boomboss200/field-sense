import { faBars, faBell, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../services/LocalStorageService";
import { useEffect } from "react";

function Index({ toggle }) {
  const avatar =
    "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

    const [isOpen, setOpen] = useState(false);
  
    const handleDropDown = () => {
      setOpen(!isOpen);
    };

    const { access_token } = getToken()

    
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


     const [selectedItemId, setSelectedItemId] = useState(null);
     const [filteredData, setFilteredData] = useState([]);
   
     // Function to handle item selection
     const handleSelectChange = (e) => {
       const selectedId = parseInt(e.target.value); // Parse selected ID to an integer
       setSelectedItemId(selectedId);
   
       // Filter the data based on the selected ID
       const filteredItems = farms.filter((item) => item.id === selectedId);
       setFilteredData(filteredItems);
     };
     
  return (
    <>
      <header className="">
        <div className="shadow-sm">
          <div className="relative bg-white flex w-full items-center px-5 py-2.5">
            <div className="flex-1">
              <p className="block md:hidden cursor-pointer">
                <FontAwesomeIcon icon={faBars} onClick={toggle} />
              </p>
            </div>
            <div className="">
              <ul className="flex flex-row gap-4 items-center">
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
                  <span>
                    {/* dropdown code */}
                    <div>
                      <label htmlFor="dropdown">Selected Farm:</label>
                      <select id="dropdown" value={selectedItemId} onChange={handleSelectChange} >
                        {farms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.name}
                          </option>
                        ))}
                      </select>
                     
      {/* <ul>
        {filteredData.map((item) => (
          <li key={item.id}>
            {item.longitude} (latitude: {item.latitude})
          </li>
        ))}
      </ul> */}

                    </div>      
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Index;
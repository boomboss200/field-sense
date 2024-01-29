import React, { useState, useEffect } from 'react';
import { faBars,faRemove, faBell, faMessage,faAnglesRight, faAnglesLeft,faPenSquare,faEye,faCircleChevronRight,faSquarePlus,faPersonDigging, faTrash, faArrowLeft, faPencil, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { getToken } from '../services/LocalStorageService';
import { toast } from "react-toastify";
import { data } from 'autoprefixer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import Navbar from "./Navbar/Index";
import { useOutletContext } from "react-router-dom";
import { faLink,faSquareXmark ,faAnchorCircleXmark} from "@fortawesome/free-solid-svg-icons";
import 'react-datepicker/dist/react-datepicker.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {faLeaf} from "@fortawesome/free-solid-svg-icons";
import icon from "./icon.png";
function DeleteFarms() {
    const { access_token } = getToken()
    const [selectedItemId, setSelectedItemId] = useState(null); 
    const [isManagePopupOpen,    setIsManagePopupOpen] = useState(false); //for popup of removing fields
    const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false); //for popup of create season

    const [farms, setFarms] = useState([]);                //fetch farms and set them
    const [selectedFarm, setSelectedFarm] = useState('');
    const [fields, setFields] = useState([]);               //fetch fields and set them
    const [farmId, setfarmId] = useState(null);
    const [fieldname, setFieldname] = useState('');

  
  //loads the user created farms
  useEffect(() => {
    fetchFarms();
    }, []);
 

//get user created farms 
   const fetchFarms = async () => {
     try {
       const response = await axios.get('http://127.0.0.1:8000/farms/all-farms/', {
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

   

  const handleManageSeason = () => {
    setIsManagePopupOpen(true);
  } 
  
  useEffect(() => {
   fetchFarms();
  }, []);

  const removeFarm = async (fieldid,fieldname) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete Farm ${fieldname}?`);
    if (isConfirmed) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/farms/farm/${fieldid}/delete/`
    , {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            }
          });
          toast.info("Farm Successfully removed . ", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          console.log("Farms successfuly removed")
          fetchFarms();
          } catch (error) {
          console.error(error.response.data)
          console.error('Error un-attaching Farm ', error);
        }
      }
    };

  return (
   <>
   
   <br></br>
   <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
                <text className="font-extrabold text-2xl items-center text-black px-6 py-6">Delete Farms</text>
                <br></br>
                <text className='font-lighter text-sm items-center text-black px-6 py-4'>Remove the Farm</text>
                
                <div className="mt-6 flex flex-row gap-4 px-4 ">
                
                <button onClick={handleManageSeason} className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-m flex gap-2 items-center">
                    <div>
                        <FontAwesomeIcon icon={faRemove} />
                    </div>
                    <span style={{color:'white'}}> Delete Now </span>
                    </button>


                    <Popup open={isManagePopupOpen} modal nested>
                {
                    close => (
                        <div className='modal'>
                        <div className="px-6 relative">
                          <FontAwesomeIcon
                          icon={faSquareXmark}
                          className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-red-500 transform scale-125"
                          onClick={() => {
                            close();
                            setIsManagePopupOpen(!isManagePopupOpen);
                          //  handlePickerSelection(); // Toggle the state
                          }}
                          />
                        </div>
                            {/* <div className="font-semibold text-3xl items-center text-green-700 px-4 py-6">
                                <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> Manage Your Farms
                            </div> */}
                          <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-4">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={icon}
                                  alt="Your Icon Alt Text"
                                  className="h-30 w-20"
                                />
                                <span className="whitespace-nowrap">Delete Your Farms</span>
                              </div>
                            </div>

                                <text className='font-lighter text-sm items-center text-black px-6 py-4'> Select the farm from the list</text>
                           
                      
{/* for farms  */}
                    {/* <div className="mt-3 flex flex-row gap-4 px-6"> 
                    <label htmlFor="dropdown">Selected Farm:</label>
                      <select id="dropdown" value={selectedItemId} onChange={handleFarm}>
                      <option value="">Select Farm</option>
                        {farms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.name}
                          </option>
                        ))}
                      </select> 
                    </div> */}
                   <br></br>


                   {/* make fields scrollable list */}
                   <div className="mt-3 flex flex-row gap-4 px-6">
    
    {farms.length === 0 ? (
    
    
    // <p>No fields to display.</p>
    <div className="mt-3 flex justify-center">
    <h2>Farms List: </h2>
      <text>No Farms to display</text>
       {/* <button onClick={() => {
                            close();
                          //  handlePickerSelection();
                            setIsManagePopupOpen(!isManagePopupOpen);
                            setIsLinkPopupOpen(!isLinkPopupOpen);

                             // Toggle the state
                          }} className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-m flex gap-2 items-center mt-4 mb-4 ml-10">
                    <div>
                        <FontAwesomeIcon icon={faLink} />
                    </div>
                    <span style={{color:'white'}}> Link Now </span>
                    </button> */}
      </div>
    //add a link now button 
    ) : (
        <div className="max-h-72 overflow-y-auto mb-5">
              <h2>Farms List: </h2>
            <ul>
            {farms.map((field) => (
  <li key={field.farm_id}>
    <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
      <div className="grid grid-cols-3 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="...">
            <h1 className="font-semibold">Name: </h1> {field.farm_name}
          </div>
          <div className="...">
            <h2 className="inline-block whitespace-nowrap font-semibold">Fields Present: </h2> {field.fields_count}
          </div>
        </div>
        <div className="..."></div> {/* Empty space to push the button to the right */}
        <div className="text-right"> {/* Aligns button to the right */}
          <button
            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center"
            onClick={() => removeFarm(field.farm_id,field.farm_name)}
          >
            <div>
              <FontAwesomeIcon icon={faTrash} />
            </div> Delete Farm 
          </button>
        </div>
      </div>
    </div>
    <br />
  </li>
))}

            </ul>
        </div>
    )}
</div>
                     
                            {/* <div className="px-6">
                                <button className="bg-gray-600 border-white-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center" onClick=
                                    {() => close()}>
                                        Cancel
                                </button>
                            </div> */}
                        </div>
                    )
                }
            </Popup>
             </div>   

            
          </div>
          <br></br>
   </>
  )
}

export default DeleteFarms
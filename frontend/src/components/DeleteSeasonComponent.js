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

function DeleteSeasons() {
    const { access_token } = getToken()
    const [selectedItemId, setSelectedItemId] = useState(null); 
    const [isManagePopupOpen,    setIsManagePopupOpen] = useState(false); //for popup of removing fields
    const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false); //for popup of create season

    const [seasons, setSeasons] = useState([]);                //fetch farms and set them
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
       const response = await axios.get('http://127.0.0.1:8000/season/my-seasons/', {
         headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${access_token}`
         }
       });
       console.log(response.data)
       setSeasons(response.data);
     } catch (error) {
       console.error('Error fetching farms:', error);
     }
   };

   

  const handleManageSeason = () => {
    setIsManagePopupOpen(true);
  } 
  


  const removeSeason = async (seasonid,seaonname) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete Season " ${seaonname} "?`);
    if (isConfirmed) {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/season/seasons/delete/${seasonid}/`, { 
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            }
          });
          toast.info("Season Successfully removed. ", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          console.log("Season successfuly deleted")
          fetchFarms();
          } catch (error) {
          console.error(error.response.data)
          console.error('Error removing  season:', error);
        }
      }
    };
    
    const deleteSeason = async (seasonId) => {
      try {
        const response = await axios.post(`http://localhost:8000/season/delete_season/${seasonId}/`);
        console.log(response.data.message);
        // Handle success, redirect to another page, update UI, etc.
      } catch (error) {
        console.error('Error deleting season:', error);
        // Handle error, show an alert, etc.
      }
    };
  
  const handleDelete = async (seasonId) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete Season ${seasonId}?`);

    if (isConfirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/season/delete_season/${seasonId}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`, // Include CSRF token for Django
          },
          credentials: 'include',  // Include credentials for authentication
        });

        if (response.ok) {
          console.log("Season Successfully Deleted")
          fetchFarms()
        } else {
          console.error('Failed to delete season');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };


  
  return (
   <>
   
   <br></br>
   <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
                <text className="font-extrabold text-2xl items-center text-black px-6 py-6">Delete Seasons</text>
                <br></br>
                <text className='font-lighter text-sm items-center text-black px-6 py-4'>Remove the Season</text>
                
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
                                <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> Manage Your Seasons
                            </div> */}
      <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-4">
                 <div className="flex items-center space-x-2">
                  <img
                    src={icon}
                    alt="Your Icon Alt Text"
                    className="h-30 w-20"
                  />
                  <span className="whitespace-nowrap">Delete Your Seasons</span>
                </div>
              </div>


                                <text className='font-lighter text-sm items-center text-black px-6 py-4'> Select the season from the list</text>
                           
                      
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
    
    {seasons.length === 0 ? (
    
    
    // <p>No fields to display.</p>
    <div className="mt-3 flex justify-center">
    <h2>Seaons List: </h2>
      <text>No Season to display</text>
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
                    <span style={{color:'white'}}> Delete Now </span>
                    </button> */}
      </div>
    //add a link now button 
    ) : (
        <div className="max-h-72 overflow-y-auto mb-5">
              <h2>Seasons List: </h2>
            <ul>
            {seasons.map((field) => (
  <li key={field.id}>
    <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
      <div className="grid grid-cols-3 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="...">
            <h1 className="font-semibold">Name: </h1> {field.name}
          </div>
          <div className="...">
            <h2 className="inline-block whitespace-nowrap font-semibold">Season Duration: </h2> <p className='whitespace-nowrap'>{moment(moment(field.start_month).utc().format('YYYY-MM-DD')).format('MMMM')} {moment(moment(field.start_month).utc().format('YYYY-MM-DD')).format('YYYY')} ---  {moment(moment(field.end_month).utc().format('YYYY-MM-DD')).format('MMMM')} {moment(moment(field.start_month).utc().format('YYYY-MM-DD')).format('YYYY')}</p> 
          </div>
        </div>
        <div className="..."></div> {/* Empty space to push the button to the right */}
        <div className="text-right"> {/* Aligns button to the right */}
          <button
            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center"
            onClick={() => removeSeason(field.id,field.name)}
          >
            <div>
              <FontAwesomeIcon icon={faTrash} />
            </div> Delete Season 
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

export default DeleteSeasons
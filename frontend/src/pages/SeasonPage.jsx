import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faFloppyDisk, faFolderPlus, faLink, faPhone,faSquareXmark, faSquarePlus ,faAnchorCircleXmark} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { getToken, removeToken } from '../services/LocalStorageService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { toast } from "react-toastify";
import {faLeaf} from "@fortawesome/free-solid-svg-icons";
import icon from "./icon.png";
function SeasonPage() {

  const [seasonName , setSeasonName] = useState('')
  const [seasons, setSeasons] = useState([]);
  const [fieldsData, setfieldsData] = useState([]);
  const { access_token } = getToken()
  const [farms, setFarms] = useState([]);         
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
      setStartDate(date);
  };

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
     //  initMap(farmlat,farmlon);
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  const handleEndDateChange = (date) => {
      setEndDate(date);
  };
  const handleseasonNameChange = event => {
    setSeasonName(event.target.value);
  };
 
  useEffect(() => {
    fetchSeason();
   }, []);

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

  
  const createSeason = async () => {
    if (startDate && endDate) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/season/add_season/', { name:seasonName, start_month:startDate, end_month:endDate }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data);
      toast.info("Season Successfully created. ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      setSeasonName(null);
      setStartDate(null)
      setEndDate(null)
      fetchSeason();
    } catch (error) {
      console.error(error.response.data)
      toast.info("Error Creating a season. ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      console.error('Error creating season:', error);
        }
    }
};
const [selectedItemId, setSelectedItemId] = useState(null);
const [farmId, setFarmId] = useState(null);
const [seasonId, setSeasonId] = useState(null);
const [filteredItems, setFilteredItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedFarm, setSelectedFarm] = useState('');
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false); //for popup of create season
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false); //for popup of create season
  const [isManagePopupOpen,    setIsManagePopupOpen] = useState(false); //for popup of removing fields

  const [submitmessage, setsubmitmessage] = useState('');

  const handleFarmSelect = (e) => {
    const selectedFarmId = e.target.value;
    setSelectedFarm(e.target.value);
    setFarmId(selectedFarmId);
    console.log(farmId,seasonId);
  };

  useEffect(() => {
    if (farmId !== null && seasonId !== null) {
      fetchFieldsData(); // Call fetchFieldsData when both conditions are met
    }
  }, [farmId, seasonId]);

  
  useEffect(() => {
    if (seasonId !== null) {
      fetchunlinkedFields(); // Call fetchFieldsData when both conditions are met
    }
  }, [ seasonId]);

  
  const handleMonthSelect = (e) => {
      setSelectedMonth(e.target.value);
      setSeasonId(e.target.value);
    const selectedId = parseInt(e.target.value); // Parse selected ID to an integer
     console.log(setSelectedItemId(selectedId));
 
     // Filter the data based on the selected ID
     const filteredItems = seasons.filter((item) => item.id === selectedId);
     setFilteredItems(filteredItems);
  };
//for season id
  const handleSeasonSelect = (e) => {
    const selectedId = parseInt(e.target.value); // Parse selected ID to an integer
    setSelectedSeason(e.target.value); // Update selectedMonth state
    // setSelectedItemId(selectedId); // Update the selected item state (assuming setSelectedItemId is the correct function)
  
    // Pass the selected ID to setSeasonid
    setSeasonId(selectedId);
  
    // // Filter the data based on the selected ID
    // const filteredItems = seasons.filter((item) => item.id === selectedId);
    // setFilteredItems(filteredItems);
};


  const handleCreateSeason = () => {
      setIsCreatePopupOpen(true);
    } 
  
  const handleLinkSeason = () => {
      setIsLinkPopupOpen(true);
    } 

    const handleManageSeason = () => {
      setIsManagePopupOpen(true);
    } 



  const [seasonid, setseasonid] = useState('');

  const fetchFieldsData = async () => {
    try {
      if (farmId !== null && seasonId !== null) {
          const response = await axios.get(`http://127.0.0.1:8000/data/field-data/${farmId}/${seasonId}/`, {
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data)
      setfieldsData(response.data);
  }
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };
  


  useEffect(() => {
    if (filteredItems.length === 1) {
      const item = filteredItems[0];
      const extractedid = item.id;
      setseasonid(JSON.parse(extractedid));
      console.log(seasonid)
      // var coordinates= extractCoordinates(fields);
      // console.log(coordinates);
      // initMap(extractedlat, extractedlon,coordinates);
    
    }
  }, [filteredItems]);

  const [unlinkedfields, setunlinkedFields] = useState([]);

  // useEffect(() => {
  //   fetchFields();
  // }, [])
  
  
  const fetchunlinkedFields = async () => {
    try {
      if (seasonId !== null ) {
          const response = await axios.get(`http://127.0.0.1:8000/data/field-data_unmatched_field_ids/${seasonId}/`, {
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data)
      setunlinkedFields(response.data);
  }
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };
 

  const [selectedItems, setSelectedItems] = useState([]);


  const toggleCheckbox = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));

    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const submitField = async (fieldid,fieldcoorindate) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/data/field-data/', { season: seasonid, field: fieldid , job:"Test" ,fieldscoordinates:fieldcoorindate}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      });
      console.log(response.data)
      toast.info("Field Successfully added to Season. ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });

      fetchunlinkedFields();
      } catch (error) {
      console.error(error.response.data)
      toast.info("Unable to attach field to Season. ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      console.error('Error attaching fields to season:', error);
    }
  };

  const handlePickerSelection = () => {
      setSelectedSeason(null);
      setFarmId(null) ;
      setSelectedMonth(null);
      setfieldsData([]);
      setunlinkedFields([]);
      // Clear the selection by setting it to an empty string on closing form and clearing the fieldsdata

    }
 
  
  
  const removeField = async (fieldid) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/data/field-data-delete/${fieldid}/`
, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      });
      toast.info("Field Successfully removed from Season. ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      console.log("Field successfuly unlinked")
      fetchFieldsData();
      } catch (error) {
      console.error(error.response.data)
      console.error('Error un-attaching fields to season:', error);
    }
  };

 
  return(
    <>  
       <main className="h-full">
        {/* Main Content */}
        <div className="mainCard">
          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
                
                {/* create new season section */}
                {/* <div className="font-semibold text-3xl items-center text-green-700 px-4 py-6">
                <div className="flex items-center bg-red-600">
                  <img
                    src={icon}
                    alt="Your Icon Alt Text"
                    className="mr-2 h-16 w-16"
                  />
                </div>
                <div className="bg-pink-600">
                  Set Seasons
                </div>


                    <img  alt=""  className="mr-2 h-20 w-20"/> Set Seasons 
           

                </div> */}
                <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-4">
                 <div className="flex items-center space-x-2">
                  <img
                    src={icon}
                    alt="Your Icon Alt Text"
                    className="h-30 w-20"
                  />
                  <span className="whitespace-nowrap">Set Seasons</span>
                </div>
              </div>
                <text className="font-extrabold text-2xl items-center text-black px-6 py-6">Create Your Season</text>
                <br></br>
                <text className='font-lighter text-sm items-center text-black px-6 py-4'>Once you have set up your season you will be able to start attaching your fields and recording work history😊</text>
                
                <div className="mt-6 flex flex-row gap-4 px-4 ">
                
             <button onClick={handleCreateSeason} className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-m flex gap-2 items-center">
                    <div>
                        <FontAwesomeIcon icon={faFolderPlus} />
                    </div>
                    <span style={{color:'white'}}> Create New Season</span>
                    </button>

              <Popup open={isCreatePopupOpen} modal nested>
                {
                    close => (
                        <div className='modal'>
                                    <div className="px-6 relative">
          <FontAwesomeIcon
          icon={faSquareXmark}
          className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-red-500 transform scale-125"
          onClick={() => {
            close();
            setIsCreatePopupOpen(!isCreatePopupOpen);
            handlePickerSelection(); // Toggle the state
          }}
          />
          </div>
                            {/* <div className="font-semibold text-3xl items-center text-green-700 px-4 py-6">
                                <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> New Season 
                            </div> */}
                             <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-4">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={icon}
                                  alt="Your Icon Alt Text"
                                  className="h-30 w-20"
                                />
                                <span className="whitespace-nowrap">Set Seasons</span>
                              </div>
                            </div>
                                <text className='font-lighter text-sm items-center text-black px-6 py-4'> Provide Season Name and Durationa to create a new season</text>
                            <br></br>
                       
                      <br></br>
                      
                      {/* season create form  */}
                      
                      <form> 
                        <div className="mt-4 px-6">
                            <label htmlFor="largeInput" className="text-sm text-gray-600">
                                Season Name:
                            </label>
                            <br></br>
                            <input
                                id="largeInput"
                                type="text"
                                value={seasonName}
                                onChange={handleseasonNameChange}
                                name="largeInput"
                                // onChange={(e) => setEmail(e.target.value)}
                                autocomplete="off"
                                className="text-l placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-2/3 md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                placeholder="Enter Season Name"
                            />
                        </div>
                        <div className="mt-6 px-6">
                            <label htmlFor="largeInput" className="text-sm text-gray-600">
                                Season Duration
                            </label>
                        <div style={{display: 'flex' , justifyContent:'space-between'}}>
                        <div style={{ flex: 1 }}>
                            <label>Start Date: </label>
                            <DatePicker
                                id="largeInput"
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                selected={startDate}
                                onChange={handleStartDateChange}
                                //dateFormat="dd/MM/yyyy"
                                autocomplete="off"
                                placeholderText="Select a start date"
                                showTimeSelect={false} // Set this to false to show only the date
                                className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1 "
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>End Date: </label>
                            <DatePicker
                                id="largeInput"
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                selected={endDate}
                                onChange={handleEndDateChange}
                                autocomplete="off"
                                //dateFormat="dd/MM/yyyy"
                                placeholderText="Select an end date"
                                className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"

                            />
                        </div>
                        </div>
                </div>
                
                <div className="mt-6 flex flex-row gap-4 px-6">
                        <button 
                        // onClick={  createSeason} 
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the default behavior (navigation)
                          createSeason();
                          close();
                          setIsCreatePopupOpen(!isCreatePopupOpen);
                          handlePickerSelection();
                        }}
                          className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
                        <div>
                            <FontAwesomeIcon icon={faSquarePlus} />
                        </div>
                        <span>Create New Season</span>
                        </button>
                </div>
            <br></br>
                
              {/* <div className="mt-6 flex flex-row gap-4">
                <button onClick={createSeason} className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
                  <div>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                  </div>
                  <span>Create New Season</span>
                </button>
              </div> */}
            </form>   
{/* 
                            <div className="px-6">
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

            {/* attach season with fields section */}
            <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
                <text className="font-extrabold text-2xl items-center text-black px-6 py-6">Set Field's Season</text>
                <br></br>
                <text className='font-lighter text-sm items-center text-black px-6 py-4'>Start Storing the Field's Data by Connecting it with the your created seasons😊</text>
                
                <div className="mt-6 flex flex-row gap-4 px-4 ">
                
                <button onClick={handleLinkSeason} className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-m flex gap-2 items-center">
                    <div>
                        <FontAwesomeIcon icon={faLink} />
                    </div>
                    <span style={{color:'white'}}> Link Now </span>
                    </button>


                    <Popup open={isLinkPopupOpen} modal nested>
                {
                    close => (
                        <div className='modal'>
                        <div className="px-6 relative">
                          <FontAwesomeIcon
                          icon={faSquareXmark}
                          className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-red-500 transform scale-125"
                          onClick={() => {
                            close();
                            setIsLinkPopupOpen(!isLinkPopupOpen);
                            handlePickerSelection() ;// Toggle the state
                          }}
                          />
                        </div>
                            {/* <div className="font-semibold text-3xl items-center text-green-700 px-4 py-6">
                                <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> Link Fields
                            </div> */}
                              <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-4">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={icon}
                                  alt="Your Icon Alt Text"
                                  className="h-30 w-20"
                                />
                                <span className="whitespace-nowrap">Set Seasons</span>
                              </div>
                            </div>
                                <text className='font-lighter text-sm items-center text-black px-6 py-4'> Select the season from the dropdown and attach the fields by pressing on Add Button</text>
                            <br></br>
                       
                      <br></br>
                      <div className="mt-3 flex flex-row gap-4 px-6">
                     
                     <label htmlFor="dropdown">Selected Season:</label>
                         <select value={selectedMonth} onChange={handleMonthSelect}>
                        <option value="">Select a year</option>
                        {seasons.map((year) => (
                        <option key={year.id}value={year.id}>
                    
                            {moment(moment(year.start_month).utc().format('YYYY-MM-DD')).format('MMMM')} {moment(moment(year.start_month).utc().format('YYYY-MM-DD')).format('YYYY')} ---  {moment(moment(year.end_month).utc().format('YYYY-MM-DD')).format('MMMM')} {moment(moment(year.start_month).utc().format('YYYY-MM-DD')).format('YYYY')}
                            {/* {moment(year.start_month).utc().format('YYYY-MM-DD')} --- {moment(year.end_month).utc().format('YYYY-MM-DD')} */}
                        </option>
                        ))}
                    </select>
                    

                   </div> 
                   <br></br>
                   {/* make fields scrollable list */}
                         <div className="mt-3 flex flex-row gap-4 px-6">
                       
                           
    {seasonId === null ? (
      <div className="flex justify-center">
          </div>
    ) :
    
    unlinkedfields.length === 0 ? (
    
    <div className="flex justify-center">
         <h2>Field List: </h2>
      <text>All fields are linked to season.</text>
  <br></br>
      <button onClick={() => {
                            close();
                            handlePickerSelection();
                            setIsManagePopupOpen(!isManagePopupOpen);
                            setIsLinkPopupOpen(!isLinkPopupOpen);

                             // Toggle the state
                          }} className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-m flex gap-2 items-center mt-6 mb-4">
                    <div>
                        <FontAwesomeIcon icon={faLink} />
                    </div>
                    <span style={{color:'white'}}> Manage Now </span>
                    </button>
      </div>
    //add a link now button 
    ) : (
                
                  <div className="max-h-72 overflow-y-auto mb-5">
                         <h2>Field List: </h2>
                            <ul>
                                {unlinkedfields.map((field) => (
                                <li key={field.id}>
                                    <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
                                      <div className="grid grid-cols-4 gap-4">
                                          
                                        
                                            <div className="...">
                                              <h1 className="font-semibold">Name: </h1> {field.field_name}
                                            </div>
                                          <div className="...">
                                            <h1 className="font-semibold">Crop: </h1> {field.crop_type}
                                          </div>
                                           <div className="...">
                                            {/* replace the farm id with the farm name */}
                                          <h1 className="font-semibold">Farm: </h1> {field.farm_id}
                                          </div>
                                          <div className="...">
                                              <button className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center" onClick={() => submitField(field.id,field.coordinates)}>
                                                <div>
                                            <FontAwesomeIcon icon={faAnchor} />
                                          </div> Add to Season 
                                        </button>
                                          </div>
                                      </div>
                                    </div>
                                    <br></br>
                                 
                    
                                </li>
                                ))}
                            </ul>
                            </div>)}
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


          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
                <text className="font-extrabold text-2xl items-center text-black px-6 py-6">Manage Season's Fields</text>
                <br></br>
                <text className='font-lighter text-sm items-center text-black px-6 py-4'>Remove the fields from seasons😊</text>
                
                <div className="mt-6 flex flex-row gap-4 px-4 ">
                
                <button onClick={handleManageSeason} className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-m flex gap-2 items-center">
                    <div>
                        <FontAwesomeIcon icon={faLink} />
                    </div>
                    <span style={{color:'white'}}> Manage Now </span>
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
                            handlePickerSelection(); // Toggle the state
                          }}
                          />
                        </div>
                            {/* <div className="font-semibold text-3xl items-center text-green-700 px-4 py-6">
                                <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon> Manage Season Fields
                            </div> */}
                              <div className="font-semibold text-3xl flex items-center text-green-700 px-2 py-4">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={icon}
                                  alt="Your Icon Alt Text"
                                  className="h-30 w-20"
                                />
                                <span className="whitespace-nowrap">Set Seasons</span>
                              </div>
                            </div>
                                <text className='font-lighter text-sm items-center text-black px-6 py-4'> Select the season from the dropdown</text>
                            <br></br>
                       
                      <br></br>
                      <div className="mt-3 flex flex-row gap-4 px-6">
                     
                     <label htmlFor="dropdown">Selected Season:</label>
                         <select value={selectedSeason} onChange={handleSeasonSelect}>
                        <option value="">Select a Season</option>
                        {seasons.map((year) => (
                        <option key={year.id}value={year.id}>
                    
                            {moment(moment(year.start_month).utc().format('YYYY-MM-DD')).format('MMMM')} {moment(moment(year.start_month).utc().format('YYYY-MM-DD')).format('YYYY')} ---  {moment(moment(year.end_month).utc().format('YYYY-MM-DD')).format('MMMM')} {moment(moment(year.start_month).utc().format('YYYY-MM-DD')).format('YYYY')}
                            {/* {moment(year.start_month).utc().format('YYYY-MM-DD')} --- {moment(year.end_month).utc().format('YYYY-MM-DD')} */}
                        </option>
                        ))}
                    </select>

                   </div> 
                   <br></br>
{/* for farms  */}
                    <div className="mt-3 flex flex-row gap-4 px-6"> 
                    <label htmlFor="dropdown">Selected Farm:</label>
                    <select value={selectedFarm} onChange={handleFarmSelect}>
                    <option value="">Select a farm</option>
                    {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                     {farm.name}
                    </option>
                     ))}
                      </select>
                    </div>
                   <br></br>


                   {/* make fields scrollable list */}
                   <div className="mt-3 flex flex-row gap-4 px-6">
    
    {fieldsData.length === 0 ? (
    
    
    // <p>No fields to display.</p>
    <div className="mt-3 flex justify-center">
    <h2>Field List: </h2>
      <text>No fields to display</text>
       <button onClick={() => {
                            close();
                            handlePickerSelection();
                            setIsManagePopupOpen(!isManagePopupOpen);
                            setIsLinkPopupOpen(!isLinkPopupOpen);

                             // Toggle the state
                          }} className="bg-emerald-600 hover:bg-emerald-900 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-m flex gap-2 items-center mt-4 mb-4 ml-10">
                    <div>
                        <FontAwesomeIcon icon={faLink} />
                    </div>
                    <span style={{color:'white'}}> Link Now </span>
                    </button>
      </div>
    //add a link now button 
    ) : (
        <div className="max-h-72 overflow-y-auto mb-5">
              <h2>Field List: </h2>
            <ul>
            {fieldsData.map((field) => (
  <li key={field.id}>
    <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
      <div className="grid grid-cols-3 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="...">
            <h1 className="font-semibold">Name: </h1> {field.field_name}
          </div>
          <div className="...">
            <h1 className="font-semibold">Crop: </h1> {field.crop_type}
          </div>
        </div>
        <div className="..."></div> {/* Empty space to push the button to the right */}
        <div className="text-right"> {/* Aligns button to the right */}
          <button
            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center"
            onClick={() => removeField(field.id)}
          >
            <div>
              <FontAwesomeIcon icon={faAnchorCircleXmark} />
            </div> Remove from Season
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


          

           {/* <div className="list-view">
            <h2>List View</h2>
            <ul className="list">
              {fields.map((item) => (
                <li key={item.id} className="list-item">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleCheckbox(item.id)}
                  />
                  <div>
                  
                  <p>{item.id}</p>

                    <h3>{item.field_name}</h3>
                    <p>{item.crop_type}</p>
                  
                  </div>
                </li>
              ))}
            </ul>
          </div> */}

          <div>
      
        </div>
        </div>
      </main>

    </>
  );
}

export default SeasonPage;
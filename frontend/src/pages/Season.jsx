import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faFloppyDisk, faPhone } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { getToken, removeToken } from '../services/LocalStorageService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
function Season() {

  const [seasonName , setSeasonName] = useState('')
  const [seasons, setSeasons] = useState([]);
  const { access_token } = getToken()
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
      setStartDate(date);
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
      console.log(response.data)
      setSeasonName('');
      setStartDate(null)
      setEndDate(null)
      //fetchSeason();
    } catch (error) {
      console.error(error.response.data)
      console.error('Error creating season:', error);
        }
    }
};
const [selectedItemId, setSelectedItemId] = useState(null);
const [filteredItems, setFilteredItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleMonthSelect = (e) => {
      setSelectedMonth(e.target.value);
    const selectedId = parseInt(e.target.value); // Parse selected ID to an integer
     console.log(setSelectedItemId(selectedId));
 
     // Filter the data based on the selected ID
     const filteredItems = seasons.filter((item) => item.id === selectedId);
     setFilteredItems(filteredItems);
  };
  const [seasonid, setseasonid] = useState('');

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

  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetchFields();
  }, [])
  
  const fetchFields = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/fields/my-fields/`, {
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log(response.data)
      setFields(response.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
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

  const submitField = async (fieldid) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/data/field-data/', { season: seasonid, field: fieldid , job:"Test"}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      });
      console.log(response.data)
      setseasonid('');
      fetchSeason();
      } catch (error) {
      console.error(error.response.data)
      console.error('Error attaching fields to season:', error);
    }
  };

  return(
    <>  
       <main className="h-full">
        {/* Main Content */}
        <div className="mainCard">
          <h1>added Seasons ::: </h1>
            <ul>
              {seasons.map(season => (
                <li key={season.id}>{season.id}-{season.name}-{moment(season.start_month).utc().format('YYYY-MM-DD')}-{moment(season.end_month).utc().format('YYYY-MM-DD')}</li>
              ))}
            </ul>


          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
            <form>
              
              {/* Form Large */}
              <div className="mt-6">
                <label htmlFor="largeInput" className="text-sm text-gray-600">
                  Season Name
                </label>
                <input
                  id="largeInput"
                  type="text"
                  value={seasonName}
                  onChange={handleseasonNameChange}
                  name="largeInput"
                  // onChange={(e) => setEmail(e.target.value)}
                  className="text-xl placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Season Name"
                />
              </div>
              <div className="mt-6">
                <label htmlFor="largeInput" className="text-sm text-gray-600">
                  Season Duration
                </label>
        <div style={{display: 'flex' , justifyContent:'space-between'}}>
            <div style={{ flex: 1 }}>
                <label>Start Date:</label>
                <DatePicker
                    id="largeInput"
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    //dateFormat="dd/MM/yyyy"
                    placeholderText="Select a start date"
                    showTimeSelect={false} // Set this to false to show only the date
                    className="text-l placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1 "
                />
            </div>
            <div style={{ flex: 1 }}>
                <label>End Date:</label>
                <DatePicker
                    id="largeInput"
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    //dateFormat="dd/MM/yyyy"
                    placeholderText="Select an end date"
                    className="text-l placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"

                />
            </div>
            </div>

        </div>
        <div className="mt-6 flex flex-row gap-4">
                <button onClick={createSeason} className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
                  <div>
                    <FontAwesomeIcon icon={faFloppyDisk} />
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
          </div>
          <br></br>
          <div>
                      <label htmlFor="dropdown">Selected Season:</label>
                      <select value={selectedMonth} onChange={handleMonthSelect}>
                        <option value="">Select a year</option>
                        {seasons.map((year) => (
                          <option key={year.id} value={year.id}>
                            {moment(year.start_month).utc().format('YYYY-MM-DD')} ----- {moment(year.end_month).utc().format('YYYY-MM-DD')}
                          </option>
                        ))}
                      </select>
                      <h1>selected seasion id - {seasonid}</h1>
           </div> 
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
      <h2>Field List</h2>
      <ul>
        {fields.map((field) => (
          <li key={field.id}>
            <strong>{field.field_name}:</strong> {field.crop_type}
            <button className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center" onClick={() => submitField(field.id)}> Add Field to Season </button>
          </li>
        ))}
      </ul>
     </div>

          <div className="mt-6 flex flex-row gap-4">
                <button  className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
                  <div>
                    <FontAwesomeIcon icon={faAnchor} />
                  </div>
                  <span> Attach Season to Fields </span>
                </button>
          </div>
          
          <div>
            <h4>Popup - GeeksforGeeks</h4>
            <Popup trigger=
                {<button  className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center"> Click to open modal </button>} 
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                Welcome to GFG!!!
                            </div>
                            <br></br>
                            <div>
                      <label htmlFor="dropdown">Selected Season:</label>
                      <select value={selectedMonth} onChange={handleMonthSelect}>
                        <option value="">Select a year</option>
                        {seasons.map((year) => (
                          <option key={year} value={year}>
                            {moment(year.start_month).utc().format('YYYY-MM-DD')} ----- {moment(year.end_month).utc().format('YYYY-MM-DD')}
                          </option>
                        ))}
                      </select>
                      </div> 
                      <br></br>
                            

                            <div>
                                <button className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center" onClick=
                                    {() => close()}>
                                        Close modal
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>

          <div>
      
        </div>
        </div>
      </main>

    </>
  );
}

export default Season;
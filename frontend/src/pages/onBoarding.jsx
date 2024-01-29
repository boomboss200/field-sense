// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import DashboardHeader from '../components/Other/DashboardHeader.jsx';
import SlideShow from './slideshow.jsx'; // Import Onboarding component
import { useOutletContext } from 'react-router-dom';
import './dashboard.css'; // Import your custom CSS
import logo from './images/logo.png'
import {
  faBars,
  faBell,
  faCog,
  faLightbulb,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/LocalStorageService';


const Dashboard = () => {
  const [farmsData, setFarmsData] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false); // State to control onboarding visibility
  const avatar = logo
  const [sidebarToggle] = useOutletContext();
  const { access_token } = getToken()

  // useEffect(() => {
  //   // Fetch farms with fields data
  //   axios
  //     .get('http://localhost:8000/farms/farms-with-fields/')
  //     .then((response) => setFarmsData(response.data.farms_data))
  //     .catch((error) => console.error('Error fetching farms with fields data:', error));
  // }, []);

  useEffect(() => {
    const fetchFarmsData = async () => {
      try {
        // Get the authentication token from wherever you store it (e.g., localStorage)
        // Make a GET request with the authentication token in the headers
        const response = await axios.get('http://localhost:8000/farms/farms-with-fields/', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Update the state with the fetched data
        setFarmsData(response.data.farms_data);
      } catch (error) {
        console.error('Error fetching farms with fields data:', error);
      }
    };
      // Call the fetch function
      fetchFarmsData();
    }, []);

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Additional logic to handle onboarding completion if needed
  };

  const farmNames = farmsData.map((farm) => farm.farm_name);
  const fieldsCounts = farmsData.map((farm) => farm.fields_count);

  const data = {
    labels: farmNames,
    datasets: [
      {
        label: 'Number of Fields (Line)',
        type: 'line',
        fill: false,
        borderColor: 'darkgreen', // Orange color
        borderWidth: 2,
        pointBackgroundColor: 'yellow',
        pointRadius: 5,
        pointHoverRadius: 7,
        data: fieldsCounts,
      },
      {
        label: 'Number of Fields (Bar)',
        type: 'bar',
        backgroundColor: '#4CAF50', // Green color
        borderColor: '#4CAF50',
        borderWidth: 1,
        hoverBackgroundColor: '#45a049',
        hoverBorderColor: '#45a049',
        data: fieldsCounts,
      },
    ],
  };
  const ShortcutCard = ({ title, to, color, info }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(to);
    };

    return (
      <button  onClick={handleClick}>
      <div className={`bg-${color}-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105`}>
        <p
          className={`text-${color}-600 font-semibold text-lg block mb-2`}
        >
          {title}
        </p>
        <p className="text-gray-500">{info}</p>
      </div>
      </button>
    );
  };
  

  return (
    <main className="dashboard-container">
      {showOnboarding ? (
        <SlideShow onboardingComplete={handleOnboardingComplete} />
      ) : (
        <>
          {/* Start DashbaordHeader */}
          <div className="px-3 sm:px-8 pt-9 pb-4 flex flex-wrap w-full justify-between items-center">
      <div className="flex flex-row gap-3">
        <p className="flex-shrink-0 rounded-full block md:hidden border border-emerald-400 p-[3px] shadow-lg">
          <img
            className="rounded-full md:h-14 md:w-14 h-10 w-10 border cursor-pointer"
            src={avatar}
            alt="Avatar"
          />
        </p>
        <div id="nameSection">
          <p className="text-sm font-semibold text-gray-500">Welcome,</p>
          <h1 className="font-medium lg:text-3xl text-2xl text-gray-700">
            Get Quick Glance 
          </h1>
        </div>
      </div>
      <div className="avaterSection flex items-center gap-2 sm:gap-6 text-slate-400">
        <div className="hidden md:flex flex-row gap-4 text-xl">
          <button onClick={handleShowOnboarding} className="show-onboarding-button">
              <label> New Here? Click for Tips  <FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon></label>
              </button>
        </div>
        <p className="rounded-full hidden md:block border border-emerald-500 p-[3px] shadow-lg">
          <img
            className="rounded-full md:h-14 md:w-14 h-12 w-12 border cursor-pointer"
            src={avatar}
            alt="Avatar"
          />
        </p>
      </div>
    </div>  
    {/* DashboardHeader end        */}

          <div className="dashboard-content">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="chart-container">
              <h2 className="chart-title">Number of Fields in each Farm</h2>
              <Bar
                data={data}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold mb-6 text-green-600">Quick Links</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ShortcutCard title="Create Farm" to="/farm" color="emerald" info="Effortlessly establish and manage your farm with our user-friendly Create Farm feature, enhancing precision and efficiency in agriculture monitoring." />
                <ShortcutCard title="Add Field" to="/mapcomp" color="emerald" info="Seamlessly cultivate your agricultural vision by creating a farm, then effortlessly add and manage individual fields for tailored monitoring and optimized crop management." />
                {/* Add more shortcut cards as needed */}
              </div>
              
            </div>
        </div>
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ShortcutCard title="Manage Season" to="/season" color="emerald" info="Enhance your agricultural journey by creating and managing seasons, linking fields for precise monitoring, and effortlessly tracking historical records to drive informed decisions and sustainable farming practices." />
                <ShortcutCard title="My Field Data" to="/404" color="emerald" info="Optimize your field operations with our Field Data feature, enabling you to record essential field jobs while leveraging advanced machine learning models for data-driven insights and smarter decision-making in agriculture." />
                {/* Add more shortcut cards as needed */}
              </div>
              
            </div>
        </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;

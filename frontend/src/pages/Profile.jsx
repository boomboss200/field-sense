import React from "react";
import { useGetLoggedUserQuery } from "../services/userAuthApi";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../services/LocalStorageService';
import { useEffect, useState } from 'react';
import { setUserInfo, unsetUserInfo } from '../features/userSlice';
import Navbar from "../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useChangeUserPasswordMutation } from '../services/userAuthApi';
import { useSelector } from 'react-redux';



function Profile() {
  const [sidebarToggle] = useOutletContext();

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { access_token } = getToken()
  const { data, isSuccess } = useGetLoggedUserQuery(access_token)
  const [server_error, setServerError] = useState({})
  const [server_msg, setServerMsg] = useState({})
  const [changeUserPassword] = useChangeUserPasswordMutation()
  const [userData, setUserData] = useState({
    email: "",
    name: ""
  })

   // Store User Data in Local State
   useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        email: data.email,
        name: data.name,
      })
    }
  }, [data, isSuccess])

    // Store User Data in Redux Store
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.email,
        name: data.name
      }))
    }
  }, [data, isSuccess, dispatch])
    
  //Change Password
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      password: data.get('password'),
      password2: data.get('password2'),
    }
    const res = await changeUserPassword({ actualData, access_token })
    if (res.error) {
      setServerMsg({})
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(res.data)
      setServerError({})
      setServerMsg(res.data)
      document.getElementById("password-change-form").reset();
    }

  };
  // Getting User Data from Redux Store
  const myData = useSelector(state => state.user)
  // console.log("Change Password", myData)


return(
  <>
  <main className="h-full">

    {/* Main Content */}
    <div className="mainCard">
      <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
        <form>
          {/* Form Large */}
          <div className="mt-6">
            <label htmlFor="largeInput" className="text-sm text-gray-600">
                Email
            </label>
            <input
              id="largeInput"
              type="text"
              name="largeInput"
              // onChange={(e) => setEmail(e.target.value)}
              className="text-xl placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
              placeholder={userData.email}
            />
          </div>

           {/* Form Large */}
           <div className="mt-6">
            <label htmlFor="largeInput" className="text-sm text-gray-600">
                Name
            </label>
            <input
              id="largeInput"
              type="text"
              name="largeInput"
              // onChange={(e) => setEmail(e.target.value)}
              className="text-xl placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
              placeholder={userData.name}
            />
            
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
        <form onSubmit={handleSubmit} >
          {/* Form Large */}
          <div className="mt-6">
            <label htmlFor="largeInput" className="text-sm text-gray-600">
                New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              // onChange={(e) => setEmail(e.target.value)}
              className="text-xl placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
              placeholder="Enter New Password"
            />
            {server_error?.password && (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    {server_error.password[0]}
               </span>
             )}
          </div>

           {/* Form Large */}
           <div className="mt-6">
            <label htmlFor="largeInput" className="text-sm text-gray-600">
                Name
            </label>
            <input
              id="password2"
              type="password"
              name="password2"
              // onChange={(e) => setEmail(e.target.value)}
              className="text-xl placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
              placeholder="Confirm New Password"
            />
            {server_error?.password2 && (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    {server_error.password2[0]}
               </span>
             )}
          </div>
          
          <div className="mt-6 flex flex-row gap-4">
            <button className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
              Update Password 
            </button>   

          </div>
          {server_error?.non_field_errors && (
               <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  {server_error.non_field_errors[0]}
               </span>
          )}
           {server_msg?.msg && (
               <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  {server_msg.msg}
               </span>
          )}
        </form>
      </div>
      
    </div>
  </main>
</>
)}

export default Profile;

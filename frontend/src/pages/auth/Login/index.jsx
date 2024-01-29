import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from "../../../services/userAuthApi";
import { getToken, storeToken } from '../../../services/LocalStorageService';
import { setUserToken } from '../../../features/authSlice';
import logo from './logo.png'
import background from './background.jpg'


function LoginIndex() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [newemail, setnewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
 

  const [server_error, setServerError] = useState({})
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()
  //mycode
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if (res.error) {
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      // console.log(typeof (res.data))
      // console.log(res.data)
      storeToken(res.data.token)
      let { access_token } = getToken()
      dispatch(setUserToken({ access_token: access_token }))
      navigate('/dashboard')
    }
  }
  let { access_token } = getToken()
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }))
  }, [access_token, dispatch])

  const LoginImage =
    "https://edp.raincode.my.id/static/media/login.cc0578413db10119a7ff.png";
  return (
    <>
    {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.email ? console.log(server_error.email[0]) : ""}
    {server_error.password ? console.log(server_error.password[0]) : ""}

      <div className="flex min-h-screen">
        <div className="flex w-full flex-col md:flex-row">
          {/* Image */}
          <div className="md:bg-none md:min-h-screen flex flex-wrap md:w-1/2" style={{ backgroundImage: `url(${background})`,opacity: 0.9}}>
            <div className="items-center text-center flex flex-col relative justify-center mx-auto">
              <img
                src={logo}
                alt="Logo Login"
                className="md:w-78 w-53 mx-auto"
              />
              <div className="md:block hidden text-slate-100">
                <h1 className="font-Times New Roman-semibold text-2xl pb-2">
                  Precision Agriculture, Informed Decisions
                </h1>
                <span className="text-sm">
                  Cultivating a Brighter Future, One Field at a Time.
                </span>
              </div>
            </div>
          </div>
          {/* Login Section */}
          <div className="flex flex-col md:flex-1 items-center justify-center">
            <div className="loginWrapper flex flex-col w-full lg:px-36 md:px-8 px-8 md:py-8">
              {/* Login Header Text */}
              <div className="hidden md:block font-Times New Roman-semibold  self-center text-xl sm:text-3xl text-gray-800">
                Welcome Back!
              </div>

              {/* Sparator */}
              <div className="hidden md:block relative mt-10 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    Login with registered email 
                  </span>
                </div>
              </div>

              <div className="md:hidden block my-4">
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>

              {/* Login Form */}
              <div className="md:mt-10 mt-4">
                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="flex flex-col mb-3">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>

                      <input
                        id="email"
                        type="text"
                        name="email"
                        label="Email Address"
                        onChange={(e) => setnewEmail(e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="Email Address"
                      />
                    </div>
                    {server_error?.email && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {server_error.email[0]}
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col mb-6">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faLock} />
                      </div>

                      <input
                        id="password"
                        label="Password"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="Password"
                      />
                    </div>
                    {server_error?.password && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {server_error.password[0]}
                      </span>
                    )}
                  </div>
                  
                 

                  {/* Forgot Password Link */}
                  <div className="flex items-center mb-6 -mt-2 md:-mt-4">
                    <div className="flex ml-auto">
                      <Link
                        to="/forgetpassword"
                        className="inline-flex font-semibold text-xs sm:text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Forget password?
                      </Link>
                    </div>
                  </div>

                  {/* Button Login */}
                  <div className="flex w-full">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex items-center justify-center focus:outline-none text-white text-sm bg-emerald-500 hover:bg-emerald-700 rounded-lg md:rounded md:py-2 py-3 w-full transition duration-150 ease-in"
                    >
                      <span className="mr-2 md:uppercase">
                        { isLoading ? "Processing...." : "Login"}
                      </span>
                    </button>
                  </div>
                  {server_error?.non_field_errors && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {server_error.non_field_errors[0]}
                      </span>
                  )}
                </form>
              </div>

              {/* Sparator */}
              <div className="relative mt-6 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    OR
                  </span>
                </div>
              </div>

              {/* Social Button */}
              <div className="flex justify-between w-full mt-6">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-slate-500 text-sm bg-slate-200 rounded-lg md:rounded md:py-2 px-3 py-3 w-full transition duration-150 ease-in"
                >
                  <FontAwesomeIcon icon={faGoogle} />
                  <span className="mr-2 flex-1">Login with Google</span>
                </button>
              </div>
              {/* <div className="flex justify-between w-full mt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-slate-500 text-sm bg-slate-200 rounded-lg md:rounded md:py-2 px-3 py-3 w-full transition duration-150 ease-in"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                  <span className="mr-2 flex-1">Login with Facebook</span>
                </button>
              </div> */}
              {/* End Social Button */}

              {/* Register Link */}
              <div className="flex justify-center items-center  my-6 md:mb-0">
                <Link
                  to="/register"
                  className="inline-flex items-center font-bold text-emerald-600 hover:text-emerald-700 text-xs text-center"
                >
                  <span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                  </span>
                  <span className="ml-2 font-Times New Roman-semibold ">Dont have an account?</span>
                </Link>
              </div>
              {/* End Register Link */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginIndex;

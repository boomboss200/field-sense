import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useEffect, useState } from "react";
import { Link, useNavigate,useParams} from "react-router-dom";
import { useResetPasswordMutation } from "../../../services/userAuthApi";

function ResetIndex() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [server_error, setServerError] = useState({})
  const [server_msg, setServerMsg] = useState({})
  const [resetPassword] = useResetPasswordMutation()
  const { id, token } = useParams()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      password: data.get('password'),
      password2: data.get('password2'),
    }
    const res = await resetPassword({ actualData, id, token })
    if (res.error) {
      setServerMsg({})
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      setServerError({})
      setServerMsg(res.data)
      document.getElementById('password-reset-form').reset()
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    }

  }



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
          <div className="md:bg-emerald-500 md:min-h-screen flex flex-wrap md:w-1/2">
            <div className="items-center text-center flex flex-col relative justify-center mx-auto">
              <img
                src={LoginImage}
                alt="Logo Login"
                className="md:w-72 w-48 mx-auto"
              />
              <div className="md:block hidden text-slate-100">
                <h1 className="font-semibold text-2xl pb-2">
                  Reset Password 
                </h1>
                <span className="text-sm">
                 Enter the New Password using the Link on your Email
                </span>
              </div>
            </div>
          </div>
          {/* Login Section */}
          <div className="flex flex-col md:flex-1 items-center justify-center">
            <div className="loginWrapper flex flex-col w-full lg:px-36 md:px-8 px-8 md:py-8">
              {/* Login Header Text */}
              <div className="hidden md:block font-medium self-center text-xl sm:text-3xl text-gray-800">
                Get Hold of Your Account !
              </div>

              {/* Sparator */}
              <div className="hidden md:block relative mt-10 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    Enter New Password for Your Account
                  </span>
                </div>
              </div>

              <div className="md:hidden block my-4">
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>

              {/* Login Form */}
              <div className="md:mt-10 mt-4">
                <form onSubmit={handleSubmit}>
                  {/* Reset Password */}
                  <div className="flex flex-col mb-3">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>

                      <input
                        id="password"
                        type="password"
                        name="password"
                        label="Enter New Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="Enter New Password"
                      />
                    </div>
                    {server_error?.password && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {server_error.password[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col mb-3">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>

                      <input
                        id="password2"
                        type="password"
                        name="password2"
                        label="Confirm New Password"
                        onChange={(e) => setPassword2(e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="Confirm New Password"
                      />
                    </div>
                    {server_error?.password2 && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {server_error.password2[0]}
                      </span>
                    )}
                  </div>

                  {/* Button Login */}
                  <div className="flex w-full">
                    <button
                      // disabled={loading}
                      type="submit"
                      className="flex items-center justify-center focus:outline-none text-white text-sm bg-emerald-500 hover:bg-emerald-700 rounded-lg md:rounded md:py-2 py-3 w-full transition duration-150 ease-in"
                    >
                      <span className="mr-2 md:uppercase">
                        {"Save Password"}
                      </span>
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

              {/* Sparator */}
              <div className="relative mt-6 h-px bg-gray-300">
                 {/* Social Button */}
              <div className="flex justify-between w-full mt-6">
                <button
                  // disabled={loading}
                  className="flex items-center justify-center focus:outline-none text-slate-500 text-sm bg-slate-200 rounded-lg md:rounded md:py-2 px-3 py-3 w-full transition duration-150 ease-in"
                >
                 
                  <Link to='/login'>Login Into Your Account</Link>
                </button>
              </div>
              </div>
              {/* End Social Button */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetIndex;

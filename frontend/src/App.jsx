import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashboard";
import Trash from "./pages/Trash";
import AuthLayout from "./components/Layout/AuthLayout";
import GuestLayout from "./components/Layout/GuestLayout";
import Login from "./pages/auth/Login";
import Blank from "./pages/Blank";
import NotFound from "./pages/NotFound";
import Form from "./pages/Form";
import RegisterIndex from "./pages/auth/Register";
import { useSelector } from "react-redux";
import ForgetPassword from "./pages/auth/ForgetPassword/forgetIndex";
import ResetPassword from "./pages/auth/ForgetPassword/resetIndex";
import Map from "./pages/Map";
import Farm from "./pages/AddFarm";
import SeasonPage from "./pages/SeasonPage";
import MyFields from "./pages/MyFields";
import Onboarding from "./pages/onBoarding";
import DeleteFields from "./components/DeleteFieldsComponent";

function App() {
  const { access_token } = useSelector(state => state.auth)

  return (
    <>
       <ToastContainer position="bottom-center" limit={1} />
    
    <Routes>
      <Route path="/" element={<AuthLayout/> }>
        <Route path="/dashboard" element={access_token ?<Onboarding /> : <Navigate to='/login' />}></Route>
        <Route path="/trash" element={access_token ?<Trash /> : <Navigate to='/login' />}></Route>
        <Route path="/mapcomp" element={access_token ?<Map /> : <Navigate to='/login' />}></Route>
        <Route path="/404" element={access_token ?<MyFields/> : <Navigate to='/login' />}></Route>
        <Route path="/form" element={access_token ?<Form /> : <Navigate to='/login' />}></Route>
        <Route path="/profile" element={access_token ? <Profile /> : <Navigate to='/login' />}></Route>
        <Route path="/farm" element={access_token ? <Farm /> : <Navigate to='/login' />}></Route>
        <Route path="/season" element={access_token ?<SeasonPage /> : <Navigate to='/login' />}></Route>
        {/* <Route path="/dashboard" element={access_token ?<MyFields /> : <Navigate to='/login' />}></Route> */}

      </Route>
      <Route path="/" element={ <GuestLayout /> }>
        <Route path="/login" element={!access_token ?<Login />: <Navigate to="/dashboard" />}></Route>
        <Route path="/register" element={!access_token ? <RegisterIndex />: <Navigate to="/dashboard" />}></Route>
        <Route path="/forgetpassword" element={!access_token ? <ForgetPassword />: <Navigate to="/dashboard" />}></Route>
        <Route path="api/user/reset/:id/:token" element={!access_token ? <ResetPassword />: <Navigate to="/dashboard" />} />
     </Route>
    </Routes>
    </>
  );
}

export default App;
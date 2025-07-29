import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from './loginservice/LoginPage'
import Registration from './loginservice/Registraion'
import PatientHeader from "./Patient/PatientHeader";
import DoctorHeader from "./Doctor/DoctorHeader";

const AppRoutes = () =>{
    return(
        <Routes>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<Registration/>}/>
            <Route path="/patient" element={<PatientHeader />}/>
            <Route path="/doctor" element={<DoctorHeader />} />
            
        </Routes>
    );
};

export default AppRoutes;
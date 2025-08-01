import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from './loginservice/LoginPage'
import Registration from './loginservice/Registraion'
import PatientHeader from "./Patient/PatientHeader";
import DoctorHeader from "./Doctor/DoctorHeader";
import AdminHeader from "./admin/AdminHeader";
import HealthCare from "./HealthCare"

const AppRoutes = () =>{
    return(
        <Routes>
            <Route path="/" element={<HealthCare />} />
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<Registration/>}/>
            <Route path="/patient" element={<PatientHeader />}/>
            <Route path="/doctor" element={<DoctorHeader />} />
            <Route path="/admin" element={<AdminHeader />} />
            
        </Routes>
    );
};

export default AppRoutes;
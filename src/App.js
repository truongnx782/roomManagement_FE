import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RoomComponent from './components/Room';
import ServiceComponent from './components/Service';
import UtilityComponent from './components/Utility';
import CustomerComponent from './components/Customer';
import ContractComponent from './components/Contract';
import PaymentComponent from './components/Payment';
import MaintenanceComponent from './components/Maintenance';
import Login from './components/Login';

function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/phong/hien-thi" element={<RoomComponent />} />
        <Route path="/dich-vu/hien-thi" element={<ServiceComponent />} />
        <Route path="/tien-ich/hien-thi" element={<UtilityComponent />} />
        <Route path="/khach-hang/hien-thi" element={<CustomerComponent />} />
        <Route path="/hop-dong/hien-thi" element={<ContractComponent />} />
        <Route path="/thanh-toan/hien-thi" element={<PaymentComponent />} />
        <Route path="/bao-tri/hien-thi" element={<MaintenanceComponent />} />
      </Routes>
    </Router>
  );
  
}

export default App;
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
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
  };

  // Xóa useEffect liên quan đến auto-login
  // useEffect(() => {
  //   setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/phong/hien-thi" : "/login"} />} />
        <Route path="/login" element={<Login setIsLoggedIn={handleLogin} />} />
        <Route path="/phong/hien-thi" element={isLoggedIn ? <RoomComponent /> : <Navigate to="/login" />} />
        <Route path="/dich-vu/hien-thi" element={isLoggedIn ? <ServiceComponent /> : <Navigate to="/login" />} />
        <Route path="/tien-ich/hien-thi" element={isLoggedIn ? <UtilityComponent /> : <Navigate to="/login" />} />
        <Route path="/khach-hang/hien-thi" element={isLoggedIn ? <CustomerComponent /> : <Navigate to="/login" />} />
        <Route path="/hop-dong/hien-thi" element={isLoggedIn ? <ContractComponent /> : <Navigate to="/login" />} />
        <Route path="/thanh-toan/hien-thi" element={isLoggedIn ? <PaymentComponent /> : <Navigate to="/login" />} />
        <Route path="/bao-tri/hien-thi" element={isLoggedIn ? <MaintenanceComponent /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import Login from './components/Login';
import RoomComponent from './components/Room';
import ServiceComponent from './components/Service';
import UtilityComponent from './components/Utility';
import CustomerComponent from './components/Customer';
import ContractComponent from './components/Contract';
import PaymentComponent from './components/Payment';
import MaintenanceComponent from './components/Maintenance';


// import ContractTableComponent from './components/Contract/ContractTable';
// import ContractFormComponent from './components/Contract/ContractForm';


import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/phong/hien-thi" />} />
          <Route path="/phong/hien-thi" element={<RoomComponent />} />
          <Route path="/dich-vu/hien-thi" element={<ServiceComponent />} />
          <Route path="/tien-ich/hien-thi" element={<UtilityComponent />} />
          <Route path="/khach-hang/hien-thi" element={<CustomerComponent />} />
          <Route path="/hop-dong/hien-thi" element={<ContractComponent />} />
          <Route path="/thanh-toan/hien-thi" element={<PaymentComponent />} />
          <Route path="/bao-tri/hien-thi" element={<MaintenanceComponent />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;

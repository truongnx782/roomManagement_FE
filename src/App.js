import React, { useState, useEffect } from 'react';
import RoomComponent from './components/Room';
import ServiceComponent from './components/Service';
import UtilityComponent from './components/Utility';
import CustomerComponent from './components/Customer';


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/phong/hien-thi" element={<RoomComponent  />} />
          <Route path="/dich-vu/hien-thi" element={<ServiceComponent  />} />
          <Route path="/tien-ich/hien-thi" element={<UtilityComponent  />} />
          <Route path="/khach-hang/hien-thi" element={<CustomerComponent  />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

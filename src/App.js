import React, { useState, useEffect } from 'react';
import PhongComponent from './components/Phong';
import DichVuComponent from './components/DichVu';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/phong/hien-thi" element={<PhongComponent  />} />
          <Route path="/dich-vu/hien-thi" element={<DichVuComponent  />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

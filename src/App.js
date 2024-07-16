import React, { useState, useEffect } from 'react';
import PhongComponent from './components/Phong';
import DichVuComponent from './components/DichVu';
import CreateComponent from './components/Create';
import ViewUpdate from'./components/view-update';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/phong/hien-thi" element={<PhongComponent  />} />
          <Route path="/dich-vu/hien-thi" element={<DichVuComponent  />} />
          <Route path="/create" element={<CreateComponent />} />
          <Route exact path="/view-update/:id" element={<ViewUpdate />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;

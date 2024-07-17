import React, { useState, useEffect, useRef } from 'react';

        
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SidebarMenu() {
    return (
      <div className="d-flex flex-column bg-dark text-white p-3 vh-100 border-3">
        <h4 className="text-center mb-4">Menu</h4>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item mb-2">
            <a href="http://localhost:3000/phong/hien-thi" className="nav-link text-white">
              <i className="pi pi-home mr-2"></i> Quản lý phòng
            </a>
          </li>
          <li className="nav-item">
            <a href="http://localhost:3000/dich-vu/hien-thi" className="nav-link text-white">
              <i className="pi pi-cog mr-2"></i> Quản lý dịch vụ
            </a>
          </li>
          <li className="nav-item">
            <a href="http://localhost:3000/tien-ich/hien-thi" className="nav-link text-white">
              <i className="pi pi-cog mr-2"></i> Quản lý tiện ích
            </a>
          </li>
        </ul>
      </div>
    );
  }
  export default SidebarMenu;

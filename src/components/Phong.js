import React, { useState, useEffect } from 'react';
import ApiService from '../ApiPhongService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

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
      </ul>
    </div>
  );
}

function TableComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await ApiService.getDataPhong();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleViewUpdate = (id) => {
    window.location.href = `http://localhost:3000/phong/view-update/${id}`;
  };

  const handleViewDetail = (id) => {
    window.location.href = `http://localhost:3000/phong/detal/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      await ApiService.deleteData(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const actionBodyTemplate = (rowData) => (
    <div className="btn-group" role="group">
      <button
        type="button"
        className="btn btn-info"
        onClick={() => handleViewDetail(rowData.id)}
      >
        <i className="pi pi-search mr-1"></i> Xem chi tiết
      </button>
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => handleViewUpdate(rowData.id)}
      >
        <i className="pi pi-pencil mr-1"></i> Update
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => handleDelete(rowData.id)}
      >
        <i className="pi pi-trash mr-1"></i> Delete
      </button>
    </div>
  );

  return (
    <div className="d-flex">
      <SidebarMenu />
      <div className="container-fluid p-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4 text-primary d-flex justify-content-center">Quản lý phòng</h2>
            <a href="http://localhost:3000/create" className="btn btn-success mb-3">
              <i className="pi pi-plus mr-1"></i> Thêm mới
            </a>
            <div className="table-responsive">
              <DataTable value={data} className="table table-striped table-bordered">
                <Column field="maPhong" header="MaPhong" />
                <Column field="tenPhong" header="TenPhong" />
                <Column field="dienTich" header="Dien Tich" />
                <Column field="giaThue" header="Gia Thue" />
                <Column field="diaChi" header="Dia Chi" />
                <Column field="trangThai" header="Trang Thai" />
                <Column field="trangThaiThue" header="Trang Thai Thue" />
                <Column body={actionBodyTemplate} header="Actions" />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;

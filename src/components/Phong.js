import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../Service/ApiPhongService';
import ApiPhong_TienIchService from '../Service/ApiPhong_TienIchService';
import SidebarMenu from './SidebarMenu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { MultiSelect } from 'primereact/multiselect';
import '../css/style.css';

function TableComponent() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const toast = useRef(null);

  const [utilitys, setUtilitys] = useState([]);
  const [selectedUtility, setSelectedUtility] = useState([]);

  useEffect(() => {
    fetchData();
    fetchListUtility();
  }, [page, pageSize, search, status]);

  const fetchData = async () => {
    try {
      const response = await ApiService.search(page, pageSize, search, status);
      setData(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchListUtility = async () => {
    try {
      const response = await fetch('http://localhost:8080/utility/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page: 0, size: 10, search: '', status: null }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setUtilitys(data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onPageChange = (event) => {
    setPage(event.first / event.rows);
    setPageSize(event.rows);
  };

  const edit = async (id) => {
    try {
      const result = await ApiService.getById(id);
      const Room_Utility = await ApiPhong_TienIchService.getUtilityIdByRoomId(id);
      setSelectedUtility(Room_Utility)
      setSelectedData(result);
      setDisplayDialog(true);
      setIsNew(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const save = async () => {
    try {
      if (!validate()) {
        return;
      }
      if (isNew) {
        const createdData = await ApiService.create(selectedData);
        const room = createdData.id;
        const utilitys = selectedUtility;
      
        const dataToCreate = {
          id: null,
          room: room,
          utilitys: utilitys,
          status:1
        };
      
        await ApiPhong_TienIchService.create(dataToCreate);
        showToast('success', 'Thành công', 'Thêm mới thành công!.');
      } else {
        await ApiService.update(selectedData.id, selectedData);
        const room = selectedData.id;
        const utilitys = selectedUtility;
      
        const dataToUpdate = {
          id: null,
          room: room,
          utilitys: utilitys,
          status:1
        };
        await ApiPhong_TienIchService.update(dataToUpdate);
        showToast('success', 'Thành công', 'Cập nhật thành công!.');
      }
      fetchData();
      onHide();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const remove = async (id) => {
    try {
      await ApiService.delete(id);
      fetchData();
      showToast('success', 'Thành công', 'Đóng thành công.');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: 'Bạn có xác nhận đóng phòng?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      rejectClassName: 'btn btn-secondary',
      acceptClassName: 'btn btn-danger ml-2',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Huỷ',
      accept: () => remove(id),
    });
  };

  const confirmSave = () => {
    confirmDialog({
      message: 'Bạn có xác nhận lưu phòng?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      rejectClassName: 'btn btn-secondary',
      acceptClassName: 'btn btn-success ml-2',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Huỷ',
      accept: () => save(),
    });
  };

  const action = (rowData) => (
    <div className="btn-group" role="group">
      <button type="button" className="btn btn-warning" onClick={() => edit(rowData.id)}>
        <i className="pi pi-pencil mr-1"></i>
      </button>

      <button
        type="button"
        className="btn btn-danger"
        disabled={rowData.rentStatus === 1 || rowData.status === 0}
        onClick={() => confirmDelete(rowData.id)}>
        <i className="pi pi-trash mr-1"></i>
      </button>
    </div>
  );

  const handleChange = (e) => {
    setSelectedData({ ...selectedData, [e.target.name]: e.target.value });
  };
  
  const onHide = () => {
    setDisplayDialog(false);
    setSelectedData(null);
    setIsNew(false);
    setErrors({});
  };

  const openNew = () => {
    setSelectedData(null);
    setSelectedUtility([])
    setDisplayDialog(true);
    setIsNew(true);
  };

  const validate = () => {
    let isValid = true;
    const errors = {};

    if (!selectedData || !selectedData.roomName || selectedData.roomName.trim() === '') {
      errors.roomName = 'Tên phòng không được để trống.';
      isValid = false;
    }

    if (!selectedData || !selectedData.area || selectedData.area.trim() === '') {
      errors.area = 'Diện tích không được để trống.';
      isValid = false;
    }

    if (
      !selectedData || !selectedData.rentPrice || isNaN(selectedData.rentPrice) || selectedData.rentPrice < 0
    ) {
      errors.rentPrice = 'Số tiền thuê không được để trống.';
      isValid = false;
    }
    if (!selectedData || !selectedData.address || selectedData.address.trim() === '') {
      errors.address = 'Địa chỉ không được để trống.';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  return (
    <div className="d-flex">
      <SidebarMenu />
      <div className="container-fluid p-4">
        <h2 className="card-title mb-4 text-black d-flex justify-content-center">QUẢN LÝ PHÒNG</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button onClick={openNew} className="btn btn-success">
                <i className="pi pi-plus mr-1"></i> Thêm mới
              </Button>

              {/* SEARCH */}
              <div className="d-flex align-items-center">
                <InputText
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="mr-2"
                />
                <div className="mr-2">
                  <label className="mr-2">Status:</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusActive"
                      value={1}
                      checked={status === 1}
                      onChange={() => setStatus(1)}
                    />
                    <label className="form-check-label" htmlFor="statusActive">
                      Active
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusClosed"
                      value={0}
                      checked={status === 0}
                      onChange={() => setStatus(0)}
                    />
                    <label className="form-check-label" htmlFor="statusClosed">
                      Closed
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">

              <DataTable value={data}>
                <Column field="roomCode" header="Mã Phòng" sortable style={{ width: '14%' }}></Column>
                <Column field="roomName" header="Tên phòng" sortable style={{ width: '14%' }}></Column>
                <Column field="area" header="Diện tích" sortable style={{ width: '14%' }}></Column>
                <Column field="rentPrice" header="Giá thuê" sortable style={{ width: '14%' }}></Column>
                <Column field="address" header="Địa chỉ" sortable style={{ width: '14%' }}></Column>
                <Column
                  field="rentStatus"
                  header="Trạng thái thuê"
                  sortable
                  style={{ width: '14%' }}
                  body={(rowData) => (
                    <span
                      style={{
                        color:
                          rowData.rentStatus === 0
                            ? 'orange'
                            : rowData.rentStatus === 1
                              ? 'deepskyblue'
                              : 'inherit',
                        fontWeight: 'bold',
                      }}
                    >
                      {rowData.rentStatus === 0
                        ? 'Trống'
                        : rowData.rentStatus === 1
                          ? 'Đã thuê'
                          : 'Undefined'}
                    </span>
                  )}
                ></Column>
                <Column
                  field="status"
                  header="Trạng thái"
                  sortable
                  style={{ width: '14%' }}
                  body={(rowData) => (
                    <span
                      style={{
                        color:
                          rowData.status === 0
                            ? 'red'
                            : rowData.status === 1
                              ? 'green'
                              : 'inherit',
                        fontWeight: 'bold',
                      }}
                    >
                      {rowData.status === 0
                        ? 'Đóng'
                        : rowData.status === 1
                          ? 'Hoạt động'
                          : 'Undefined'}
                    </span>
                  )}
                ></Column>
                <Column body={action} header="Hành động" sortable style={{ width: '14%' }}></Column>
              </DataTable>
            </div>

            <Paginator
              first={page * pageSize}
              rows={pageSize}
              totalRecords={totalPages * pageSize}
              onPageChange={onPageChange}
              rowsPerPageOptions={[5, 10, 20]}
              className="p-mt-5"
            />
          </div>
        </div>
      </div>

      <Dialog
        visible={displayDialog}
        onHide={onHide}
        header={isNew ? 'Add New Room Information' : 'Update Room Information'}
        style={{ width: '70vw' }}
      >
        <div className="p-fluid">
          <div className="form-group">
            <label htmlFor="roomCode">Mã phòng</label>
            <InputText
              disabled
              id="roomCode"
              value={selectedData?.roomCode || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomName">Tên phòng</label>
            <InputText
            id="roomName"
            name="roomName"
            value={selectedData?.roomName || ''}
            onChange={handleChange}
            className={`form-control ${errors.roomName ? 'is-invalid' : ''}`}
          />

            <small className="invalid-feedback">{errors.roomName}</small>
          </div>
          <div className="form-group">
            <label htmlFor="area">Diện tích</label>
            <InputText
              id="area"
              name="area"
              value={selectedData?.area || ''}
              onChange={handleChange}
              className={`form-control ${errors.area ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.area}</small>
          </div>
          <div className="form-group">
            <label htmlFor="rentPrice">Giá thuê</label>
            <InputText
              id="rentPrice"
              name="rentPrice"
              value={selectedData?.rentPrice || ''}
              onChange={handleChange}
              className={`form-control ${errors.rentPrice ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.rentPrice}</small>
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <InputText
              id="address"
              name="address"
              value={selectedData?.address || ''}
              onChange={handleChange}
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.address}</small>
          </div>
          <div className="form-group">
          {/* <label htmlFor="address">Tiện ích</label>
            <MultiSelect value={selectedUtility} onChange={(e) => setSelectedUtility(e.value)}
              options={utilitys} optionLabel="utilityName" optionValue="id" 
              display="chip"
              placeholder="Select Cities" maxSelectedLabels={3} className="w-full md:w-20rem" /> */}

          <label htmlFor="address">Tiện ích</label>
            <MultiSelect value={selectedUtility} onChange={(e) => setSelectedUtility(e.value)}
            options={utilitys.map(option => ({label: option.utilityName, value: option.id}))} 
              placeholder="Select Cities" maxSelectedLabels={3} className="w-full md:w-20rem" />

          </div>

        </div>
        <div className="p-mt-4 d-flex justify-content-end">
          <Button label="Huỷ" onClick={onHide} className="btn btn-secondary" style={{ marginRight: '10px' }} />
          <Button label="Lưu" onClick={confirmSave} className="btn btn-primary" />
        </div>
      </Dialog>

      <Toast ref={toast} />
      <ConfirmDialog />

    </div>
  );
}

export default TableComponent;

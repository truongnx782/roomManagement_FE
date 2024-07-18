import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../Service/ApiDichVuService';
import SidebarMenu from './SidebarMenu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import '../css/style.css';

function TableComponent() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    fetchData();
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

  const onPageChange = (event) => {
    setPage(event.first / event.rows);
    setPageSize(event.rows);
  };

  const edit = async (id) => {
    try {
      const result = await ApiService.getById(id);
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
        await ApiService.create(selectedData);
        showToast('success', 'Thành công', 'Thêm mới thành công.');
      } else {
        await ApiService.update(selectedData.id, selectedData);
        showToast('success', 'Thành công', 'Cập nhật thành công.');
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
      showToast('success', 'Thành công', 'Đóng thành công!.');
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

  const ConfirmSave = () => {
    confirmDialog({
      message: 'Bạn có xác nhận lưu phòng',
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
        disabled={rowData.status === 0}
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
    setDisplayDialog(true);
    setIsNew(true);
  };

  const validate = () => {
    let isValid = true;
    const errors = {};

    if (!selectedData || !selectedData.serviceName || selectedData.serviceName.trim() === '') {
      errors.serviceName = 'Tên dịch vụ không được để trống.';
      isValid = false;
    }
    if (
      !selectedData ||
      !selectedData.servicePrice ||
      isNaN(selectedData.servicePrice) ||
      selectedData.servicePrice < 0
    ) {
      errors.servicePrice = 'Giá dịch vụ phải lớn hơn 0.';
      isValid = false;
    }
    if (!selectedData || !selectedData.startDate) {
      errors.startDate = 'Ngày bắt đầu không được để trống.';
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
        <h2 className="card-title mb-4 text-black d-flex justify-content-center"> QUẢN LÝ DỊCH VỤ</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button onClick={openNew} className="btn btn-success">
                <i className="pi pi-plus mr-1"></i> Thêm mới
              </Button>

              {/* SEARCH */}
              <div className="card p-3 mb-3">
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

            </div>
            <div className="table-container table-responsive">
              <DataTable value={data}>
                <Column field="serviceCode" header="Mã dịch vụ" sortable style={{ width: '14%' }}></Column>
                <Column field="serviceName" header="Tên dịch vụ" sortable style={{ width: '14%' }}></Column>
                <Column field="servicePrice" header="Giá dịch vụ" sortable style={{ width: '14%' }}></Column>
                <Column field="startDate" header="Ngày bắt đầu" sortable style={{ width: '14%' }}></Column>
                <Column field="endDate" header="Ngày kết thúc" sortable style={{ width: '14%' }}></Column>
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
        header={isNew ? 'Thêm dịch vụ' : 'Cập nhật dịch vụ'}
        style={{ width: '70vw' }}
      >
        <div className="p-fluid">
          <div className="form-group">
            <label htmlFor="serviceCode">Mã dịch vụ</label>
            <InputText
              disabled
              id="serviceCode"
              value={selectedData?.serviceCode || ''}
              onChange={(e) => setSelectedData({ ...selectedData, serviceCode: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="serviceName">Tên dịch vụ</label>
            <InputText
              id="serviceName"
              name="serviceName"
              value={selectedData?.serviceName || ''}
              onChange={handleChange}
              className={`form-control ${errors.serviceName ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.serviceName}</small>
          </div>
          <div className="form-group">
            <label htmlFor="servicePrice">Giá dịch vụ</label>
            <InputText
              id="servicePrice"
              name="servicePrice"
              type="number"
              value={selectedData?.servicePrice || ''}
              onChange={handleChange}
              className={`form-control ${errors.servicePrice ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.servicePrice}</small>
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Ngày bắt đầu</label>
            <InputText
              id="startDate"
              name="startDate"
              type="date"
              value={selectedData?.startDate || ''}
              onChange={handleChange}
              className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.startDate}</small>
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Ngày kết thúc</label>
            <InputText
              id="endDate"
              name="endDate"
              type="date"
              value={selectedData?.endDate || ''}
              onChange={handleChange}
              className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.endDate}</small>
          </div>
        </div>
        <div className="p-mt-4 d-flex justify-content-end">
          <Button label="Huỷ" onClick={onHide} className="btn btn-secondary" style={{ marginRight: '10px' }} />
          <Button label="Lưu" onClick={ConfirmSave} className="btn btn-primary" />
        </div>
      </Dialog>
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}

export default TableComponent;

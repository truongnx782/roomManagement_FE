import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../ApiPhongService';
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
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [trangThai, setTrangThai] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search, trangThai]);

  const fetchData = async () => {
    try {
      const response = await ApiService.search(page, pageSize, search, trangThai);
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
        showToast('success', 'Thành công', 'Thêm thành công.');
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
      showToast('success', 'Thành công', 'Đóng thành công.');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: 'Bạn xác nhận đóng phòng này?',
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
      message: 'Xác nhận lưu phòng này?',
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
        disabled={rowData.trangThaiThue === 1 || rowData.trangThai===0}
        onClick={() => confirmDelete(rowData.id)}>
        <i className="pi pi-trash mr-1"></i>
      </button>

    </div>
  );

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

    if (!selectedData || !selectedData.tenPhong || selectedData.tenPhong.trim() === '') {
      errors.tenPhong = 'Tên phòng không được để trống.';
      isValid = false;
    }

    if (!selectedData || !selectedData.dienTich || selectedData.dienTich.trim() === '') {
      errors.dienTich = 'Diện tích không được để trống.';
      isValid = false;
    }

    if (
      !selectedData || !selectedData.giaThue || isNaN(selectedData.giaThue) || selectedData.giaThue < 0) {
      errors.giaThue = 'Giá thuê phải là một số không âm.';
      isValid = false;
    }
    if (!selectedData || !selectedData.diaChi || selectedData.diaChi.trim() === '') {
      errors.diaChi = 'Địa chỉ không được để trống.';
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

              {/* //SEARCH */}
              <div className="d-flex align-items-center">
                <InputText
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="mr-2"
                />
                <div className="mr-2">
                  <label className="mr-2">Trạng thái:</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="trangThai"
                      id="trangThaiHoatDong"
                      value={1}
                      checked={trangThai === 1}
                      onChange={() => setTrangThai(1)}
                    />
                    <label className="form-check-label" htmlFor="trangThaiHoatDong">
                      Hoạt Động
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="trangThai"
                      id="trangThaiDaDong"
                      value={0}
                      checked={trangThai === 0}
                      onChange={() => setTrangThai(0)}
                    />
                    <label className="form-check-label" htmlFor="trangThaiDaDong">
                      Đã Đóng
                    </label>
                  </div>
                </div>
              </div>

            </div>
            <div className="table-responsive">
              <DataTable value={data}>
                <Column field="maPhong" header="Mã phòng" sortable style={{ width: '14%' }}></Column>
                <Column field="tenPhong" header="Tên phòng" sortable style={{ width: '14%' }}></Column>
                <Column field="dienTich" header="Diện tích" sortable style={{ width: '14%' }}></Column>
                <Column field="giaThue" header="Giá thuê" sortable style={{ width: '14%' }}></Column>
                <Column field="diaChi" header="Địa chỉ" sortable style={{ width: '14%' }}></Column>
                <Column
                  field="trangThaiThue"
                  header="Trạng thái thuê"
                  sortable
                  style={{ width: '14%' }}
                  body={(rowData) => (
                    <span
                      style={{
                        color:
                          rowData.trangThaiThue === 0
                            ? 'orange'
                            : rowData.trangThaiThue === 1
                              ? 'deepskyblue'
                              : 'inherit',
                        fontWeight: 'bold',
                      }}
                    >
                      {rowData.trangThaiThue === 0
                        ? 'Chưa cho thuê'
                        : rowData.trangThaiThue === 1
                          ? 'Đã cho thuê'
                          : 'Không xác định'}
                    </span>
                  )}
                ></Column>

                <Column
                  field="trangThai"
                  header="Trạng thái"
                  sortable
                  style={{ width: '14%' }}
                  body={(rowData) => (
                    <span
                      style={{
                        color:
                          rowData.trangThai === 0
                            ? 'red'
                            : rowData.trangThai === 1
                              ? 'green'
                              : 'inherit',
                        fontWeight: 'bold',
                      }}
                    >
                      {rowData.trangThai === 0
                        ? 'Đã đóng'
                        : rowData.trangThai === 1
                          ? 'Hoạt Động'
                          : 'Không xác định'}
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
        header={isNew ? 'Thêm mới thông tin' : 'Cập nhật thông tin'}
        style={{ width: '70vw' }}
      >
        <div className="p-fluid">
          <div className="form-group">
            <label htmlFor="maPhong">Mã phòng</label>
            <InputText
              disabled
              id="maPhong"
              value={selectedData?.maPhong || ''}
              onChange={(e) => setSelectedData({ ...selectedData, maPhong: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tenPhong">Tên phòng</label>
            <InputText
              id="tenPhong"
              value={selectedData?.tenPhong || ''}
              onChange={(e) => setSelectedData({ ...selectedData, tenPhong: e.target.value })}
              className={`form-control ${errors.tenPhong ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.tenPhong}</small>
          </div>
          <div className="form-group">
            <label htmlFor="dienTich">Diện tích</label>
            <InputText
              id="dienTich"
              value={selectedData?.dienTich || ''}
              onChange={(e) => setSelectedData({ ...selectedData, dienTich: e.target.value })}
              className={`form-control ${errors.dienTich ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.dienTich}</small>
          </div>
          <div className="form-group">
            <label htmlFor="giaThue">Giá thuê</label>
            <InputText
              id="giaThue"
              value={selectedData?.giaThue || ''}
              onChange={(e) => setSelectedData({ ...selectedData, giaThue: e.target.value })}
              className={`form-control ${errors.giaThue ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.giaThue}</small>
          </div>
          <div className="form-group">
            <label htmlFor="diaChi">Địa chỉ</label>
            <InputText
              id="diaChi"
              value={selectedData?.diaChi || ''}
              onChange={(e) => setSelectedData({ ...selectedData, diaChi: e.target.value })}
              className={`form-control ${errors.diaChi ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.diaChi}</small>
          </div>
        </div>
        <div className="p-mt-4 d-flex justify-content-end">
          <Button label="Hủy" onClick={onHide} className="btn btn-secondary" style={{ marginRight: '10px' }} />
          <Button label="Lưu" onClick={ConfirmSave} className="btn btn-primary" />
        </div>
      </Dialog>
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}

export default TableComponent;

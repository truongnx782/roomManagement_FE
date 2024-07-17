import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../Service/ApiTienIchService';
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
      message: 'Bạn có xác nhận đóng tiện ích?',
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
      message: 'Bạn có xác nhận lưu tiện ích',
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

    if (!selectedData || !selectedData.utilityName || selectedData.utilityName.trim() === '') {
      errors.utilityName = 'Tên tiện ích không được để trống.';
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
        <h2 className="card-title mb-4 text-black d-flex justify-content-center"> QUẢN LÝ TIỆN ÍCH</h2>
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
                <Column field="utilityCode" header="Mã tiện ích" sortable style={{ width: '30%' }}></Column>
                <Column field="utilityCode" header="Tên tiện ích" sortable style={{ width: '30%' }}></Column>
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
                <Column body={action} header="Hành động" sortable style={{ width: '30%' }}></Column>
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
        header={isNew ? 'Thêm tiện ích' : 'Cập nhật tiện ích'}
        style={{ width: '70vw' }}
      >
        <div className="p-fluid">
          <div className="form-group">
            <label htmlFor="utilityCode">Mã tiện ích</label>
            <InputText
              disabled
              id="utilityCode"
              value={selectedData?.utilityCode || ''}
              onChange={(e) => setSelectedData({ ...selectedData, utilityCode: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="utilityName">Tên tiện ích</label>
            <InputText
              id="utilityName"
              value={selectedData?.utilityName || ''}
              onChange={(e) => setSelectedData({ ...selectedData, utilityName: e.target.value })}
              className={`form-control ${errors.utilityName ? 'is-invalid' : ''}`}
            />
            <small className="invalid-feedback">{errors.utilityName}</small>
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

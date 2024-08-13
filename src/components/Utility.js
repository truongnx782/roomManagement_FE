import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../Service/ApiUtilityService';
import SidebarMenu from './SidebarMenu';
import { Table, Button, Input, Modal, Select, Pagination, message, Upload, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, RetweetOutlined, UploadOutlined, DownloadOutlined, DownCircleFilled, ExportOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function TableComponent() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { Option } = Select;

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search, status]);

  const fetchData = async () => {
    try {
      const response = await ApiService.search(page - 1, pageSize, search, status);
      setData(response.content);
      setTotal(response.totalElements);
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const edit = async (id) => {
    try {
      const result = await ApiService.getById(id);
      setSelectedData(result);
      setIsNew(false);
      setModalVisible(true);
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const save = async () => {
    try {
      if (!validate()) {
        return;
      }

      if (isNew) {
        await ApiService.create(selectedData);
        message.success('Thêm mới thành công!');
      } else {
        await ApiService.update(selectedData.id, selectedData);
        message.success('Cập nhật thành công!');
      }

      fetchData();
      setModalVisible(false);
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const remove = async (id) => {
    try {
      await ApiService.delete(id);
      fetchData();
      message.success('Xoá thành công.');
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const restore = async (id) => {
    try {
      await ApiService.restore(id);
      fetchData();
      message.success('Khôi phục thành công.');
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };


  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await ApiService.upload(formData);
      message.success('Tải lên thành công.');
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
    finally{
      fetchData();
  }
  };

  const downloadTemplate = async () => {
    try {
      const blob = await ApiService.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.xlsx'; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      message.success('Tải về thành công.');
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const exportData = async () => {
    try {
      const blob = await ApiService.exportData(page - 1, pageSize, search, status);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      message.success('Tải về thành công.');
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn đóng tiện ích này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => remove(id),
    });
  };

  const confirmRestore = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn khôi phục tiện ích này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => restore(id),
    });
  };

  const confirmSave = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin tiện ích này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => save(),
    });
  };

  const onHide = () => {
    setModalVisible(false);
    setSelectedData(null);
    setIsNew(false);
    setErrors({});
  };

  const openNew = () => {
    setSelectedData(null);
    setModalVisible(true);
    setIsNew(true);
  };

  const handleInputChange = (field) => (e) => {
    setSelectedData((prev) => ({ ...prev, [field]: e.target.value }));
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

  const columns = [
    {
      title: 'Mã tiện ích',
      dataIndex: 'utilityCode',
      key: 'utilityCode',
      sorter: (a, b) => a.utilityCode.localeCompare(b.utilityCode),
      width: '14%',
    },
    {
      title: 'Tên tiện ích',
      dataIndex: 'utilityName',
      key: 'utilityName',
      sorter: (a, b) => a.utilityName.localeCompare(b.utilityName),
      width: '14%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status - b.status,
      render: (value) => (
        <span
          style={{
            color: value === 1 ? 'green' : 'red',
            backgroundColor: value === 1 ? '#e6ffe6' : '#ffe6e6',
            border: value === 1 ? '1px solid green' : '1px solid red',
            borderRadius: '4px',
            padding: '2px 8px',
          }}
        >
          {value === 1 ? 'Hoạt động' : 'Ngưng hoạt động'}
        </span>
      ),
      width: '14%',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (value) => (  
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => edit(value.id)}
            style={{ marginRight: 10 }}>
          </Button>

          {value.status === 0 ? (
            <Button
              icon={<RetweetOutlined />}
              style={{ color: 'blue', borderColor: 'blue' }}
              onClick={() => confirmRestore(value.id)}>
            </Button>
          ) : (
            <Button
              icon={<DeleteOutlined />}
              onClick={() => confirmDelete(value.id)}
              danger >
            </Button>
          )}
        </div>
      ),
      width: '15%',
    },
  ];

  const items = [
    {
      key: '1',
      label: (
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept=".xlsx, .xls"
        >
          <Button icon={<UploadOutlined />} type="primary">
            Import Excel
          </Button>
        </Upload>
      ),
    },
    {
      key: '2',
      label: (
        <Button icon={<ExportOutlined />} onClick={exportData}>
          Export
        </Button>
      ),
    },
    {
      key: '3',
      label: (
        <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
          Template
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '15%' }}>
        <SidebarMenu />
      </div>
      <div style={{ marginLeft: '15%', width: '85%', padding: '16px' }}>
        <div className="card shadow-sm card-body p-2 mb-3 mt-2" style={{ height: '7vh', width: '100%', display: 'flex' }}>
          <div>
            <p style={{ display: 'inline-block', margin: 0 }}>Quản lý danh mục/ </p>
            <h6 style={{ display: 'inline-block', margin: 1 }}> Danh tiện ích</h6>
          </div>
        </div>
        <div className="card shadow-sm card-body ">
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Button
                type="primary"
                onClick={openNew}>
                Thêm mới tiện ích
              </Button>
              <Input
                placeholder="Tìm kiếm..."
                style={{ width: 200, marginLeft: 20 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: 200, marginLeft: 20 }}
                value={status}
                onChange={setStatus}
              >
                <Option value={null}>Tất cả</Option>
                <Option value={1}>Hoạt động</Option>
                <Option value={0}>Ngưng hoạt động</Option>
              </Select>
            </div>

            <Dropdown
              menu={{ items }}
              placement="bottom"
              arrow>
              <DownCircleFilled style={{ fontSize: '30px', color:'blue' }} />
            </Dropdown>

          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            scroll={{ y: 'calc(100vh - 39vh)' }}
            className='table responsive'
          />
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            pageSizeOptions={['10', '20', '50']}
            onChange={(page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          />

          <Modal
            title={isNew ? 'Thêm mới tiện ích' : 'Chỉnh sửa tiện ích'}
            open={modalVisible}
            onCancel={onHide}
            width="40vw"
            footer={[
              <Button key="back" onClick={onHide}>Hủy</Button>,
              <Button key="submit" type="primary" onClick={confirmSave}>
                Lưu
              </Button>,
            ]}
          >
            <form>
              <div className="row">
                <label>Tên tiện ích</label>
                <Input
                  value={selectedData?.utilityName || ''}
                  onChange={handleInputChange('utilityName')}
                  style={{ borderColor: errors.utilityName ? 'red' : '' }}
                />
                {errors.utilityName && <div style={{ color: 'red' }}>{errors.utilityName}</div>}
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;

import React, { useState, useEffect } from 'react';
import ApiService from '../Service/ApiServiceService';
import SidebarMenu from './SidebarMenu';
import { Table, Button, Input, Modal, Select, Pagination, message } from 'antd';
import { EditOutlined, DeleteOutlined ,RetweetOutlined} from '@ant-design/icons';
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
      console.error('Error fetching data:', error);
    }
  };

  const edit = async (id) => {
    try {
      const result = await ApiService.getById(id);
      setSelectedData(result);
      setIsNew(false);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching details for edit:', error);
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
      console.error('Error saving data:', error);
    } 
  };

  const remove = async (id) => {
    try {
      await ApiService.delete(id);
      fetchData();
      message.success('Xoá thành công.');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const restore = async (id) => {
    try {
      await ApiService.restore(id);
      fetchData();
      message.success('Khôi phục thành công.');
    } catch (error) {
      console.error('Error restore data:', error);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn xoá dịch vụ này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => remove(id),
    });
  };

  const confirmRestore = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn khôi phục dịch vụ này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => restore(id),
    });
  };

  const confirmSave = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin dịch vụ này?',
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
    } else {
      const startDate = new Date(selectedData.startDate);
      // const today = new Date();
      // if (startDate < today) {
      //   errors.startDate = 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại.';
      //   isValid = false;
      // }
      if (selectedData.endDate) {
        const endDate = new Date(selectedData.endDate);
        if (endDate < startDate) {
          errors.endDate = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.';
          isValid = false;
        }
      }
    }

    setErrors(errors);
    return isValid;
  };

  const columns = [
    {
      title: 'Mã dịch vụ',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      sorter: (a, b) => a.serviceCode.localeCompare(b.serviceCode),
      width: '14%',
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName),
      width: '14%',
    },
    {
      title: 'Giá dịch vụ',
      key: 'servicePrice',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value.servicePrice),
      sorter: (a, b) => a.servicePrice - b.servicePrice,
      width: '14%',
    },

    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => a.startDate - b.startDate,
      width: '14%',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => a.endDate - b.endDate,
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
              onClick={() => confirmRestore(value.id)}  
              style={{ color  : 'blue', borderColor:'blue' }}>
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

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '15%' }}>
        <SidebarMenu />
      </div>
      <div style={{ marginLeft: '15%', width: '85%', padding: '16px' }}>
        <div className="card shadow-sm card-body p-2 mb-3 mt-2" style={{ height: '7vh', width: '100%', display: 'flex' }}>
          <div>
            <p style={{ display: 'inline-block', margin: 0 }}>Quản lý danh mục/ </p>
            <h6 style={{ display: 'inline-block', margin: 1 }}> Danh dịch vụ</h6>
          </div>
        </div>
        <div className="card shadow-sm card-body ">
          <div style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              onClick={openNew}>
              Thêm mới dịch vụ
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
            title={isNew ? 'Thêm mới dịch vụ' : 'Chỉnh sửa dịch vụ'}
            open={modalVisible}
            onCancel={onHide}
            width="70vw"
            footer={[
              <Button key="back" onClick={onHide}>Hủy</Button>,
              <Button key="submit" type="primary" onClick={confirmSave}>
                Lưu
              </Button>,
            ]}
          >
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Tên dịch vụ</label>
                  <Input
                    value={selectedData?.serviceName || ''}
                    onChange={handleInputChange('serviceName')}
                    style={{ borderColor: errors.serviceName ? 'red' : '' }}
                  />
                  {errors.serviceName && <div style={{ color: 'red' }}>{errors.serviceName}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Giá dịch vụ</label>
                  <Input
                    type="number"
                    value={selectedData?.servicePrice || ''}
                    onChange={handleInputChange('servicePrice')}
                    style={{ borderColor: errors.servicePrice ? 'red' : '' }}
                  />
                  {errors.servicePrice && <div style={{ color: 'red' }}>{errors.servicePrice}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Ngày bắt đầu</label>
                  <Input
                    type="date"
                    value={selectedData?.startDate || ''}
                    onChange={handleInputChange('startDate')}
                    style={{ borderColor: errors.startDate ? 'red' : '' }}
                  />
                  {errors.startDate && <div style={{ color: 'red' }}>{errors.startDate}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Ngày kết thúc</label>
                  <Input
                    type='date'
                    value={selectedData?.endDate || ''}
                    onChange={handleInputChange('endDate')}
                    style={{ borderColor: errors.address ? 'red' : '' }}
                  />
                  {errors.endDate && <div style={{ color: 'red' }}>{errors.endDate}</div>}
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;

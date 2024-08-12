import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../Service/ApiContractService';
import ApiRoomService from '../Service/ApiRoomService';
import ApiCustomerService from '../Service/ApiCustomerService'
import SidebarMenu from './SidebarMenu';
import { Table, Button, Input, Modal, Select, Pagination, message } from 'antd';
import { EditOutlined, DeleteOutlined, RetweetOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function TableComponent() {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([])
  const [customers, setCustomers] = useState([])
  const [selectedData, setSelectedData] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorsCustomer, setErrorsCustomer] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(false);
  const { Option } = Select;
  const { TextArea } = Input;


  const fetchDataRef = useRef(false);
  useEffect(() => {
    if (!fetchDataRef.current) {
      fetchDataRef.current = true;
      fetchData();
      fetchRooms();
      fetchCustomers();
    }
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
  
  const fetchRooms = async () => {
    try {
      const response = await ApiRoomService.getAll();
      setRooms(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await ApiCustomerService.getAll();
      setCustomers(response);
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
        const result = await ApiService.update(selectedData.id, selectedData);
        if (result === false) {
          message.error('Không được phép cập nhật!');
        } else {
          message.success('Cập nhật thành công!');
          fetchData();
        }
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
      message.success('Đóng thành công.');
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
      content: 'Bạn có chắc chắn muốn đóng hợp đồng này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => remove(id),
    });
  };

  const confirmRestore = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn khôi phục hợp đồng này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => restore(id),
    });
  };

  const confirmSave = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin hợp đồng này?',
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

    if (!selectedData || !selectedData.room) {
      errors.room = 'Phòng không được để trống.';
      isValid = false;
    }

    if (!selectedData || !selectedData.customerIds) {
      errors.customerIds = 'Khách hàng không được để trống.';
      isValid = false;
    }

    if (!selectedData || !selectedData.startDate) {
      errors.startDate = 'Ngày bắt đầu không được để trống.';
      isValid = false;
    } else {
      const startDate = new Date(selectedData.startDate);
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



  // CUSTOMER
  const confirmSaveCustomer = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin khách hàng này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => saveCustomer(),
    });
  };

  const saveCustomer = async () => {
    try {
      if (!validateCustomer()) {
        return;
      }
      await ApiCustomerService.create(dataCustomer);
      message.success('Thêm mới thành công!');
      fetchCustomers();

      setModalCustomer(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const validateCustomer = () => {
    let isValid = true;
    const errors = {};

    if (!dataCustomer || !dataCustomer.customerName || dataCustomer.customerName.trim() === '') {
      errors.customerName = 'Tên khách hàng không được để trống.';
      isValid = false;
    }
    if (!dataCustomer || !dataCustomer.identityNumber || dataCustomer.identityNumber.trim() === '') {
      errors.identityNumber = 'CCCD không được để trống.';
      isValid = false;
    }
    if (!dataCustomer || !dataCustomer.phoneNumber || dataCustomer.phoneNumber.trim() === '') {
      errors.phoneNumber = 'SDT không được để trống.';
      isValid = false;
    }
    if (!dataCustomer || !dataCustomer.birthdate) {
      errors.birthdate = 'Ngày sinh không được để trống.';
      isValid = false;
    } else {
      const birthdate = new Date(dataCustomer.birthdate);
      const today = new Date();
      if (birthdate > today) {
        errors.birthdate = 'Ngày sinh không được lớn hơn ngày hiện tại.';
        isValid = false;
      }
    }
    setErrorsCustomer(errors);
    return isValid;
  };

  const onHideCustomer = () => {
    setModalCustomer(false);
    setDataCustomer(null)
    setErrorsCustomer({});
  };

  const openNewCustomer = () => {
    setModalCustomer(true);
  };
  //////////


  const columns = [
    {
      title: 'Mã Hợp đồng',
      dataIndex: 'contractCode',
      key: 'contractCode',
      sorter: (a, b) => a.contractCode.localeCompare(b.contractCode),
      width: '14%',
    },
    {
      title: 'Mã Phòng',
      dataIndex: ['room', 'roomCode'], // Sử dụng mảng để chỉ định thuộc tính lồng nhau
      key: 'room.roomCode',
      sorter: (a, b) => a.room.roomCode.localeCompare(b.room.roomCode),
      width: '14%',
    },

    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
      width: '14%',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => a.endDate.localeCompare(b.endDate),
      width: '14%',
    },
    {
      title: 'Giá thuê',
      key: 'rentPrice',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value.rentPrice),
      sorter: (a, b) => a.rentPrice.localeCompare(b.rentPrice),
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
      render: (value) => (  //value 
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

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '15%' }}>
        <SidebarMenu />
      </div>
      <div style={{ marginLeft: '15%', width: '85%', padding: '16px' }}>
        <div className="card shadow-sm card-body p-2 mb-3 mt-2" style={{ height: '7vh', width: '100%', display: 'flex' }}>
          <div>
            <p style={{ display: 'inline-block', margin: 0 }}>Quản lý danh mục/ </p>
            <h6 style={{ display: 'inline-block', margin: 1 }}> Danh sách hợp đồng</h6>
          </div>
        </div>
        <div className="card shadow-sm card-body ">
          <div style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              onClick={openNew}>
              Thêm mới hợp đồng
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
            title={isNew ? 'Thêm mới hợp đồng' : 'Chỉnh sửa hợp đồng'}
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
                    type="date"
                    value={selectedData?.endDate || ''}
                    onChange={handleInputChange('endDate')}
                    style={{ borderColor: errors.endDate ? 'red' : '' }}
                  />
                  {errors.endDate && <div style={{ color: 'red' }}>{errors.endDate}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Phòng</label>
                  <Select
                    id="room"
                    value={selectedData?.room?.id || ''}
                    onChange={(value) => setSelectedData({ ...selectedData, room: { id: value } })}
                    style={{ width: '100%' }}
                    placeholder="Chọn phòng"
                    className={errors.room ? 'is-invalid' : ''}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {rooms
                      .filter(option => (option.status === 1 || option.id === selectedData?.room?.id) && (!isNew || option.rentStatus ===0))
                      .map(room => (
                        <Option key={room.id} value={room.id}>
                          {room.roomCode + ' - ' + room.roomName}
                        </Option>
                      ))}
                  </Select>
                  {errors.room && <div style={{ color: 'red' }}>{errors.room}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <div className='d-flex justify-content-between'>
                    <label>Khách hàng</label>
                    <Button
                      size="small"
                      type="primary"
                      onClick={openNewCustomer}>
                      +
                    </Button>
                  </div>
                  <Select
                    id="customers"
                    value={selectedData?.customerIds || []}
                    onChange={(value) => setSelectedData({ ...selectedData, customerIds: value })}
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder="Chọn khách hàng"
                    className={errors.customerIds ? 'is-invalid' : ''}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {customers
                      .filter(option => option.status === 1 || selectedData?.customerIds?.includes(option.id))
                      .map(customer => (
                        <Option key={customer.id} value={customer.id}>
                          {customer.customerName + ' - ' + customer.phoneNumber}
                        </Option>
                      ))}
                  </Select>
                  {<div style={{ color: 'red' }}>{errors.customerIds}</div>}
                </div>

                <div>
                  <label>Điều khoản</label>
                  <TextArea
                    value={selectedData?.terms || ''}
                    onChange={handleInputChange('terms')}
                  />
                  {errors.terms && <div style={{ color: 'red' }}>{errors.terms}</div>}
                </div>


              </div>
            </form>
          </Modal>


          <Modal
            title={'Thêm mới khách hàng'}
            open={modalCustomer}
            onCancel={onHideCustomer}
            width="40vw"
            footer={[
              <Button key="back" onClick={onHideCustomer}>Hủy</Button>,
              <Button key="submit" type="primary" onClick={confirmSaveCustomer}>
                Lưu
              </Button>
            ]}
          >
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Tên khách hàng</label>
                  <Input
                    value={dataCustomer?.customerName || ''}
                    onChange={(e) => setDataCustomer({ ...dataCustomer, customerName: e.target.value })}
                    style={{ borderColor: errorsCustomer.customerName ? 'red' : '' }}
                  />
                  <div style={{ color: 'red' }}>{errorsCustomer.customerName}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Số CCCD</label>
                  <Input
                    type="number"
                    value={dataCustomer?.identityNumber || ''}
                    onChange={(e) => setDataCustomer({ ...dataCustomer, identityNumber: e.target.value })}
                    style={{ borderColor: errorsCustomer.identityNumber ? 'red' : '' }}
                  />
                  <div style={{ color: 'red' }}>{errorsCustomer.identityNumber}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Số điện thoại</label>
                  <Input
                    type='number'
                    value={dataCustomer?.phoneNumber || ''}
                    onChange={(e) => setDataCustomer({ ...dataCustomer, phoneNumber: e.target.value })}
                    style={{ borderColor: errorsCustomer.phoneNumber ? 'red' : '' }}
                  />
                  <div style={{ color: 'red' }}>{errorsCustomer.phoneNumber}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Ngày sinh</label>
                  <Input
                    type='date'
                    value={dataCustomer?.birthdate || ''}
                    onChange={(e) => setDataCustomer({ ...dataCustomer, birthdate: e.target.value })}
                    style={{ borderColor: errorsCustomer.birthdate ? 'red' : '' }}
                  />
                  <div style={{ color: 'red' }}>{errorsCustomer.birthdate}</div>
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

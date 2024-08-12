import React, { useState, useEffect ,useRef} from 'react';
import ApiService from '../Service/ApiMaintenanceService';
import ApiRoomService from '../Service/ApiRoomService';

import SidebarMenu from './SidebarMenu';
import { Table, Button, Input, Modal, Select, Pagination, message } from 'antd';
import { EditOutlined, DeleteOutlined ,RetweetOutlined} from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';


function TableComponent() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [rooms, setRooms] = useState([])
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { Option } = Select;

  const fetchDataRef = useRef(false);
  useEffect(() => {
    if (!fetchDataRef.current) {
      fetchDataRef.current = true;
      fetchData();
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
      content: 'Bạn có chắc chắn muốn đóng bảo trì ?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => remove(id),
    });
  };

  const confirmRestore = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn khôi phục bảo trì này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => restore(id),
    });
  };

  const confirmSave = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin bảo trì này?',
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

    if (!selectedData || !selectedData.maintenanceRequest || selectedData.maintenanceRequest.trim() === '') {
      errors.maintenanceRequest = 'Yêu cầu không được để trống.';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const columns = [
    {
      title: 'Mã Phòng',
      dataIndex: ['room','roomCode'],
      key: 'roomCode',
      sorter: (a, b) => a.roomCode.localeCompare(b.roomCode),
      width: '18%',
    },
    {
      title: 'Yêu cầu',
      dataIndex: 'maintenanceRequest',
      key: 'maintenanceRequest',
      sorter: (a, b) => a.maintenanceRequest.localeCompare(b.maintenanceRequest),
      width: '45%',
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
      width: '18%',
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
              style={{ color  : 'blue', borderColor:'blue' }}
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
      width: '18%',
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
            <h6 style={{ display: 'inline-block', margin: 1 }}> Danh sách bảo trì</h6>
          </div>
        </div>
        <div className="card shadow-sm card-body ">
          <div style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              onClick={openNew}>
              Thêm mới bảo trì
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
            title={isNew ? 'Thêm mới tiện ích' : 'Chỉnh sửa tiện ích'}
            open={modalVisible}
            onCancel={onHide}
            width="40vw"
            footer={[
              <Button key="back" onClick={onHide}>Hủy</Button>,
              <Button key="submit" type="primary"  onClick={confirmSave}>
                Lưu
              </Button>,
            ]}
          >
            <form>
              <div >
                <label>Yêu cầu bảo trì</label>
                <Input
                  value={selectedData?.maintenanceRequest || ''}
                  onChange={handleInputChange('maintenanceRequest')}
                  style={{ borderColor: errors.maintenanceRequest ? 'red' : '' }}
                />
                {errors.maintenanceRequest && <div style={{ color: 'red' }}>{errors.maintenanceRequest}</div>}
              </div>
              <div>
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
                      .filter(option => (option.status === 1 || option.id === selectedData?.room?.id) )
                      .map(room => (
                        <Option key={room.id} value={room.id}>
                          {room.roomCode + ' - ' + room.roomName}
                        </Option>
                      ))}
                  </Select>
                  {errors.room && <div style={{ color: 'red' }}>{errors.room}</div>}
                </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;

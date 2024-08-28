import React, { useState, useEffect } from 'react';
import ApiService from '../Service/ApiRoomService';
import ApiTienIchService from '../Service/ApiUtilityService';
import ApiPhong_TienIchService from '../Service/ApiRoom_UtilityService';
import ApiImageService from '../Service/ApiImageSercice';
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [utilitys, setUtilitys] = useState([]);
  const [selectedUtility, setSelectedUtility] = useState([]);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { Option } = Select;

  useEffect(() => {
    fetchListUtility();
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

  const fetchListUtility = async () => {
    try {
      const response = await ApiTienIchService.getAll();
      setUtilitys(response);
    } catch (error) {
      console.error('Error:', error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const edit = async (id) => {
    try {
      const result = await ApiService.getById(id);
      const Room_Utility = await ApiPhong_TienIchService.getUtilityIdByRoomId(id);
      const Images = await ApiImageService.getAllByRoomId(id);
      setFetchedImages(Images);
      setSelectedImages([]);
      setSelectedUtility(Room_Utility);
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
        const createdData = await ApiService.create(selectedData);
        const roomId = createdData.id;

        // Handle utilities
        await ApiPhong_TienIchService.create({ room: roomId, utilitys: selectedUtility, status: 1 });

        //create image
        const formData = new FormData();
        formData.append('room', roomId);
        formData.append('status', 1);
        selectedImages.forEach((image) => {
          formData.append('file', image);
        });
        await ApiImageService.create(formData);

        message.success('Thêm mới thành công!');
      } else {
        // Update room
        await ApiService.update(selectedData.id, selectedData);

        // Update utilities
        const roomId = selectedData.id;
        await ApiPhong_TienIchService.update({ room: roomId, utilitys: selectedUtility, status: 1 });

        //create image
        const formData = new FormData();
        formData.append('room', roomId);
        formData.append('status', 1);
        selectedImages.forEach((image) => {
          formData.append('file', image);
        });

        fetchedImages.forEach((image) => {
          formData.append('image', image.id)
        })
        await ApiImageService.create(formData);

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
      content: 'Bạn có chắc chắn muốn xoá phòng này?',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => remove(id),
    });
  };

  const confirmRestore = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn khôi phục phòng này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => restore(id),
    });
  };

  const confirmSave = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin phòng này?',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: () => save(),
    });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const totalImages = fetchedImages.length + selectedImages.length + files.length;

    if (totalImages > 10) {
      alert(`You can only upload up to 10 images. Currently, you have ${fetchedImages.length + selectedImages.length} images and trying to add ${files.length} more.`);
      return;
    }

    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveImagefetched = (imageId) => {
    const updatedImages = fetchedImages.filter(image => image.id !== imageId);
    setFetchedImages(updatedImages);
  };

  const onHide = () => {
    setSelectedUtility([]);
    setSelectedImages([]);
    setFetchedImages([]);
    setModalVisible(false);
    setSelectedData(null);
    setIsNew(false);
    setErrors({});
  };

  const openNew = () => {
    setSelectedData(null);
    setSelectedUtility([]);
    setSelectedImages([]);
    setFetchedImages([]);
    setModalVisible(true);
    setIsNew(true);
  };

  const handleInputChange = (field) => (e) => {
    setSelectedData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    let isValid = true;
    const errors = {};

    if (!selectedData?.roomName?.trim()) {
      errors.roomName = 'Tên phòng không được để trống.';
      isValid = false;
    }

    if (!selectedData?.area?.trim()) {
      errors.area = 'Diện tích không được để trống.';
      isValid = false;
    }

    if (!selectedData?.rentPrice || isNaN(selectedData.rentPrice) || selectedData.rentPrice < 0) {
      errors.rentPrice = 'Giá thuê không hợp lệ.';
      isValid = false;
    }

    if (!selectedData?.address?.trim()) {
      errors.address = 'Địa chỉ không được để trống.';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const columns = [
    {
      title: 'Mã Phòng',
      dataIndex: 'roomCode',
      key: 'roomCode',
      sorter: (a, b) => a.roomCode.localeCompare(b.roomCode),
      width: '12%',
    },
    {
      title: 'Tên phòng',
      dataIndex: 'roomName',
      key: 'roomName',
      sorter: (a, b) => a.roomName.localeCompare(b.roomName),
      width: '12%',
    },
    {
      title: 'Diện tích',
      dataIndex: 'area',
      key: 'area',
      sorter: (a, b) => a.area - b.area,
      width: '12%',
    },
    {
      title: 'Giá thuê',
      key: 'rentPrice',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value.rentPrice),
      sorter: (a, b) => a.rentPrice - b.rentPrice,
      width: '12%',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.localeCompare(b.address),
      width: '12%',
    },
    {
      title: 'Trạng thái thuê',
      dataIndex: 'rentStatus',
      key: 'rentStatus',
      sorter: (a, b) => a.rentStatus - b.rentStatus,
      render: (value) => (
        <span
          style={{
            color:
              value === 0 ? 'orange' :
                value === 1 ? 'deepskyblue' : 'inherit',
            backgroundColor:
              value === 0 ? '#f5f5f5' :
                value === 1 ? '#e6f7ff' : 'inherit',
            border:
              value === 0 ? '1px solid orange' :
                value === 1 ? '1px solid deepskyblue' : '1px solid gray',
            borderRadius: '4px',
            padding: '2px 8px',
          }}
        >
          {value === 0 ? 'Trống' : value === 1 ? 'Đã thuê' : 'Không xác định'}
        </span>
      ),
      width: '15%',
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
      width: '15%',
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
              onClick={() => confirmRestore(value.id)}  >
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
      width: '10%',
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
            <h6 style={{ display: 'inline-block', margin: 1 }}> Danh sách phòng</h6>
          </div>
        </div>
        <div className="card shadow-sm card-body ">
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Button
                type="primary"
                onClick={openNew}>
                Thêm mới phòng
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
              <DownCircleFilled style={{ fontSize: '30px', color: 'blue' }} />
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
            title={isNew ? 'Thêm mới phòng' : 'Chỉnh sửa phòng'}
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
                  <label>Tên phòng</label>
                  <Input
                    value={selectedData?.roomName || ''}
                    onChange={handleInputChange('roomName')}
                    style={{ borderColor: errors.roomName ? 'red' : '' }}
                  />
                  {errors.roomName && <div style={{ color: 'red' }}>{errors.roomName}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Diện tích</label>
                  <Input
                    value={selectedData?.area || ''}
                    onChange={handleInputChange('area')}
                    style={{ borderColor: errors.area ? 'red' : '' }}
                  />
                  {errors.area && <div style={{ color: 'red' }}>{errors.area}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Giá thuê</label>
                  <Input
                    type="number"
                    value={selectedData?.rentPrice || ''}
                    onChange={handleInputChange('rentPrice')}
                    style={{ borderColor: errors.rentPrice ? 'red' : '' }}
                  />
                  {errors.rentPrice && <div style={{ color: 'red' }}>{errors.rentPrice}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Địa chỉ</label>
                  <Input
                    value={selectedData?.address || ''}
                    onChange={handleInputChange('address')}
                    style={{ borderColor: errors.address ? 'red' : '' }}
                  />
                  {errors.address && <div style={{ color: 'red' }}>{errors.address}</div>}
                </div>
              </div>

              <div>
                <label htmlFor="utilities">Tiện ích</label>
                <Select
                  id="utilities"
                  mode="multiple"
                  value={selectedUtility}
                  onChange={setSelectedUtility}
                  style={{ width: '100%' }}
                  placeholder="Chọn tiện ích"
                  className={errors.utilities ? 'is-invalid' : ''}
                  showSearch

                  // Cho phép tìm kiếm theo trường được hiển thị của option
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {utilitys
                    .filter(option => option.status === 1 || selectedUtility.includes(option.id))
                    .map(utility => (
                      <Option key={utility.id} value={utility.id}>
                        {utility.utilityName}
                      </Option>
                    ))}
                </Select>
              </div>

              <div style={{ marginTop: 10 }}>
                <label>Hình ảnh</label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
                <div className="image-preview mt-2 d-flex">
                  {/* Render fetched images */}
                  {fetchedImages.map((imageData) => (
                    <div key={imageData.id} className="position-relative">
                      <a href={imageData.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={imageData.url}
                          alt={`fetched ${imageData.id}`}
                          className="image-thumbnail"
                          style={{
                            width: '110px',
                            height: '110px',
                            objectFit: 'cover',
                            marginRight: '5px',
                            border: '2px solid #4CAF50',
                            borderRadius: '2px',
                          }}
                        />
                      </a>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute"
                        style={{ top: '5px', right: '5px' }}
                        onClick={() => handleRemoveImagefetched(imageData.id)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  {/* Render selected images */}
                  {selectedImages.map((image, index) => (
                    <div key={index} className="position-relative">
                      <a href={URL.createObjectURL(image)} target="_blank" rel="noopener noreferrer">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview ${index}`}
                          className="image-thumbnail"
                          style={{
                            width: '110px',
                            height: '110px',
                            objectFit: 'cover',
                            marginRight: '5px',
                            border: '2px solid #ffd700',
                            borderRadius: '2px',
                          }}
                        />
                      </a>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute"
                        style={{ top: '5px', right: '5px' }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
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

import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../Service/ApiCustomerService.js';
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
            content: 'Bạn có chắc chắn muốn đóng khách hàng này này?',
            okText: 'Xác nhận',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: () => remove(id),
        });
    };

    const confirmRestore = (id) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn khôi phục khách hàng này này?',
            okText: 'Xác nhận',
            okType: 'primary',
            cancelText: 'Huỷ',
            onOk: () => restore(id),
        });
    };

    const confirmSave = () => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn lưu thông tin khách hàng này này?',
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

        if (!selectedData || !selectedData.customerName || selectedData.customerName.trim() === '') {
            errors.customerName = 'Tên khách hàng không được để trống.';
            isValid = false;
        }
        if (!selectedData || !selectedData.identityNumber || selectedData.identityNumber.trim() === '') {
            errors.identityNumber = 'CCCD không được để trống.';
            isValid = false;
        }
        if (!selectedData || !selectedData.phoneNumber || selectedData.phoneNumber.trim() === '') {
            errors.phoneNumber = 'SDT không được để trống.';
            isValid = false;
        }
        if (!selectedData || !selectedData.birthdate) {
            errors.birthdate = 'Ngày sinh không được để trống.';
            isValid = false;
        } else {
            const birthdate = new Date(selectedData.birthdate);
            const today = new Date();
            if (birthdate > today) {
                errors.birthdate = 'Ngày sinh không được lớn hơn ngày hiện tại.';
                isValid = false;
            }
        }
        setErrors(errors);
        return isValid;
    };

    const columns = [
        {
            title: 'Mã Khách hàng',
            dataIndex: 'customerCode',
            key: 'customerCode',
            sorter: (a, b) => a.customerCode.localeCompare(b.customerCode),
            width: '16%',
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            width: '18%',
        },
        {
            title: 'SDT',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
            width: '16%',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthdate',
            key: 'birthdate',
            sorter: (a, b) => a.birthdate.localeCompare(b.birthdate),
            width: '16%',
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
            width: '16%',
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
            width: '16%',
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
                        <h6 style={{ display: 'inline-block', margin: 1 }}> Danh sách khách hàng</h6>
                    </div>
                </div>
                <div className="card shadow-sm card-body ">
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Button
                                type="primary"
                                onClick={openNew}>
                                Thêm mới khách hàng
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
                        title={isNew ? 'Thêm mới khách hàng' : 'Chỉnh sửa khách hàng'}
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
                                <div className="col-md-6 mb-3">
                                    <label>Tên khách hàng</label>
                                    <Input
                                        value={selectedData?.customerName || ''}
                                        onChange={handleInputChange('customerName')}
                                        style={{ borderColor: errors.customerName ? 'red' : '' }}
                                    />
                                    {errors.customerName && <div style={{ color: 'red' }}>{errors.customerName}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Số CCCD</label>
                                    <Input
                                        type="number"
                                        value={selectedData?.identityNumber || ''}
                                        onChange={handleInputChange('identityNumber')}
                                        style={{ borderColor: errors.identityNumber ? 'red' : '' }}
                                    />
                                    {errors.identityNumber && <div style={{ color: 'red' }}>{errors.identityNumber}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Số điện thoại</label>
                                    <Input
                                        value={selectedData?.phoneNumber || ''}
                                        onChange={handleInputChange('phoneNumber')}
                                        style={{ borderColor: errors.phoneNumber ? 'red' : '' }}
                                    />
                                    {errors.phoneNumber && <div style={{ color: 'red' }}>{errors.phoneNumber}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Ngày sinh</label>
                                    <Input
                                        type='date'
                                        value={selectedData?.birthdate || ''}
                                        onChange={handleInputChange('birthdate')}
                                        style={{ borderColor: errors.birthdate ? 'red' : '' }}
                                    />
                                    {errors.birthdate && <div style={{ color: 'red' }}>{errors.birthdate}</div>}
                                </div>

                            </div>
                        </form>
                    </Modal>
                </div>
            </div>
        </div >
    );
}

export default TableComponent;

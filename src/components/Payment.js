import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../Service/ApiPaymentService.js';
import ApiServiceService from '../Service/ApiServiceService.js';
import ApiPaymentDetailService from '../Service/ApiPaymentDetailService.js';

import SidebarMenu from './SidebarMenu';
import { Table, Button, Input, Modal, Select, Pagination, message } from 'antd'
import { Space, Switch } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

function TableComponent() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [isNew, setIsNew] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [service, setService] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { Option } = Select;

    useEffect(() => {
        fetchData();
        fetchService();
    }, [page, pageSize, search, paymentStatus]);

    const fetchData = async () => {
        try {
            const response = await ApiService.search(page - 1, pageSize, search, paymentStatus);
            setData(response.content);
            setTotal(response.totalElements);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchService = async () => {
        try {
            const response = await ApiServiceService.getAll();
            setService(response);
        } catch (error) {
            console.error('Error fetching utilities:', error);
        }
    };

    const detail = async (id) => {
        try {
            const result = await ApiPaymentDetailService.getByPaymentId(id);
            setSelectedData(result);
            setShowForm(true);
            if (result?.ids.length > 0) {
                setIsNew(false)
            }
            else {
                setIsNew(true)
            }
        } catch (error) {
            console.error('Error fetching details for edit:', error);
        }
    };

    const save = async () => {
        try {
            await ApiPaymentDetailService.create(selectedData);
            message.success('Lưu thành công!');
            fetchData();
            setShowForm(false);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleStatusChange = async (id, checked) => {
        try {
            await ApiService.updatePaymentStatus(id, checked ? 1 : 0);
            message.success('Cập nhật trạng thái thành công!');
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Cập nhật trạng thái thất bại!');
        }
    };

    const confirmSave = () => {
        console.log(data)
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn lưu thông tin thanh toán này này?',
            okText: 'Xác nhận',
            okType: 'primary',
            cancelText: 'Huỷ',
            onOk: () => save(),
        });
    };

    const confimStatusChange = (id, checked) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn chuyển trạng thái?',
            okText: 'Xác nhận',
            okType: 'primary',
            cancelText: 'Huỷ',
            onOk: () => handleStatusChange(id, checked),
        });
    };

    const columns = [
        {
            title: 'Mã TT',
            key: 'detail',
            sorter: (a, b) => a.paymentCode.localeCompare(b.paymentCode),
            width: '20%',
            render: (record) => (
                <Button type="link" onClick={() => detail(record.id)}>
                    {record.paymentCode}
                </Button>
            ),
        },

        {
            title: 'Mã HD',
            dataIndex: ['contract', 'contractCode'],
            key: 'contractCode',
            sorter: (a, b) => a.paymentCode.localeCompare(b.contractCode),
            width: '20%',
        },
        {
            title: 'Phòng',
            key: 'roomInfo',
            render: (value) => `${value.contract.room.roomCode} - ${value.contract.room.roomName}`,
            sorter: (a, b) => a.value.contract.room.roomCode.localeCompare(b.value.contract.room.roomCode),
            width: '20%',
        },
        {
            title: 'Giá phòng',
            key: 'rentPrice',
            render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value.contract.rentPrice),
            sorter: (a, b) => a.value.contract.rentPrice.localeCompare(b.value.contract.rentPrice),
            width: '20%',
        },
        {
            title: 'Hạn',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            sorter: (a, b) => a.paymentDate.localeCompare(b.paymentDate),
            width: '14%',
        },
        {
            title: 'Trạng thái',
            key: 'action',
            sorter: (a, b) => a.paymentStatus - b.paymentStatus,
            render: (value) => (
                <Space>
                    <Switch
                        checked={value.paymentStatus === 1}
                        onChange={(checked) => confimStatusChange(value.id, checked)}
                        checkedChildren="Đã TT"
                        unCheckedChildren="Chưa TT"
                    />
                </Space>
            ),
            width: '20%'
        }
    ];

    return (
        <div style={{ width: '100%' }}>
            <div style={{ width: '15%' }}>
                <SidebarMenu />
            </div>
            <div style={{ marginLeft: '15%', width: '85%', padding: '16px', display: 'flex' }}>
                <div style={{ width: '70%', paddingRight: '8px' }}>
                    <div className="card shadow-sm card-body p-2 mb-3 mt-2" style={{ height: '7vh', width: '100%', display: 'flex' }}>
                        <div>
                            <p style={{ display: 'inline-block', margin: 0 }}>Quản lý danh mục/ </p>
                            <h6 style={{ display: 'inline-block', margin: 1 }}> Danh sách thanh toán</h6>
                        </div>
                    </div>
                    <div className="card shadow-sm card-body ">
                        <div style={{ paddingBottom: '8px', display: 'flex', }}>
                            <Input
                                placeholder="Tìm kiếm "
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ marginBottom: '8px', width: '20%', marginRight: '8px' }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ marginRight: '8px' }}>Trạng thái: </span>
                                <Select
                                    value={paymentStatus}
                                    onChange={setPaymentStatus}
                                    style={{ width: '100px' }}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={1}>Đã thanh toán</Option>
                                    <Option value={0}>Chưa thanh toán</Option>
                                </Select>
                            </div>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            rowKey="id"
                            bordered
                            scroll={{ y: 'calc(100vh - 51vh)' }}
                            className='table responsive'
                        />
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={total}
                            onChange={(page, pageSize) => {
                                setPage(page);
                                setPageSize(pageSize);
                            }}
                            style={{ marginTop: '16px', textAlign: 'right' }}
                        />
                    </div>
                </div>

                <div style={{ width: '30%', paddingLeft: '8px', borderLeft: '1px solid #f0f0f0' }}>
                    {service && showForm && (
                        <div className="card shadow-sm card-body p-2">
                            <div className="card shadow-sm card-body">
                                <p>Chi tiết: {data.find(item => item.id === selectedData.paymentId)?.paymentCode + ' - ' || ''}
                                    {data.find(item => item.id === selectedData.paymentId)?.contract.contractCode || ''}
                                </p>
                            </div>
                            {service
                                .filter(svc => {
                                    if (isNew) {
                                        return svc.status === 1;
                                    } else {
                                        return selectedData.ids.find(item => item.id === svc.id);
                                    }
                                })
                                .map(svc => (
                                    <div key={svc.id}>
                                        <label>{svc.serviceName}</label>
                                        {isNew && (
                                            <label style={{ color: 'red' }}>  * đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(svc?.servicePrice)}</label>
                                        )}
                                        <Input
                                            type="number"
                                            value={selectedData?.ids?.find(item => item.id === svc.id)?.value || ''}
                                            placeholder='Nhập giá trị'
                                            onChange={(e) => setSelectedData(prev => ({
                                                ...prev,
                                                ids: [
                                                    ...(prev?.ids?.filter(item => item.id !== svc.id) || []),
                                                    { id: svc.id, value: Number(e.target.value) }
                                                ]
                                            }))}
                                        />
                                    </div>
                                ))
                            }



                            {!isNew && (
                                <>
                                    <label style={{ color: 'red' }}>
                                        Tổng cộng dịch vụ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedData?.sumService)}
                                    </label>
                                    <label style={{ color: 'red' }}>
                                        Tiền phòng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedData?.rentPrice)}
                                    </label>
                                    <hr></hr>
                                    <label style={{ color: 'red' }}>
                                        Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedData?.sum)}
                                    </label>
                                </>
                            )}

                            <div style={{ marginTop: '16px', textAlign: 'right' }}>
                                <Button
                                    type="primary"
                                    disabled={isNew && selectedData?.ids.length === 0}
                                    onClick={confirmSave}
                                >
                                    {isNew ? 'Thêm mới' : 'Cập nhật'}
                                </Button>

                                <Button style={{ marginLeft: '8px' }} >
                                    Huỷ
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default TableComponent;

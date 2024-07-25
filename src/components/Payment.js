import React, { useState, useEffect } from 'react';
import ApiService from '../Service/ApiPaymentService.js';
import ApiServiceService from '../Service/ApiServiceService.js';
import ApiPaymentDetailService from '../Service/ApiPaymentDetailService.js';

import SidebarMenu from './SidebarMenu';
import { Table, Button, Input, Modal, Select, Pagination, message } from 'antd';
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
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [service, setService] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const { Option } = Select;


    useEffect(() => {
        fetchData();
    }, [page, pageSize, search, paymentStatus]);

    useEffect(() => {
        fetchService();
    }, []);

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
            //  setSelectedData(selectedData=>({
            //     ...selectedData, ids:result
            //  }))
            setSelectedData(result);
            //  setIsNew(false);
            // setSelectedData(selectedData => ({
            //     ...selectedData,
            //     paymentId: id
            // }));
            setShowForm(true);
        } catch (error) {
            console.error('Error fetching details for edit:', error);
        }
    };

    const save = async () => {
        try {
            // if (isNew) {
            await ApiPaymentDetailService.create(selectedData);
            message.success('Thêm mới thành công!');
            // } else {
            //     await ApiService.update(selectedData.id, selectedData);
            //     message.success('Cập nhật thành công!');
            // }
            fetchData();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    const confirmSave = () => {
        console.log(selectedData)
        console.log(service)
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn lưu thông tin thanh toán này này?',
            okText: 'Xác nhận',
            okType: 'primary',
            cancelText: 'Huỷ',
            onOk: () => save(),
        });
    };



    // const handleInputChange = (field) => (e) => {
    //     setSelectedData((prev) => ({ ...prev, [field]: e.target.value }));
    // };



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
            title: 'Hạn',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            sorter: (a, b) => a.paymentDate.localeCompare(b.paymentDate),
            width: '14%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            sorter: (a, b) => a.paymentStatus - b.paymentStatus,
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
                    {value === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
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
                <div style={{ width: '60%', paddingRight: '8px' }}>
                    <div className="card shadow-sm card-body p-2 mb-3 mt-2" style={{ height: '7vh', width: '100%', display: 'flex' }}>
                        <div>
                            <p style={{ display: 'inline-block', margin: 0 }}>Quản lý danh mục/ </p>
                            <h6 style={{ display: 'inline-block', margin: 1 }}> Danh sách thanh toán</h6>
                        </div>
                    </div>
                    <div className="card shadow-sm card-body ">
                        <div style={{ paddingBottom: '8px' }}>
                            <Input
                                placeholder="Tìm kiếm khách hàng"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ marginBottom: '8px', width: '70%', marginRight: '8px' }}
                            />
                        </div>
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

                <div style={{ width: '40%', paddingLeft: '8px', borderLeft: '1px solid #f0f0f0' }}>
                    {service && showForm && (
                        <div className="card shadow-sm card-body p-2">
                            <div className="card shadow-sm card-body">
                                <p>Chi tiết</p>
                            </div>

                            {/* <div>
                                <p style={{ display: 'inline-block', margin: 0 }}>Thông tin chi tiết:</p>
                                <h6 style={{ display: 'inline-block', margin: 1 }}>{selectedData.paymentCode}</h6>
                            </div> */}

                            {service.map(svc => (
                                <div key={svc.id}>
                                    <label>{svc.serviceName}</label> * đơn giá: <label style={{ color: 'red' }}>{svc.servicePrice}</label>                                    <Input
                                        type="number"
                                        value={selectedData?.ids?.find(item => item.id === svc.id)?.value || ''}
                                        onChange={(e) => setSelectedData(prev => ({
                                            ...prev,
                                            ids: [
                                                ...(prev?.ids?.filter(item => item.id !== svc.id) || []),
                                                { id: svc.id, value: Number(e.target.value) }
                                            ]
                                        }))}
                                    />
                                </div>
                            ))}

                            <label>
                                haha{selectedData?.ids?.[1]?.amount || 'Không có giá trị'}
                            </label>




                            <div style={{ marginTop: '16px', textAlign: 'right' }}>
                                <Button type="primary" onClick={confirmSave}>
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

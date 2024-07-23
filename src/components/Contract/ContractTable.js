// import React, { useState, useEffect } from 'react';
// import ApiService from '../../Service/ApiContractService';
// import ApiRoomService from '../../Service/ApiRoomService';
// import ApiCustomerService from '../../Service/ApiCustomerService'
// import SidebarMenu from '.././SidebarMenu';
// import { Table, Button, Input, Modal, Select, Pagination, message } from 'antd';
// import { EditOutlined, DeleteOutlined, RetweetOutlined } from '@ant-design/icons';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function TableComponent() {
//     const [data, setData] = useState([]);
//     const [rooms, setRooms] = useState([])
//     const [customers, setCustomers] = useState([])
//     const [selectedData, setSelectedData] = useState([]);
//     const [selectedCustomers, setSelectedCustomers] = useState([])
//     const [dataCustomer, setDataCustomer] = useState([]);
//     const [isNew, setIsNew] = useState(false);
//     const [errors, setErrors] = useState([]);
//     const [errorsCustomer, setErrorsCustomer] = useState([]);
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [total, setTotal] = useState(0);
//     const [search, setSearch] = useState('');
//     const [status, setStatus] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [modalCustomer, setModalCustomer] = useState(false);
//     const { Option } = Select;

//     useEffect(() => {
//         fetchData();
//         fetchRooms();
//         fetchCustomers();
//     }, [page, pageSize, search, status]);

//     const fetchData = async () => {
//         try {
//             const response = await ApiService.search(page - 1, pageSize, search, status);
//             setData(response.content);
//             setTotal(response.totalElements);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     const fetchRooms = async () => {
//         try {
//             const response = await ApiRoomService.getAll();
//             setRooms(response);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     const fetchCustomers = async () => {
//         try {
//             const response = await ApiCustomerService.getAll();
//             setCustomers(response);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

    
//   const remove = async (id) => {
//     try {
//       await ApiService.delete(id);
//       fetchData();
//       message.success('Đóng thành công.');
//     } catch (error) {
//       console.error('Error deleting data:', error);
//     }
//   };
  
//   const restore = async (id) => {
//     try {
//       await ApiService.restore(id);
//       fetchData();
//       message.success('Khôi phục thành công.');
//     } catch (error) {
//       console.error('Error restore data:', error);
//     }
//   };


//     const confirmDelete = (id) => {
//         Modal.confirm({
//             title: 'Xác nhận',
//             content: 'Bạn có chắc chắn muốn đóng hợp đồng này?',
//             okText: 'Xác nhận',
//             okType: 'danger',
//             cancelText: 'Huỷ',
//             onOk: () => remove(id),
//         });
//     };

//     const confirmRestore = (id) => {
//         Modal.confirm({
//             title: 'Xác nhận',
//             content: 'Bạn có chắc chắn muốn khôi phục hợp đồng này?',
//             okText: 'Xác nhận',
//             okType: 'primary',
//             cancelText: 'Huỷ',
//             onOk: () => restore(id),
//         });
//     };

//     const confirmSave = () => {
//         Modal.confirm({
//             title: 'Xác nhận',
//             content: 'Bạn có chắc chắn muốn lưu thông tin hợp đồng này?',
//             okText: 'Xác nhận',
//             okType: 'primary',
//             cancelText: 'Huỷ',
//             // onOk: () => save(),
//         });
//     };

//     const columns = [
//         {
//             title: 'Mã Hợp đồng',
//             dataIndex: 'contractCode',
//             key: 'contractCode',
//             sorter: (a, b) => a.contractCode.localeCompare(b.contractCode),
//             width: '14%',
//         },
//         {
//             title: 'Mã Phòng',
//             dataIndex: ['room', 'roomCode'], 
//             key: 'room.roomCode',
//             sorter: (a, b) => a.room.roomCode.localeCompare(b.room.roomCode),
//             width: '14%',
//         },

//         {
//             title: 'Ngày bắt đầu',
//             dataIndex: 'startDate',
//             key: 'startDate',
//             sorter: (a, b) => a.startDate.localeCompare(b.startDate),
//             width: '14%',
//         },
//         {
//             title: 'Ngày kết thúc',
//             dataIndex: 'endDate',
//             key: 'endDate',
//             sorter: (a, b) => a.endDate.localeCompare(b.endDate),
//             width: '14%',
//         },
//         {
//             title: 'Giá thuê',
//             dataIndex: ['room', 'rentPrice'],
//             key: 'rentPrice',
//             sorter: (a, b) => a.rentPrice.localeCompare(b.rentPrice),
//             width: '14%',
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'status',
//             key: 'status',
//             sorter: (a, b) => a.status - b.status,
//             render: (value) => (
//                 <span
//                     style={{
//                         color: value === 1 ? 'green' : 'red',
//                         backgroundColor: value === 1 ? '#e6ffe6' : '#ffe6e6',
//                         border: value === 1 ? '1px solid green' : '1px solid red',
//                         borderRadius: '4px',
//                         padding: '2px 8px',
//                     }}
//                 >
//                     {value === 1 ? 'Hoạt động' : 'Ngưng hoạt động'}
//                 </span>
//             ),
//             width: '14%',
//         },
//         {
//             title: 'Hành động',
//             key: 'action',
//             render: (value) => (  //value 
//                 <div>
//                     <Button
//                         icon={<EditOutlined />}
//                         // onClick={() => edit(value.id)}
//                         style={{ marginRight: 10 }}>
//                     </Button>

//                     {value.status === 0 ? (
//                         <Button
//                             icon={<RetweetOutlined />}
//                             style={{ color: 'blue', borderColor: 'blue' }}
//                             onClick={() => confirmRestore(value.id)}>
//                         </Button>
//                     ) : (
//                         <Button
//                             icon={<DeleteOutlined />}
//                             onClick={() => confirmDelete(value.id)}
//                             danger >
//                         </Button>
//                     )}
//                 </div>
//             ),
//             width: '15%',
//         },
//     ];

//     return (
//         <div style={{ width: '100%' }}>
//             <div style={{ width: '15%' }}>
//                 <SidebarMenu />
//             </div>
//             <div style={{ marginLeft: '15%', width: '85%', padding: '16px' }}>
//                 <div className="card shadow-sm card-body p-2 mb-3 mt-2" style={{ height: '7vh', width: '100%', display: 'flex' }}>
//                     <div>
//                         <p style={{ display: 'inline-block', margin: 0 }}>Quản lý danh mục/ </p>
//                         <h6 style={{ display: 'inline-block', margin: 1 }}> Danh sách hợp đồng</h6>
//                     </div>
//                 </div>
//                 <div className="card shadow-sm card-body ">
//                     <div style={{ marginBottom: 20 }}>
//                        <a href='http://localhost:3000/hop-dong/form'><Button
//                             type="primary">
//                             Thêm mới hợp đồng
//                         </Button>
//                         </a> 
//                         <Input
//                             placeholder="Tìm kiếm..."
//                             style={{ width: 200, marginLeft: 20 }}
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                         />
//                         <Select
//                             placeholder="Chọn trạng thái"
//                             style={{ width: 200, marginLeft: 20 }}
//                             value={status}
//                             onChange={setStatus}
//                         >
//                             <Option value="">Tất cả</Option>
//                             <Option value={1}>Hoạt động</Option>
//                             <Option value={0}>Ngưng hoạt động</Option>
//                         </Select>
//                     </div>

//                     <Table
//                         columns={columns}
//                         dataSource={data}
//                         rowKey="id"
//                         pagination={false}
//                         scroll={{ y: 'calc(100vh - 39vh)' }}
//                         className='table responsive'
//                     />
//                     <Pagination
//                         current={page}
//                         pageSize={pageSize}
//                         total={total}
//                         showSizeChanger
//                         pageSizeOptions={['10', '20', '50']}
//                         onChange={(page, pageSize) => {
//                             setPage(page);
//                             setPageSize(pageSize);
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default TableComponent;

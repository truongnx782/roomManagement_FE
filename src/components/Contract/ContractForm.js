// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import ApiService from '../../Service/ApiContractService';
// import ApiRoomService from '../../Service/ApiRoomService';
// import ApiCustomerService from '../../Service/ApiCustomerService';
// import SidebarMenu from '../SidebarMenu';
// import { Button, Input, Select, message, Modal } from 'antd';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const { Option } = Select;

// function FormComponent() {
//   const { id } = useParams();
//   const [rooms, setRooms] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedData, setSelectedData] = useState({});
//   const [selectedCustomers, setSelectedCustomers] = useState([]);
//   const [isNew, setIsNew] = useState(!id);
//   const [errors, setErrors] = useState({});
//   const [errorsCustomer, setErrorsCustomer] = useState({});
//   const [dataCustomer, setDataCustomer] = useState({});
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   useEffect(() => {
//     fetchRooms();
//     fetchCustomers();
//     if (id) {
//       fetchContractById(id);
//     }
//   }, [id]);

//   const fetchRooms = async () => {
//     try {
//       const response = await ApiRoomService.getAll();
//       setRooms(response);
//     } catch (error) {
//       console.error('Error fetching rooms:', error);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const response = await ApiCustomerService.getAll();
//       setCustomers(response);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
//   };

//   const fetchContractById = async (contractId) => {
//     try {
//       const response = await ApiService.getById(contractId);
//       setSelectedData(response);
//       setSelectedCustomers(response.customers.map(customer => customer.id));
//       setIsNew(false);
//     } catch (error) {
//       console.error('Error fetching contract:', error);
//     }
//   };

//   const handleInputChange = (field) => (e) => {
//     setSelectedData((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const validate = () => {
//     let isValid = true;
//     const errors = {};

//     if (!selectedData || !selectedData.startDate) {
//       errors.startDate = 'Ngày bắt đầu không được để trống.';
//       isValid = false;
//     }

//     if (!selectedData || !selectedData.room) {
//       errors.room = 'Phòng không được để trống.';
//       isValid = false;
//     }

//     if (!selectedCustomers || selectedCustomers.length === 0) {
//       errors.customer = 'Khách hàng không được để trống.';
//       isValid = false;
//     }
//     setErrors(errors);
//     return isValid;
//   };

//   const save = async () => {
//     if (!validate()) {
//       return;
//     }

//     try {
//       if (isNew) {
//         await ApiService.create(selectedData);
//         message.success('Thêm mới thành công!');
//       } else {
//         await ApiService.update(selectedData.id, selectedData);
//         message.success('Cập nhật thành công!');
//       }
//     } catch (error) {
//       console.error('Error saving data:', error);
//     }
//   };

//   const handleSaveCustomer = async () => {
//     try {
//       if (!validateCustomer()) {
//         return;
//       }
//       await ApiCustomerService.create(dataCustomer);
//       message.success('Thêm mới thành công!');
//       fetchCustomers();
//       setIsModalVisible(false);
//     } catch (error) {
//       console.error('Error saving customer:', error);
//     }
//   };

//   const validateCustomer = () => {
//     let isValid = true;
//     const errorsCustomer = {};

//     if (!dataCustomer || !dataCustomer.customerName || dataCustomer.customerName.trim() === '') {
//       errorsCustomer.customerName = 'Tên khách hàng không được để trống.';
//       isValid = false;
//     }
//     if (!dataCustomer || !dataCustomer.identityNumber || dataCustomer.identityNumber.trim() === '') {
//       errorsCustomer.identityNumber = 'CCCD không được để trống.';
//       isValid = false;
//     }
//     if (!dataCustomer || !dataCustomer.phoneNumber || dataCustomer.phoneNumber.trim() === '') {
//       errorsCustomer.phoneNumber = 'SDT không được để trống.';
//       isValid = false;
//     }
//     if (!dataCustomer || !dataCustomer.birthdate) {
//       errorsCustomer.birthdate = 'Ngày sinh không được để trống.';
//       isValid = false;
//     } else {
//       const birthdate = new Date(dataCustomer.birthdate);
//       const today = new Date();
//       if (birthdate > today) {
//         errorsCustomer.birthdate = 'Ngày sinh không được lớn hơn ngày hiện tại.';
//         isValid = false;
//       }
//     }
//     setErrorsCustomer(errorsCustomer);
//     return isValid;
//   };

//   return (
//     <div style={{ width: '100%' }}>
//       <div style={{ width: '15%' }}>
//         <SidebarMenu />
//       </div>
//       <div style={{ marginLeft: '15%', width: '85%', padding: '16px' }}>
//         <div className="card shadow-sm card-body p-2 mb-3 mt-2" style={{ height: '7vh', width: '100%', display: 'flex' }}>
//           <div>
//             <p style={{ display: 'inline-block', margin: 0 }}>Quản lý danh mục/ </p>
//             <h6 style={{ display: 'inline-block', margin: 1 }}> Thêm mới/ Cập nhật hợp đồng</h6>
//           </div>
//         </div>
//         <div className="card shadow-sm card-body">
//           <form>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label>Ngày bắt đầu</label>
//                 <Input
//                   type="date"
//                   value={selectedData.startDate || ''}
//                   onChange={handleInputChange('startDate')}
//                   style={{ borderColor: errors.startDate ? 'red' : '' }}
//                 />
//                 {errors.startDate && <div style={{ color: 'red' }}>{errors.startDate}</div>}
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label>Ngày kết thúc</label>
//                 <Input
//                   type="date"
//                   value={selectedData.endDate || ''}
//                   onChange={handleInputChange('endDate')}
//                   style={{ borderColor: errors.endDate ? 'red' : '' }}
//                 />
//                 {errors.endDate && <div style={{ color: 'red' }}>{errors.endDate}</div>}
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label>Phòng</label>
//                 <Select
//                   value={selectedData.room?.id || ''}
//                   onChange={(value) => setSelectedData({ ...selectedData, room: { id: value } })}
//                   style={{ width: '100%' }}
//                   placeholder="Chọn phòng"
//                   className={errors.room ? 'is-invalid' : ''}
//                   showSearch
//                   filterOption={(input, option) =>
//                     option.children.toLowerCase().includes(input.toLowerCase())
//                   }
//                 >
//                   {rooms.map(room => (
//                     <Option key={room.id} value={room.id}>
//                       {room.roomCode} - {room.roomName}
//                     </Option>
//                   ))}
//                 </Select>
//                 {errors.room && <div style={{ color: 'red' }}>{errors.room}</div>}
//               </div>

//               <div className="col-md-6 mb-3">
//                 <div className="d-flex justify-content-between">
//                   <label>Khách hàng</label>
//                   <Button size="small" type="primary" onClick={() => setIsModalVisible(true)}>+</Button>
//                 </div>
//                 <Select
//                   value={selectedCustomers}
//                   mode="multiple"
//                   onChange={setSelectedCustomers}
//                   style={{ width: '100%' }}
//                   placeholder="Chọn khách hàng"
//                   className={errors.customer ? 'is-invalid' : ''}
//                   showSearch
//                   filterOption={(input, option) =>
//                     option.children.toLowerCase().includes(input.toLowerCase())
//                   }
//                 >
//                   {customers
//                     .filter(option => option.status === 1 || selectedCustomers.includes(option.id))
//                     .map(customer => (
//                       <Option key={customer.id} value={customer.id}>
//                         {customer.customerName} - {customer.phoneNumber}
//                       </Option>
//                     ))}
//                 </Select>
//                 {errors.customer && <div style={{ color: 'red' }}>{errors.customer}</div>}
//               </div>
//             </div>
//             <div className="row mt-3">
//               <div className="col-md-12">
//                 <Button type="primary" onClick={save} style={{ marginRight: '10px' }}>
//                   {isNew ? 'Thêm mới' : 'Cập nhật'}
//                 </Button>
//                 <Button onClick={() => setSelectedData({})}>
//                   Hủy
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//       <Modal
//         title="Thêm khách hàng"
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         onOk={handleSaveCustomer}
//       >
//         <div>
//           <label>Tên khách hàng</label>
//           <Input
//             value={dataCustomer.customerName || ''}
//             onChange={(e) => setDataCustomer({ ...dataCustomer, customerName: e.target.value })}
//             style={{ borderColor: errorsCustomer.customerName ? 'red' : '' }}
//           />
//           {errorsCustomer.customerName && <div style={{ color: 'red' }}>{errorsCustomer.customerName}</div>}
//         </div>
//         <div>
//           <label>CCCD</label>
//           <Input
//             value={dataCustomer.identityNumber || ''}
//             onChange={(e) => setDataCustomer({ ...dataCustomer, identityNumber: e.target.value })}
//             style={{ borderColor: errorsCustomer.identityNumber ? 'red' : '' }}
//           />
//           {errorsCustomer.identityNumber && <div style={{ color: 'red' }}>{errorsCustomer.identityNumber}</div>}
//         </div>
//         <div>
//           <label>SDT</label>
//           <Input
//             value={dataCustomer.phoneNumber || ''}
//             onChange={(e) => setDataCustomer({ ...dataCustomer, phoneNumber: e.target.value })}
//             style={{ borderColor: errorsCustomer.phoneNumber ? 'red' : '' }}
//           />
//           {errorsCustomer.phoneNumber && <div style={{ color: 'red' }}>{errorsCustomer.phoneNumber}</div>}
//         </div>
//         <div>
//           <label>Ngày sinh</label>
//           <Input
//             type="date"
//             value={dataCustomer.birthdate || ''}
//             onChange={(e) => setDataCustomer({ ...dataCustomer, birthdate: e.target.value })}
//             style={{ borderColor: errorsCustomer.birthdate ? 'red' : '' }}
//           />
//           {errorsCustomer.birthdate && <div style={{ color: 'red' }}>{errorsCustomer.birthdate}</div>}
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default FormComponent;

import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import { AppstoreOutlined, CalendarOutlined, MailOutlined, UnorderedListOutlined, SnippetsOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../constants/fetchWithAuth';


const menuItems = [
  { key: '1', icon: <MailOutlined />, label: 'QL Phòng', link: '/phong/hien-thi' },
  { key: '2', icon: <CalendarOutlined />, label: 'QL Dịch vụ', link: '/dich-vu/hien-thi' },
  { key: '7', icon: <AppstoreOutlined />, label: 'QL Tiện ích', link: '/tien-ich/hien-thi' },
  { key: '8', icon: <UnorderedListOutlined />, label: 'QL Khách hàng', link: '/khach-hang/hien-thi' },
  { key: '9', icon: <SnippetsOutlined />, label: 'QL Hợp đồng', link: '/hop-dong/hien-thi' },
  { key: '10', icon: <DollarOutlined />, label: 'QL Thanh toán', link: '/thanh-toan/hien-thi' },
  { key: '11', icon: <DollarOutlined />, label: 'QL Bảo trì', link: '/bao-tri/hien-thi' },
];

const SidebarMenu = () => {
  const [theme, setTheme] = useState('light');
  const [selectedKey, setSelectedKey] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
  
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('cid');
        navigate('/login'); 
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout request failed', error);
    }
  };
  

  return (
    <div style={{ height: '100vh', width: '15%', background: theme === 'light' ? '#f0f2f5' : '#001529', position: 'fixed', top: 0, left: 0, zIndex: 1000, overflowY: 'auto' }}>
      <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.5rem', fontWeight: 'bold', color: theme === 'light' ? '#000' : '#fff' }}>Menu</h4>
        <div style={{ marginBottom: '16px' }} className='d-flex justify-content-center'>
          <h4 style={{ color: '#ff1493' }}>Hello: Chuonnn</h4>
        </div>
        <Menu
          style={{ flex: 1, border: 'none' }}
          selectedKeys={[selectedKey]}
          theme={theme}
          items={menuItems.map(item => ({
            ...item,
            label: <a href={item.link} onClick={() => setSelectedKey(item.key)}>{item.label}</a>
          }))}
          onClick={e => setSelectedKey(e.key)}
        />
        <Button type="primary" danger onClick={handleLogout} style={{ marginTop: 'auto', width: '100%' }}>Đăng xuất</Button>
      </div>
    </div>
  );
};

export default SidebarMenu;

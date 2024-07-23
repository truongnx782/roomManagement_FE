import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  CalendarOutlined,
  MailOutlined,
  UnorderedListOutlined,
  SnippetsOutlined ,
} from '@ant-design/icons';
import 'antd/dist/reset.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const items = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: 'QL Phòng',
    link: 'http://localhost:3000/phong/hien-thi',
  },
  {
    key: '2',
    icon: <CalendarOutlined />,
    label: 'QL Dịch vụ',
    link: 'http://localhost:3000/dich-vu/hien-thi',
  },
  {
    key: '7',
    icon: <AppstoreOutlined />,
    label: 'QL Tiện ích',
    link: 'http://localhost:3000/tien-ich/hien-thi',
  },
  {
    key: '8',
    icon: <UnorderedListOutlined />,
    label: 'QL Khách hàng',
    link: 'http://localhost:3000/khach-hang/hien-thi',
  },
  {
    key: '9',
    icon: <SnippetsOutlined />,
    label: 'QL Hợp đồng',
    link: 'http://localhost:3000/hop-dong/hien-thi',
  },
];

const SidebarMenu = () => {
  const [theme, setTheme] = useState('light');
  const [selectedKey, setSelectedKey] = useState('');

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleClick = (e) => {
    setSelectedKey(e.key);
  };

  return (
    <div
      className="sidebar-menu"
      style={{
        height: '100vh',
        width: '15%',
        background: theme === 'light' ? '#f0f2f5' : '#001529',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: '16px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: theme === 'light' ? '#000' : '#fff',
          }}
        >
          Menu
        </h4>
        <div style={{ marginBottom: '16px' }} className='d-flex justify-content-center'>
        <h4 style={{ color: '#ff1493' }}>Hello: Chuonnn</h4>
        </div>
        <Menu
          style={{ flex: 1, border: 'none' }}
          selectedKeys={[selectedKey]}
          theme={theme}
          items={items.map((item) => ({
            ...item,
            label: item.link ? (
              <a href={item.link} onClick={() => setSelectedKey(item.key)}>
                {item.label}
              </a>
            ) : (
              item.label
            ),
          }))}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default SidebarMenu;

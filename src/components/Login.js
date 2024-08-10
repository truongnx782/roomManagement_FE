import React, { useState } from 'react';
import { Tabs, Input, Button, Checkbox, Form, Divider, Space, Typography, message } from 'antd';
import { FacebookOutlined, TwitterOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const { TabPane } = Tabs;
const { Title } = Typography;

const App = () => {
  const [loginForm] = Form.useForm();  // Form instance cho đăng nhập
  const [registerForm] = Form.useForm();  // Form instance cho đăng ký
  const [forgotPasswordForm] = Form.useForm();  // Form instance cho quên mật khẩu
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { username, password } = values;

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const cid = response.headers.get('cid') || 'CID not found';
        const token = response.headers.get('token') || 'Token not found';

        localStorage.setItem('cid', cid);
        localStorage.setItem('token', token);

        message.success('Đăng nhập thành công!');
        navigate('/phong/hien-thi');
      } else {
        const errorData = await response.json();
        message.error('Đăng nhập thất bại!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleRegister = async (values) => {
    const { email, password, name } = values;
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
  
      // Đọc nội dung phản hồi
      const data = await response.json();
  
      if (response.ok) {
        message.success('Gửi mail thành công!');
      } else if (data.message === 'Email already exists') {
        message.error('Email đã tồn tại!');
      } else {
        message.error('Gửi mail thất bại!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };
  

  const handleForgotPassword = async (values) => {
    const { email,password } = values;

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email,password }),
      });

      if (response.ok) {
        message.success('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!');
      } else {
        message.error('Gửi yêu cầu thất bại!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      if (token) {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);

        const { sub, picture, name, email } = decoded;

        const response = await fetch('http://localhost:8080/api/auth/login-google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sub, picture, name, email }),
        });

        if (response.ok) {
          const cid = response.headers.get('cid') || 'CID not found';
          const token = response.headers.get('token') || 'Token not found';

          localStorage.setItem('cid', cid);
          localStorage.setItem('token', token);
          message.success('Đăng nhập thành công!');
          navigate('/phong/hien-thi');
        } else {
          const errorData = await response.json();
          message.error('Đăng nhập thất bại!');
        }
      } else {
        console.log('No token found in credentialResponse');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Authentication</Title>

      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Login" key="1">
          <Form form={loginForm} onFinish={handleLogin}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
           
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <Divider>Or sign in with</Divider>
          <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
            <Button icon={<FacebookOutlined />} />
            <Button icon={<TwitterOutlined />} />
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
            />
            <Button icon={<GithubOutlined />} />
          </Space>
        </TabPane>

        <TabPane tab="Register" key="2">
          <Form form={registerForm} onFinish={handleRegister}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Checkbox>I have read and agree to the terms</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Sign up
              </Button>
            </Form.Item>
          </Form>

          <Divider>Or sign up with</Divider>
          <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
            <Button icon={<FacebookOutlined />} />
            <Button icon={<TwitterOutlined />} />
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
            />
            <Button icon={<GithubOutlined />} />
          </Space>
        </TabPane>

        <TabPane tab="Forgot Password" key="3">
          <Form form={forgotPasswordForm} onFinish={handleForgotPassword}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const cid = response.headers.get('Cid') || 'CID not found';
        const token = (document.cookie.split('; ').find(row => row.startsWith('token=')) || 'token=not found').split('=')[1] || 'Token not found';

        localStorage.setItem('cid', cid); 
        localStorage.setItem('token', token); 

        setMessage('Login successful');
        setIsLoggedIn(true);
        navigate('/phong/hien-thi');
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <MDBInput
          wrapperClass='mb-4'
          label='Username'
          id='username'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <MDBInput
          wrapperClass='mb-4'
          label='Password'
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="d-flex justify-content-between mx-3 mb-4">
          <MDBCheckbox name='rememberMe' id='rememberMe' label='Remember me' />
          <a href="#!">Forgot password?</a>
        </div>
        <MDBBtn className="mb-4 w-100" type="submit">Login</MDBBtn>
        {message && <p className="text-danger text-center">{message}</p>}
      </form>
      <div className="text-center">
        <p>Not a member? <a href="#!">Register</a></p>
        <p>or sign up with:</p>
        <div className='d-flex justify-content-between mx-auto' style={{ width: '40%' }}>
          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='facebook-f' size="sm" />
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='twitter' size="sm" />
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='google' size="sm" />
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='github' size="sm" />
          </MDBBtn>
        </div>
        <a href="http://localhost:8080/auth/login-google">Login with Google</a>
      </div>
    </MDBContainer>
  );
};

export default Login;

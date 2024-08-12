import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode';
const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        const exp = decodedToken.exp; 

        if (exp - now < 300) {
          const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (refreshResponse.ok) {
            const cid = refreshResponse.headers.get('cid') || 'CID not found';
            const newToken = refreshResponse.headers.get('token') || 'Token not found';
            console.log(cid)
            console.log(newToken)
            localStorage.setItem('cid', cid);
            localStorage.setItem('token', newToken);
          } else {
            console.error('Refresh token failed:', await refreshResponse.text());
            localStorage.removeItem('token');
            localStorage.removeItem('cid');
            navigate('/login');
            return;
          }
        }

      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('cid');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  return isLoading;
};

export default useAuth;

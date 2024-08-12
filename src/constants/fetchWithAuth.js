const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'cid': localStorage.getItem('cid'),
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  // if (response.status === 401) {
  //   window.location.href = '/login';
  //   return;
  // }
  return response;
};

export default fetchWithAuth;



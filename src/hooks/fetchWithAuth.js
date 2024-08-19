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
  return response;
};

export default fetchWithAuth;



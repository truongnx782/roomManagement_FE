const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'cid': localStorage.getItem('cid'),
        ...options.headers
      }
    });
    if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
    if (!response.ok) throw new Error('Network response was not ok');
    return response;
  };
  
const ApiImageService = {
    async create(formData) {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/image/create`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed';
                throw new Error(errorMessage);
            }
            return response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
    async getAllByRoomId(id) {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/image/get-by-room-id/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed';
                throw new Error(errorMessage);
            }
            return response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
};


export default ApiImageService;

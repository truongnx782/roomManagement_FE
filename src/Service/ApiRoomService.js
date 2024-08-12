import fetchWithAuth from '../constants/fetchWithAuth';

const ApiRoomService = {
  async search(page, size, search, status) {
    try {
      const response = await fetchWithAuth('http://localhost:8080/room/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, size, search, status }),
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

  async getAll(id) {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/room`, {
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

  async getById(id) {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/room/${id}`, {
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

  async update(id, dataToUpdate) {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/room/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
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

  async create(data) {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  async delete(id) {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/room/delete/${id}`, {
        method: 'PUT',
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
  async restore(id) {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/room/restore/${id}`, {
        method: 'PUT',
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

  async upload(formData) {
    try {
      const response = await fetch('http://localhost:8080/room/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'cid': localStorage.getItem('cid'),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed';
        throw new Error(errorMessage);
      }
      return response.json();
    }
    catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async downloadTemplate() {
    try {
      const response = await fetchWithAuth('http://localhost:8080/room/template', {
        method: 'GET',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(` ${errorText}`);
      }
      return response.blob();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async exportData(page, size, search, status) {
    try {
      const response = await fetchWithAuth('http://localhost:8080/room/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, size, search, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed';
        throw new Error(errorMessage);
      }
      return response.blob();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },


};

export default ApiRoomService;

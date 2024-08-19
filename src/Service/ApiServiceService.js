import fetchWithAuth from '../constants/fetchWithAuth';

const ApiServiceService = {
    async search(page, size, search, status) {
      try {
        const response = await fetchWithAuth('http://localhost:8080/service/search', {
          method: 'POST',

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
  
    async getById(id) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/service/${id}`, {
          method: 'GET',

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
        const response = await fetchWithAuth(`http://localhost:8080/service/${id}`, {
          method: 'PUT',

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
        const response = await fetchWithAuth(`http://localhost:8080/service`, {
          method: 'POST',

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
        const response = await fetchWithAuth(`http://localhost:8080/service/delete/${id}`, {
          method: 'PUT',

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
        const response = await fetchWithAuth(`http://localhost:8080/service/restore/${id}`, {
          method: 'PUT',

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
    async getAll() {
      try {
        const response = await fetchWithAuth('http://localhost:8080/service', {
          method: 'GET',

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
        const response = await fetch('http://localhost:8080/service/upload', {
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
        const response = await fetchWithAuth('http://localhost:8080/service/template', {
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
        const response = await fetchWithAuth('http://localhost:8080/service/export', {
          method: 'POST',

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
  
  
export default ApiServiceService;

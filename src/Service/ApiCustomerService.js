import fetchWithAuth from '../constants/fetchWithAuth';

const ApiCustomerService = {
    async search(page, size, search, status) {
      try {
        const response = await fetchWithAuth('http://localhost:8080/customer/search', {
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
    async getAll() {
      try {
        const response = await fetchWithAuth('http://localhost:8080/customer', {
          method: 'GET',

        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Failed';
          throw new Error(errorMessage);
        }
        return response.json();
      } catch (error) {
        console.error('Error :', error);
        throw error;
      }
    },
    
    async getById(id) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/customer/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/customer/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/customer`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/customer/delete/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/customer/restore/${id}`, {
          method: 'PUT',

        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Failed';
          throw new Error(errorMessage);
        }
        return response.json();
      } catch (error) {
        console.error('Error :', error);
        throw error;
      }
    },

    
  async upload(formData) {
    try {
      const response = await fetch('http://localhost:8080/customer/upload', {
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
      const response = await fetchWithAuth('http://localhost:8080/customer/template', {
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
      const response = await fetchWithAuth('http://localhost:8080/customer/export', {
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

  
  
  export default ApiCustomerService;
  
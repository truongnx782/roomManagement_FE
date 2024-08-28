import fetchWithAuth from '../hooks/fetchWithAuth';
const ApiMaintenanceService = {
    async search(page, size, search, status) {
      try {
        const response = await fetchWithAuth('http://localhost:8080/maintenance/search', {
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
        const response = await fetchWithAuth(`http://localhost:8080/maintenance/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/maintenance/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/maintenance`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/maintenance/delete/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/maintenance/restore/${id}`, {
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

  };
  
  export default ApiMaintenanceService;
  
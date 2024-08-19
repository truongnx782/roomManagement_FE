import fetchWithAuth from '../constants/fetchWithAuth';
const ApiUtilityService = {

    async search(page, size, search, status) {
      try {
        const response = await fetchWithAuth('http://localhost:8080/contract/search', {
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
    
    async getById(id) {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/contract/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/contract/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/contract`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/contract/delete/${id}`, {
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
        const response = await fetchWithAuth(`http://localhost:8080/contract/restore/${id}`, {
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

  };
  
  export default ApiUtilityService;
  
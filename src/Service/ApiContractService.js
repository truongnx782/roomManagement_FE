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
          throw new Error('Failed to fetch data');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
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
          throw new Error('Failed to fetch data');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
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
          throw new Error('Failed to update data');
        }
        return response.json();
      } catch (error) {
        console.error('Error updating data:', error);
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
          throw new Error('Failed to create data');
        }
        return response.json();
      } catch (error) {
        console.error('Error creating data:', error);
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
          throw new Error('Failed to delete data');
        }
        return response.json();
      } catch (error) {
        console.error('Error deleting data:', error);
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
          throw new Error('Failed to restore data');
        }
        return response.json();
      } catch (error) {
        console.error('Error restore data:', error);
        throw error;
      }
    },

  };
  
  export default ApiUtilityService;
  
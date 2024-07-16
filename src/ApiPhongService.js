const ApiPhongService = {
  async search(page, size, search, trangThai) {
    try {
      const response = await fetch('http://localhost:8080/phong/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, size, search, trangThai }),
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
      const response = await fetch(`http://localhost:8080/phong/${id}`, {
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
      const response = await fetch(`http://localhost:8080/phong/${id}`, {
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
      const response = await fetch(`http://localhost:8080/phong`, {
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
      console.error('Error createing data:', error);
      throw error;
    }
  },
  async delete(id) {
    try {
      const response = await fetch(`http://localhost:8080/phong/delete/${id}`, {
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
      console.error('Error deleteting data:', error);
      throw error;
    }
  },

};

export default ApiPhongService;

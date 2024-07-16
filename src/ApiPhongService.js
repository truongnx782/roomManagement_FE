const ApiPhongService = {
  async getDataPhong() {
    try {
      const response = await fetch('http://localhost:8080/phong/hien-thi');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async getTypeOptions() {
    try {
      const response = await fetch('http://localhost:8080/api/list-type');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async createData(formData) {
    try {
      const response = await fetch('http://localhost:8080/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  async deleteData(id) {
    try {
      const response = await fetch(`http://localhost:8080/api/delete/${id}`, {
        method: 'DELETE',
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

  async viewUpdateData(id, formData) {
    try {
      const response = await fetch(`http://localhost:8080/api/view-update/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
  async updateData(id, formData) {
    try {
      const response = await fetch(`http://localhost:8080/api/update/${id}`, {
        method: 'PUT', // Sử dụng method PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

};

export default ApiPhongService;

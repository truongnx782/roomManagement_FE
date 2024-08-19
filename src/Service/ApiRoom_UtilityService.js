import fetchWithAuth from '../hooks/fetchWithAuth';
const ApiRoom_UtilityService = {

    async getById(id) {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/utility/${id}`, {
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

    async getUtilityIdByRoomId(id) {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/room-utility/get-utility-id-by-room-id/${id}`, {
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

    async update(dataToUpdate) {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/room-utility/update`, {
                method: 'POST',
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
            const response = await fetchWithAuth(`http://localhost:8080/room-utility/create`, {
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
            const response = await fetchWithAuth(`http://localhost:8080/utility/delete/${id}`, {
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

export default ApiRoom_UtilityService;

const ApiImageService = {
    async create(formData) {
        try {
            const response = await fetch(`http://localhost:8080/image/create`, {
                method: 'POST',
                body: formData,
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
    async getAllByRoomId(id) {
        try {
            const response = await fetch(`http://localhost:8080/image/get-by-room-id/${id}`, {
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
};


export default ApiImageService;

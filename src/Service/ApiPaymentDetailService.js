import fetchWithAuth from '../constants/fetchWithAuth';

const ApiPaymentService={
    async getByPaymentId(id) {
        try {
          const response = await fetchWithAuth(`http://localhost:8080/payment-detail/paymentId/${id}`, {
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
      async create(data) {
        try {
          const response = await fetchWithAuth(`http://localhost:8080/payment-detail/create-list`, {
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
}
export default ApiPaymentService;

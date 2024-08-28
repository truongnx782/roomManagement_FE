import fetchWithAuth from '../hooks/fetchWithAuth';
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
          const response = await fetchWithAuth(`http://localhost:8080/payment-detail/create-list`, {
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
}
export default ApiPaymentService;

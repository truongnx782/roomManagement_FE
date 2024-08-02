import fetchWithAuth from '../constants/fetchWithAuth';

const ApiPaymentService={
    async search(page, size, search, paymentStatus) {
        try {
          const response = await fetchWithAuth('http://localhost:8080/payment/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page, size, search, paymentStatus }),
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
          const response = await fetchWithAuth(`http://localhost:8080/utility`, {
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
      
      async updatePaymentStatus(id, checked) {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/payment/payment-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, checked }),
            });
            if (!response.ok) {
                throw new Error('Failed to update payment status');
            }
            return response.json();
        } catch (error) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    }
    
}
export default ApiPaymentService;

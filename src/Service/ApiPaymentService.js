import fetchWithAuth from '../hooks/fetchWithAuth';
const ApiPaymentService={
    async search(page, size, search, paymentStatus,roomId) {
        try {
          const response = await fetchWithAuth('http://localhost:8080/payment/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page, size, search, paymentStatus,roomId }),
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
          const response = await fetchWithAuth(`http://localhost:8080/utility`, {
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
              const errorData = await response.json();
              const errorMessage = errorData.message || 'Failed';
              throw new Error(errorMessage);
          }
            return response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    
}
export default ApiPaymentService;

const ApiPaymentService={
    async search(page, size, search, paymentStatus) {
        try {
          const response = await fetch('http://localhost:8080/payment/search', {
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
      }
}
export default ApiPaymentService;

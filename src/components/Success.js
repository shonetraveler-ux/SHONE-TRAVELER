import React from 'react';

const Success = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your booking. Your payment has been processed successfully.</p>
      <a href="/">Go back to home</a>
    </div>
  );
};

export default Success;
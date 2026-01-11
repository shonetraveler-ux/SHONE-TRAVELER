import React from 'react';

const Cancel = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Payment Cancelled</h1>
      <p>Your payment was cancelled. You can try again.</p>
      <a href="/">Go back to home</a>
    </div>
  );
};

export default Cancel;
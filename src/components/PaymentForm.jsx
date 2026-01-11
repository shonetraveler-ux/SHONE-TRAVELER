import React, { useState } from 'react';

const PaymentForm = ({ clientSecret, onSuccess, onError }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      if (cardNumber && expiry && cvc) {
        onSuccess({ id: 'demo_payment' });
      } else {
        onError('Please fill all fields');
      }
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <label>Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="1234 5678 9012 3456"
          style={{ width: '100%', padding: '10px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Expiry Date</label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM/YY"
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>CVC</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="123"
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isProcessing}
        style={{
          backgroundColor: '#6772e5',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;
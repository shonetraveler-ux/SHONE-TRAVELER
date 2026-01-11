import React from 'react';
import { ElementsConsumer, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(window.clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      onError(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-dark)' }}>Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn primary"
        style={{ width: '100%', padding: '12px', fontSize: '16px' }}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const PaymentForm = ({ clientSecret, onSuccess, onError }) => {
  React.useEffect(() => {
    window.clientSecret = clientSecret;
  }, [clientSecret]);

  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CheckoutForm stripe={stripe} elements={elements} onSuccess={onSuccess} onError={onError} />
      )}
    </ElementsConsumer>
  );
};

export default PaymentForm;
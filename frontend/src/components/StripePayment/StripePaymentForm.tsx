import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripePaymentForm.css';

interface StripePaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Create a payment method with the card element
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      // In a real implementation, you would create a payment intent on your server
      // and confirm it with the payment method ID
      
      // For this sandbox implementation, we'll use the payment method ID
      onPaymentSuccess(paymentMethod.id);
    } catch (error) {
      if (error instanceof Error) {
        setCardError(error.message);
        onPaymentError(error.message);
      } else {
        const errorMessage = 'An unknown error occurred';
        setCardError(errorMessage);
        onPaymentError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="stripe-payment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="card-element">Credit or debit card</label>
          <div className="card-element-container">
            <CardElement
              id="card-element"
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
              onChange={(event) => {
                if (event.error) {
                  setCardError(event.error.message);
                } else {
                  setCardError(null);
                }
              }}
            />
          </div>
        </div>
        {cardError && <div className="card-error">{cardError}</div>}
        
        <div className="test-card-info">
          <p className="text-sm text-gray-600 mb-2">For testing, use these credentials:</p>
          <ul className="text-xs text-gray-500 list-disc pl-5 mb-4">
            <li>Card number: 4242 4242 4242 4242</li>
            <li>Expiry date: Any future date (MM/YY)</li>
            <li>CVC: Any 3 digits</li>
            <li>ZIP: Any 5 digits</li>
          </ul>
        </div>
        
        <button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="stripe-payment-button"
        >
          {isProcessing ? (
            <div className="spinner"></div>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default StripePaymentForm; 
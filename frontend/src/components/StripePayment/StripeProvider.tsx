import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key
const stripePromise = loadStripe('pk_test_51RQxX74F7eFdAwLFOdnGQeehSO8L5Unz2y63SHvJ8pmtqF39lHamndak3Ygg2iuGTCHw91XlDzy4kd55Ti9YbwLl00e2zGUAeF');

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider; 
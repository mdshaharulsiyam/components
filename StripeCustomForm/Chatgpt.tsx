npm install express stripe body-parser cors
1.2 Create server.js
javascript
Copy code
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Your Secret Key

app.use(bodyParser.json());
app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, payment_method_types } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types,
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
Step 2: Setting Up the React Frontend
2.1 Install Required Packages
bash
Copy code
npm install @stripe/stripe-js @stripe/react-stripe-js
2.2 Create CheckoutForm.tsx
tsx
Copy code
import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, PaymentMethod } from '@stripe/stripe-js';
import axios from 'axios';
import { logEvent, Result, ErrorResult } from '../util';
import '../styles/common.css';

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '18px',
      color: '#424770',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [postal, setPostal] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  // Fetch the client secret from the server on component mount
  React.useEffect(() => {
    axios.post('http://localhost:3001/create-payment-intent', {
      amount: 1000, // Example amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    })
    .then((response) => {
      setClientSecret(response.data.clientSecret);
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name,
          address: {
            postal_code: postal,
          },
        },
      },
    });

    if (payload.error) {
      console.log('[error]', payload.error);
      setErrorMessage(payload.error.message || null);
      setPaymentMethod(null);
    } else {
      console.log('[PaymentMethod]', payload.paymentIntent);
      setPaymentMethod(payload.paymentIntent as PaymentMethod);
      setErrorMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Full Name</label>
      <input
        id="name"
        required
        placeholder="Jenny Rosen"
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
      />
      <label htmlFor="cardNumber">Card Number</label>
      <CardNumberElement
        id="cardNumber"
        onBlur={logEvent('blur')}
        onChange={logEvent('change')}
        onFocus={logEvent('focus')}
        onReady={logEvent('ready')}
        options={ELEMENT_OPTIONS}
      />
      <label htmlFor="expiry">Card Expiration</label>
      <CardExpiryElement
        id="expiry"
        onBlur={logEvent('blur')}
        onChange={logEvent('change')}
        onFocus={logEvent('focus')}
        onReady={logEvent('ready')}
        options={ELEMENT_OPTIONS}
      />
      <label htmlFor="cvc">CVC</label>
      <CardCvcElement
        id="cvc"
        onBlur={logEvent('blur')}
        onChange={logEvent('change')}
        onFocus={logEvent('focus')}
        onReady={logEvent('ready')}
        options={ELEMENT_OPTIONS}
      />
      <label htmlFor="postal">Postal Code</label>
      <input
        id="postal"
        required
        placeholder="12345"
        value={postal}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setPostal(event.target.value)}
      />
      {errorMessage && <ErrorResult>{errorMessage}</ErrorResult>}
      {paymentMethod && (
        <Result>Got PaymentMethod: {paymentMethod.id}</Result>
      )}
      <button type="submit" disabled={!stripe || !clientSecret}>
        Pay
      </button>
    </form>
  );
};

const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh'); // Your Publishable Key

const App: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default App;
Step 3: Add Utility Functions and Styles
3.1 Create util.ts
tsx
Copy code
// util.ts
export const logEvent = (event: string) => (result: any) => {
  console.log(`[${event}]`, result);
};

interface ResultProps {
  children: React.ReactNode;
}

export const Result: React.FC<ResultProps> = ({ children }) => (
  <div className="result">{children}</div>
);

export const ErrorResult: React.FC<ResultProps> = ({ children }) => (
  <div className="error-result">{children}</div>
);
3.2 Create common.css
css
Copy code
/* common.css */
.result {
  margin-top: 20px;
  color: green;
}

.error-result {
  margin-top: 20px;
  color: red;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

input {
  padding: 10px;
  margin-top: 5px;
  font-size: 16px;
}

button {
  margin-top: 20px;
  padding: 10px;
  font-size: 18px;
}
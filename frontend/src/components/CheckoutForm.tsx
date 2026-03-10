import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ amount, onSuccess }: { amount: number, onSuccess?: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      if (result.error.type === "card_error" || result.error.type === "validation_error") {
        setMessage(result.error.message || "Un error ocurrió.");
      } else {
        setMessage("Un error inesperado ocurrió.");
      }
    } else {
      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setMessage("¡Pago realizado con éxito! 🎉");
        if (onSuccess) onSuccess();
      }
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="card" style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h2 style={{ color: 'var(--microsip-blue)', marginBottom: '20px' }}>Pagar ${(amount / 100).toFixed(2)}</h2>
      <PaymentElement id="payment-element" />
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit" 
        className="button-ms" 
        style={{ marginTop: '20px', width: '100%' }}
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pagar ahora"}
        </span>
      </button>
      {message && <div id="payment-message" style={{ color: 'red', marginTop: '10px' }}>{message}</div>}
    </form>
  );
};

export default CheckoutForm;

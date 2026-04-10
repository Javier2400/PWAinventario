import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { recordPayment } from '../services/api';

const CheckoutForm = ({ amount, onSuccess }: { amount: number, onSuccess?: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

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
      
      // Grabar fallo en historial
      await recordPayment({
        amount,
        currency: 'mxn',
        status: 'failed',
        error: result.error.message
      }).catch(console.error);

      if (onSuccess) onSuccess();
    } else {
      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setMessage("¡Pago realizado con éxito! 🎉");
        setIsSuccess(true);
        
        // Grabar éxito en historial
        await recordPayment({
          id: result.paymentIntent.id,
          amount: result.paymentIntent.amount,
          currency: result.paymentIntent.currency,
          status: 'succeeded'
        }).catch(console.error);

        if (onSuccess) onSuccess();
      } else {
        setMessage("El pago está en proceso o requiere acciones adicionales.");
        if (onSuccess) onSuccess();
      }
    }

    setIsLoading(false);
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px'
    },
    button: (disabled: boolean, success: boolean) => ({
      backgroundColor: success ? '#059669' : '#09090b',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 600,
      fontSize: '14px',
      width: '100%',
      opacity: disabled ? 0.7 : 1,
      transition: 'all 0.2s'
    }),
    message: (success: boolean) => ({
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      textAlign: 'center' as const,
      backgroundColor: success ? '#f0fdf4' : '#fef2f2',
      color: success ? '#166534' : '#991b1b',
      border: `1px solid ${success ? '#bbf7d0' : '#fecaca'}`,
      marginTop: '10px'
    })
  };

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={styles.message(true)}>
          {message}
        </div>
        <button 
          style={{ ...styles.button(false, false), marginTop: '20px' }}
          onClick={() => window.location.reload()}
        >
          Realizar otro pago
        </button>
      </div>
    );
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={styles.form}>
      <PaymentElement id="payment-element" />
      
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit" 
        style={styles.button(isLoading || !stripe || !elements, false)}
      >
        <span id="button-text">
          {isLoading ? "Procesando..." : `Pagar $${(amount / 100).toFixed(2)} MXN`}
        </span>
      </button>

      {message && (
        <div style={styles.message(false)}>
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;

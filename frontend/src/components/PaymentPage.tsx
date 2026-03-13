import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createPaymentIntent, getPayments } from '../services/api';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51T81pMCsyImg6nenvX4KHDjgc0T27BAtmIpkSC3EEHvznaVXasbgbwVRlGkmM3XUd657qVx4ZQeqgmScqfPesccU00Sj5mHDD6");

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [amount] = useState(10000); // 100.00 MXN in cents
  const [payments, setPayments] = useState<any[]>([]);

  const loadPayments = () => {
    getPayments().then(setPayments).catch(console.error);
  };

  useEffect(() => {
    createPaymentIntent(amount).then((data) => {
      console.log("Client Secret creado:", data.clientSecret);
      setClientSecret(data.clientSecret);
    }).catch(err => {
      console.error("Error al crear PaymentIntent:", err);
    });
    loadPayments();
  }, [amount]);

  const appearance = {
    theme: 'stripe' as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="title-ms">Procesar Pago</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm amount={amount} onSuccess={loadPayments} />
            </Elements>
          )}
        </div>
        <div className="card">
          <h2 className="title-ms">Historial de Pagos</h2>
          <button className="button-ms" onClick={loadPayments} style={{ marginBottom: '10px' }}>Actualizar</button>
          <table className="table-ms">
            <thead>
              <tr>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p.id}>
                  <td>${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}</td>
                  <td style={{ color: p.status === 'succeeded' ? 'green' : 'red' }}>{p.status}</td>
                  <td>{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>No hay pagos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

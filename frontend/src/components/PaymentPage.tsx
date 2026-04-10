import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createPaymentIntent, getPayments } from '../services/api';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51T81pMCsyImg6nenvX4KHDjgc0T27BAtmIpkSC3EEHvznaVXasbgbwVRlGkmM3XUd657qVx4ZQeqgmScqfPesccU00Sj5mHDD6");

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [amount] = useState(10000); // 100.00 MXN in cents
  const [productName] = useState("Crema esfoliante");
  const [payments, setPayments] = useState<any[]>([]);
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [isInitiating, setIsInitiating] = useState(false);
  const [loadingIntent, setLoadingIntent] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadPayments = () => {
    getPayments().then(setPayments).catch(console.error);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleStartPayment = async () => {
    setLoadingIntent(true);
    try {
      const data = await createPaymentIntent(amount);
      console.log("Client Secret creado:", data.client_secret);
      setClientSecret(data.client_secret);
      setIsInitiating(true);
    } catch (err) {
      console.error("Error al crear PaymentIntent:", err);
    } finally {
      setLoadingIntent(false);
    }
  };

  const appearance = {
    theme: 'stripe' as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

  const styles = {
    container: {
      padding: '32px',
      maxWidth: '1280px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#09090b',
      marginBottom: '8px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isLargeScreen ? '1fr 1fr' : '1fr',
      gap: '24px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e4e4e7',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#09090b',
      marginBottom: '16px'
    },
    button: {
      backgroundColor: '#09090b',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '14px',
      width: '100%',
      marginTop: '16px'
    },
    productInfo: {
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #f1f1f4'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    infoLabel: {
      color: '#71717a',
      fontSize: '14px'
    },
    infoValue: {
      fontWeight: 600,
      color: '#18181b',
      fontSize: '14px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    th: {
      textAlign: 'left' as const,
      padding: '12px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      color: '#71717a',
      borderBottom: '2px solid #e4e4e7',
      backgroundColor: '#f9fafb'
    },
    td: {
      padding: '12px',
      fontSize: '14px',
      borderBottom: '1px solid #f4f4f5'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Procesar Pago</h1>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Resumen de Pago</h2>
          
          <div style={styles.productInfo}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Producto:</span>
              <span style={styles.infoValue}>{productName}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Monto a pagar:</span>
              <span style={{ ...styles.infoValue, fontSize: '18px', color: '#09090b' }}>
                ${(amount / 100).toFixed(2)} MXN
              </span>
            </div>
          </div>

          {!isInitiating ? (
            <button 
              style={styles.button} 
              onClick={handleStartPayment}
              disabled={loadingIntent}
            >
              {loadingIntent ? "Cargando..." : "Iniciar Pago"}
            </button>
          ) : (
            clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm amount={amount} onSuccess={loadPayments} />
              </Elements>
            )
          )}
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ ...styles.subtitle, marginBottom: 0 }}>Historial de Pagos</h2>
            <button 
              style={{ ...styles.button, width: 'auto', marginTop: 0, padding: '6px 12px' }} 
              onClick={loadPayments}
            >
              Actualizar
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Monto</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id}>
                    <td style={styles.td}>${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}</td>
                    <td style={{ 
                      ...styles.td, 
                      color: p.status === 'succeeded' ? '#059669' : '#dc2626', 
                      fontWeight: 600 
                    }}>
                      {p.status === 'succeeded' ? 'Completado' : 'Fallido'}
                    </td>
                    <td style={{ ...styles.td, color: '#71717a' }}>{new Date(p.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ ...styles.td, textAlign: 'center', padding: '32px', color: '#a1a1aa' }}>No hay pagos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

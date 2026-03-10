import React, { useState } from 'react';

const CreditCardForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateLuhn = (number: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setExpiryDate(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Card Number Validation
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta inválido (16 dígitos)';
    } else if (!validateLuhn(cleanCardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta no válido (Luhn Check Failed)';
    }

    // Expiry Date Validation (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Tarjeta expirada';
      }
    }

    // CVV Validation
    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV inválido (3 o 4 dígitos)';
    }

    // Cardholder Validation
    if (cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Nombre de titular inválido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Pago validado correctamente');
    }
  };

  return (
    <div className="card credit-card-form">
      <h3>Validación de Tarjeta</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group-ms">
          <label>Número de Tarjeta</label>
          <input
            type="text"
            className="input-ms"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
          {errors.cardNumber && <span className="error-text-ms">{errors.cardNumber}</span>}
        </div>
        <div className="form-group-ms">
          <label>Nombre del Titular</label>
          <input
            type="text"
            className="input-ms"
            placeholder="NOMBRE APELLIDO"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
          />
          {errors.cardHolder && <span className="error-text-ms">{errors.cardHolder}</span>}
        </div>
        <div className="form-row-ms">
          <div className="form-group-ms flex-1">
            <label>Fecha Expiración (MM/YY)</label>
            <input
              type="text"
              className="input-ms"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              maxLength={5}
            />
            {errors.expiryDate && <span className="error-text-ms">{errors.expiryDate}</span>}
          </div>
          <div className="form-group-ms flex-1">
            <label>CVV</label>
            <input
              type="text"
              className="input-ms"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              maxLength={4}
            />
            {errors.cvv && <span className="error-text-ms">{errors.cvv}</span>}
          </div>
        </div>
        <button type="submit" className="button-ms w-full">
          Validar Pago
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;

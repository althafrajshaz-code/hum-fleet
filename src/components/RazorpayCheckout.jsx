import { useCallback } from 'react';

const API_BASE = 'https://server-ashen-beta.vercel.app';

export const useRazorpay = () => {
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = useCallback(async ({ amount, entityType, entityEmail, entityName, entityPhone, onSuccess, onError }) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      // 1. Create order on backend
      const orderData = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR', receipt: `rcpt_${Date.now()}` })
      }).then((t) => t.json());

      if (!orderData.success) {
        alert('Server error. Unable to create Razorpay order.');
        return;
      }

      // 2. Configure options
      const options = {
        key: 'rzp_test_placeholder_key_id', // Needs to match backend for tests
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'HUM Fleet',
        description: 'Secure Payment Transaction',
        image: 'https://i.ibb.co/3W6qW9z/hum-logo.png', // Optional logo
        order_id: orderData.order.id,
        handler: async function (response) {
          // 3. Verify payment on backend
          const verifyData = await fetch(`${API_BASE}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              entityType,
              entityEmail,
              amount
            })
          }).then((t) => t.json());

          if (verifyData.success) {
            if (onSuccess) onSuccess(verifyData);
          } else {
            alert('Payment verification failed! Please contact support.');
            if (onError) onError();
          }
        },
        prefill: {
          name: entityName || '',
          email: entityEmail || '',
          contact: entityPhone || '9999999999'
        },
        notes: {
          address: 'HUM Fleet Corporate Office'
        },
        theme: {
          color: '#3b82f6'
        }
      };

      // 4. Open Razorpay Interface
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert('Something went wrong during payment initialization.');
    }
  }, []);

  return { displayRazorpay };
};

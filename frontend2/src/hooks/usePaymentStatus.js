import { useState, useEffect } from 'react';
import { getTransactionStatus } from '../services/transactionService';

const usePaymentStatus = (orderCode, onPaymentSuccess, enabled = true) => {
  const [paymentStatus, setPaymentStatus] = useState('PENDING');

  useEffect(() => {
    if (!enabled || !orderCode) {
      return;
    }

    // Don't start polling if the status is already resolved
    if (paymentStatus === 'COMPLETED' || paymentStatus === 'FAILED') {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const data = await getTransactionStatus(orderCode);
        const newStatus = data.status; // Assuming the API returns { status: 'COMPLETED' | 'PENDING' | 'FAILED' }

        if (newStatus === 'COMPLETED') {
          setPaymentStatus('COMPLETED');
          clearInterval(intervalId);
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        } else if (newStatus === 'FAILED') {
          setPaymentStatus('FAILED');
          clearInterval(intervalId);
        } else {
          // Status is still PENDING, do nothing and let the interval continue.
          setPaymentStatus('PENDING');
        }
      } catch (error) {
        console.error('Failed to poll payment status:', error);
        setPaymentStatus('FAILED'); // Assume failure if polling fails
        clearInterval(intervalId);
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup function to clear the interval when the component unmounts
    // or when the dependencies (orderCode, enabled) change.
    return () => {
      clearInterval(intervalId);
    };

  }, [orderCode, onPaymentSuccess, enabled, paymentStatus]);

  return { paymentStatus };
};

export default usePaymentStatus;

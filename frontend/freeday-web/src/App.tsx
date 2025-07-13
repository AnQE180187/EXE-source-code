// import React from 'react'
import AppRouter from '@/routes/AppRouter'
import { useToast } from '@/components/common/useToast'
import ToastContainer from '@/components/common/ToastContainer'

function App() {
  const toast = useToast();
  // Đưa toast vào context toàn app nếu cần
  return <>
    <AppRouter />
    <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
  </>;
}

export default App

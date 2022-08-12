import ToastContainer from 'components/atoms/toast/ToastContainer';
import React, { useState, createContext, useCallback } from 'react';

export const ToastContext = createContext({
  addToast: (_: Toast) => {},
  removeToast: (_: number) => {},
});

export type ToastStatus = 'success' | 'error' | 'warning' | 'info';
export interface Toast {
  title: string;
  description?: string;
  status: ToastStatus;
  timeout?: number;
}

interface InternalToast extends Toast {
  id: number;
}

let toastId = 1;

const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<InternalToast[]>([]);

  const addToast = useCallback(
    (toast: Toast) => {
      setToasts((toasts) => [...toasts, { ...toast, id: toastId++ }]);
    },
    [setToasts]
  );

  const removeToast = useCallback(
    (id) => {
      setToasts((toasts) => toasts.filter((it) => it.id !== id));
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
      }}>
      <ToastContainer toasts={toasts} id={toastId} />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;

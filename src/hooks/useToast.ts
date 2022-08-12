import { ToastContext } from 'contexts/toastProvider';
import { useContext } from 'react';

export const useToast = () => {
  const toastHelpers = useContext(ToastContext);
  return toastHelpers;
};

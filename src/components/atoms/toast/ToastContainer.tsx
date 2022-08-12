import { ToastStatus, Toast } from 'contexts/toastProvider';
import { useToast } from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import {
  VscError,
  VscInfo,
  VscPass,
  VscWarning,
  VscClose,
} from 'react-icons/vsc';
import { IconBaseProps } from 'react-icons/lib';
import './toast.scss';

interface InternalToast extends Toast {
  id: number;
}

interface Props {
  toasts: InternalToast[];
  id: number;
}

interface ToastIconProps extends IconBaseProps {
  status: ToastStatus;
}

const ToastIcon: React.FC<ToastIconProps> = ({ status, ...rest }) => {
  switch (status) {
    case 'success':
      return <VscPass {...rest} />;
    case 'error':
      return <VscError {...rest} />;
    case 'warning':
      return <VscWarning {...rest} />;
    case 'info':
      return <VscInfo {...rest} />;
  }
};

const MyToast = ({ toast }: { toast: InternalToast }) => {
  const { removeToast } = useToast();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
    }, toast.timeout || 5000);
    return () => {
      clearInterval(timer);
    };
  }, [removeToast, toast]);

  useEffect(() => {
    if (fade) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 600);
      return () => {
        clearInterval(timer);
      };
    }
  }, [fade, removeToast, toast]);

  const getToastClass = () => {
    return `toast toast-${toast.status} fade-` + (fade ? 'out-down' : 'in-up');
  };

  return (
    <div key={toast.id} className={getToastClass()}>
      <VscClose
        className="toast-close-icon"
        size={20}
        onClick={() => {
          setFade(true);
        }}
      />
      <ToastIcon status={toast.status} className={'toast-icon'} size={30} />
      <div>
        <p className={'toast-title'}>{toast.title}</p>
        <p className={'toast-message'}>{toast.description}</p>
      </div>
    </div>
  );
};

const ToastContainer: React.FC<Props> = ({ toasts }) => {
  return (
    <>
      <div className="toast-wrapper">
        <div className={`toast-container fade-in-up`}>
          {toasts.map((toast) => (
            <MyToast key={toast.id} toast={toast} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ToastContainer;

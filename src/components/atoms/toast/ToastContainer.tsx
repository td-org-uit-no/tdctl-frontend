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
  if (status === 'success') {
    return <VscPass {...rest} />;
  } else if (status === 'error') {
    return <VscError {...rest} />;
  } else if (status === 'warning') {
    return <VscWarning {...rest} />;
  } else {
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
    return (
      `notification toast toast-${toast.status} fade-` + (fade ? 'out' : 'in')
    );
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
      <ToastIcon
        status={toast.status}
        className={'notification-icon'}
        size={30}
      />
      <div>
        <p className={'notification-title'}>{toast.title}</p>
        <p className={'notification-message'}>{toast.description}</p>
      </div>
    </div>
  );
};

const ToastContainer: React.FC<Props> = ({ toasts }) => {
  return (
    <>
      <div className={`notification-container fade-in`}>
        {toasts.map((toast) => (
          <MyToast key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
};

export default ToastContainer;

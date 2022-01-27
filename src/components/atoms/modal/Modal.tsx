import React from 'react';
import className from 'classnames';
import './modal.scss';

export const ModalContext = React.createContext<() => void>(() => {});

const Modal: React.FC<{ open: boolean; closeModal: () => void}> = ({
  open,
  closeModal,
  children,
}) => {
  const modalContent = className('modalContent', { open: open });
  return (
    <ModalContext.Provider value={closeModal}>
      <div className={modalContent}>{children}</div>
    </ModalContext.Provider>
  );
};

export default Modal;

import Icon from 'components/atoms/icons/icon';
import React, { HTMLProps, useEffect } from 'react';
import styles from './modal.module.scss';

export interface Props extends HTMLProps<HTMLDivElement> {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: number;
  minWidth?: number;
}

const Modal: React.FC<Props> = ({
  maxWidth,
  minWidth,
  title,
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    const winX = window.scrollX;
    const winY = window.scrollY;

    var scrollCallback = function () {
      window.scrollTo(winX, winY);
    };

    if (isOpen) {
      // lock scroll when modal is active
      window.addEventListener('scroll', scrollCallback);
    } else {
      // remove lock scroll when modal is closed
      window.removeEventListener('scroll', scrollCallback);
    }
    return () => window.removeEventListener('scroll', scrollCallback);
  }, [isOpen]);

  // support close on <esc>
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (!isOpen) {
    // avoid returning the parent div in the DOM
    return null;
  }

  return (
    <div>
      {isOpen && (
        <>
          <div className={styles.darkBG} onClick={onClose} />
          <div className={styles.centered}>
            <div
              className={styles.modal}
              style={{
                minWidth: minWidth ? minWidth + 'ch' : '',
                maxWidth: maxWidth ? maxWidth + 'ch' : '',
              }}>
              <div className={styles.modalHeader}>
                <div className={styles.headingBox}>
                  <h2>{title}</h2>
                </div>
                <div className={styles.closeBox}>
                  <div onClick={onClose} className={styles.closeBtn}>
                    <Icon type="times" size={1} />
                  </div>
                </div>
              </div>
              <div className={styles.modalContent}>{children}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;

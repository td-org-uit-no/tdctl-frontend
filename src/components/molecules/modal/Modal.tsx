import Icon from 'components/atoms/icons/icon';
import { HTMLProps, useEffect } from 'react';
import styles from './modal.module.scss';

export interface Props extends HTMLProps<HTMLDivElement> {
  title: string;
  setIsOpen: (_: boolean) => void;
  maxWidth?: number;
  minWidth?: number;
}

const Modal: React.FC<Props> = ({
  maxWidth,
  minWidth,
  title,
  setIsOpen,
  children,
}) => {
  // prevents user from scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    };
  }, []);
  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
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
              <div onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                <Icon type="times" size={1} />
              </div>
            </div>
          </div>
          <div className={styles.modalContent}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;

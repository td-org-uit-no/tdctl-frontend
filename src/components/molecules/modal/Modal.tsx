import { HTMLProps } from 'react';
import { GrClose } from 'react-icons/gr';
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
            <h2 className={styles.heading}>{title}</h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}>
            {/* TODO: Make this white and maybe use a different icon */}
            <GrClose />
          </button>
          <div className={styles.modalContent}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;

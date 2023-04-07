import React from 'react';
import styles from './confirmationBox.module.scss';
import Button from 'components/atoms/button/Button';

interface ConformationProps {
  title?: string;
  onDecline: () => void;
  onAccept: () => void;
  confirmText?: string;
  declineText?: string;
}

const ConfirmationBox: React.FC<ConformationProps> = ({
  title,
  onDecline,
  onAccept,
  confirmText,
  declineText,
}) => {
  return (
    <div className={styles.confirmWrapper}>
      <p>{title}</p>
      <Button version="secondary" onClick={onAccept}>
        {confirmText ?? 'Ja'}
      </Button>
      <Button version="secondary" onClick={onDecline}>
        {declineText ?? 'Nei'}
      </Button>
    </div>
  );
};

export default ConfirmationBox;

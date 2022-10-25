import React from 'react';
import styles from './confirmationBox.module.scss';
import Button from 'components/atoms/button/Button';

interface ConformationProps {
  title?: string;
  onDecline: () => void;
  onAccept: () => void;
}

const ConformationBox: React.FC<ConformationProps> = ({
  title,
  onDecline,
  onAccept,
}) => {
  return (
    <div className={styles.confirmWrapper}>
      <p>{title}</p>
      <Button version="secondary" onClick={onAccept}>
        Ja
      </Button>
      <Button version="secondary" onClick={onDecline}>
        Nei
      </Button>
    </div>
  );
};

export default ConformationBox;

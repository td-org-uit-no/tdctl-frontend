import React from 'react';
import styles from './toggleButton.module.scss';
interface Props {
  onChange: () => any;
  label: string;
  initValue?: boolean;
}
const ToggleButton: React.FC<Props> = ({ onChange, label, initValue }) => {
  return (
    <div className={styles.container}>
      <div className={styles.toggleContainer}>
        <label className={styles.switch}>
          <input
            checked={initValue}
            type="checkbox"
            className={styles.toggle}
            onChange={onChange}
          />
          <div className={styles.slider}></div>
        </label>
        <div className={styles.textContainer}>
          <p className={styles.text}>{label}</p>
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;

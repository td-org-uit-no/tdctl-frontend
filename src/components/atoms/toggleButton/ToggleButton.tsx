import React from 'react';
import styles from './toggleButton.module.scss';
interface Props {
  onChange: () => any;
  label: string;
}
const ToggleButton: React.FC<Props> = ({ onChange, label }) => {
  return (
    <div className={styles.toggleContainer}>
      <p className={styles.text}>{label}</p>
      <label className={styles.switch}>
        <input type="checkbox" className={styles.toggle} onChange={onChange} />
        <div className={styles.slider}></div>
      </label>
    </div>
  );
};

export default ToggleButton;

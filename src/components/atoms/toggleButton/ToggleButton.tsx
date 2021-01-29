import React from 'react';
import styles from './ToggleButton.module.scss';
interface Props {
  checked: boolean;
  onChange: () => any;
  label: string;
}
const ToggleButton: React.FC<Props> = ({ checked, onChange, label }) => {
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

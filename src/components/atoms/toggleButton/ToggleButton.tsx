import React from 'react';
import styles from './ToggleButton.module.scss';
interface Props {
  checked: boolean;
  onChange: () => any;
}
const ToggleButton: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" className={styles.toggle} onChange={onChange} />
      <div className={styles.slider}></div>
    </label>
  );
};

export default ToggleButton;

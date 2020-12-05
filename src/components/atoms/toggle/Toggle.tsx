import React from 'react';
import styles from './toggle.module.scss';
interface Props {
  checked: boolean;
  onChange: () => any;
}
const Toggle: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" className={styles.toggle} onChange={onChange} />
      <div className={styles.slider}></div>
    </label>
  );
};

export default Toggle;	

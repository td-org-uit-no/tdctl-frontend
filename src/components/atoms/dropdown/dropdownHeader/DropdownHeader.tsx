import React, { useState } from 'react';
import styles from './dropdownHeader.module.scss';
import Dropdown from 'components/atoms/dropdown/Dropdown';
import icon from 'assets/menu-icon.png';

interface Props {
  title: string;
}

const DropdownHeader: React.FC<Props> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.base} onClick={() => setExpanded(!expanded)}>
          <div className={styles.item2}>
            <p>{title}</p>
          </div>
          <div className={styles.item3}>
            <img
              alt="Logo"
              src={icon}
              style={{
                height: '20px',
                width: '30px',
              }}
            />
          </div>
        </div>
        <Dropdown expanded={expanded}>
            {children}
        </Dropdown>
      </div>
    </div>
  );
};
export default DropdownHeader;

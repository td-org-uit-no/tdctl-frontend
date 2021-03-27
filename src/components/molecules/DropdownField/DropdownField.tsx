import React, { useState } from 'react';
import styles from './dropdownField.module.scss';
import Dropdown from 'components/atoms/dropdown/Dropdown';
import TextField from 'components/atoms/textfield/Textfield';
import icon from 'assets/menu-icon.png';

interface Props {
  title: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DropdownField: React.FC<Props> = ({ title, label, name, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.base} onClick={() => setExpanded(!expanded)}>
          <p>{title}</p>
          <img
            alt="Logo"
            src={icon}
            style={{
              position: 'relative',
              left: '33%',
              height: '20px',
              width: '30px',
            }}
          />
        </div>
        <Dropdown expanded={expanded}>
          <div className={styles.expand}>
            <TextField
              name={name}
              maxWidth={40}
              label={label}
              onChange={onChange}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
export default DropdownField;

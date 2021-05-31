import React from 'react';
import styles from './dropdownField.module.scss';
import DropdownHeader from 'components/atoms/dropdown/dropdownHeader/DropdownHeader';
import TextField from 'components/atoms/textfield/Textfield';

interface Props {
  title: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DropdownField: React.FC<Props> = ({ title, label, name, onChange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <DropdownHeader title={title}>
          <div className={styles.item4}>
            <TextField
              name={name}
              maxWidth={40}
              label={label}
              onChange={onChange}
            />
          </div>
        </DropdownHeader>
      </div>
    </div>
  );
};
export default DropdownField;

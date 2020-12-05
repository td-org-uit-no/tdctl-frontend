import React, { InputHTMLAttributes } from 'react';
import styles from './textfield.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  maxWidth?: number;
  error?: string[] | undefined;
}

const TextField: React.FC<Props> = ({ error, maxWidth, label, ...rest }) => {
  if (label) {
    return (
      <div
        className={styles.fieldWrapper}
        style={{ maxWidth: maxWidth ? maxWidth + 'ch' : '' }}>
        <label>{label}</label>
        <input className={styles.textField} {...rest} />
        {error && <div>{error.map((error) => error)}</div>}
      </div>
    );
  }

  return <input className={styles.textfield} {...rest} />;
};

export default TextField;

import React, { InputHTMLAttributes } from 'react';
import styles from './textfield.module.scss';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  maxWidth?: number;
  minWidth?: number;
  error?: string[] | undefined;
}

const TextField: React.FC<Props> = ({
  error,
  maxWidth,
  minWidth,
  label,
  ...rest
}) => {
  if (label) {
    return (
      <div
        className={styles.fieldWrapper}
        style={{
          maxWidth: maxWidth ? maxWidth + 'ch' : '',
          minWidth: minWidth ? minWidth + 'ch' : '',
        }}>
        <label>{label}</label>
        <input className={styles.textField} {...rest} />
        {error && (
          <div>
            {error.map((err, index: number) =>
              error.length > 1 ? <li key={index}>{err}</li> : err
            )}
          </div>
        )}
      </div>
    );
  }

  return <input className={styles.textfield} {...rest} />;
};

export default TextField;

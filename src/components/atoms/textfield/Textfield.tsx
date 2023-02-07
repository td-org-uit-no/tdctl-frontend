import { InputHTMLAttributes, useState } from 'react';
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
  onChange,
  onBlur,
  onFocus,
  value,
  defaultValue,
  type,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [defaultInput, setDefaultInput] = useState(defaultValue);
  const styleLabel = () => {
    return (
      value || defaultInput || isFocused || type === 'date' || type === 'time'
    );
  };

  const getLabelStyle = () => {
    return styleLabel()
      ? `${styles.label} ${styles.styledLabel}`
      : styles.label;
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          style={{
            maxWidth: maxWidth ? maxWidth + 'ch' : '100%',
            minWidth: minWidth ? minWidth + 'ch' : '100%',
          }}
          className={styles.text}
          defaultValue={defaultValue}
          value={value}
          type={type}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onChange={(e) => {
            setDefaultInput(e.target.value);
            onChange && onChange(e);
          }}
          {...rest}
        />
        {label && <label className={getLabelStyle()}>{label}</label>}
      </div>
      {error && (
        <div className={styles.errors}>
          {error.map((err, index: number) =>
            error.length > 1 ? (
              <p key={index}>{err}</p>
            ) : (
              <p key={index}> {err}</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TextField;

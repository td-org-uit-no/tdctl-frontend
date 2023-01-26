import { TextareaHTMLAttributes } from 'react';
import { useState } from 'react';
import styles from './textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxWidth?: number;
  minWidth?: number;
  error?: string[] | undefined;
}

const Textarea: React.FC<TextareaProps> = ({
  error,
  maxWidth,
  minWidth,
  label,
  value,
  onChange,
  ...rest
}) => {
  const [input, setInput] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const getLabelStyle = () => {
    return !!input || isFocused
      ? `${styles.label} ${styles.styledLabel}`
      : styles.label;
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <textarea
          style={{
            maxWidth: maxWidth ? maxWidth + 'ch' : '',
            minWidth: minWidth ? minWidth + 'ch' : '',
          }}
          className={styles.text}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={(e) => {
            setInput(e.target.value);
            onChange && onChange(e);
          }}
          {...rest}
        />
      </div>

      {label && <label className={getLabelStyle()}>{label}</label>}

      {error && (
        <div className={styles.errors}>
          {error.map((err, index: number) =>
            error.length > 1 ? <li key={index}>{err}</li> : err
          )}
        </div>
      )}
    </div>
  );
};

export default Textarea;

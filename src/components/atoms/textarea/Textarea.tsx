import React, { TextareaHTMLAttributes } from 'react';
import styles from './textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxWidth?: number;
  error?: string[] | undefined;
}

const Textarea: React.FC<TextareaProps> = ({ error, maxWidth, label, ...rest }) => {
  if (label) {
    return (
      <div
        className={styles.areaWrapper}
        style={{ maxWidth: maxWidth ? maxWidth + 'ch' : '' }}>
        <label>{label}</label>
        <textarea className={styles.textarea} {...rest} />
        {error && <div>{error.map((err, index:number) => error.length > 1 ? <li key={index}>{err}</li> : err )}</div>}
      </div>
    );
  }

  return <textarea className={styles.textarea} {...rest} />;
};

export default Textarea;


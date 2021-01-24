import React, { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';
import styles from './button.module.scss';
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  version: 'primary' | 'secondary';
}
const Button: React.FC<Props> = ({ children, version, className, ...rest }) => {
  const classes = classnames(styles.btn, styles[version], className);

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;

import React, { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';
import './button.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  version: 'primary' | 'secondary';
}

const Button: React.FC<Props> = ({ children, version, className, ...rest }) => {
  const classes = classnames(version, className);

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;

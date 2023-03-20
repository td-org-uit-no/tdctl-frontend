import React, { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';
import './button.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  version: 'primary' | 'secondary';
}

const Button: React.FC<Props> = ({
  children,
  version,
  className,
  disabled,
  ...rest
}) => {
  const classes = disabled
    ? classnames(className)
    : classnames(version, className);

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;

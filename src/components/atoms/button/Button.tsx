import React, { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';
import './button.scss';
import { Link } from 'react-router-dom';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  version: 'primary' | 'secondary';
  href?: string;
}

const Button: React.FC<Props> = ({
  children,
  version,
  className,
  disabled,
  href,
  ...rest
}) => {
  const classes = disabled
    ? classnames(className)
    : classnames(version, className);

  if (href) {
    return (
      <Link to={href}>
        <button className={classes} disabled={disabled} {...rest}>
          {children}
        </button>
      </Link>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...rest}>
        {children}
      </button>
    );
  }
};

export default Button;

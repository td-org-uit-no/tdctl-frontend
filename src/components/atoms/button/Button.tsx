import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}
const Button: React.FC<Props> = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};

export default Button;

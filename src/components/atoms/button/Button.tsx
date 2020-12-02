import React from 'react';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}
const Button: React.FC<Props> = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};

export default Button;

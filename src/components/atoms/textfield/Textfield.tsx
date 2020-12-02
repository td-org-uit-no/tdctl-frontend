import React from 'react';

interface Props extends React.HTMLAttributes<HTMLInputElement> {}
const TextField: React.FC<Props> = ({ ...rest }) => {
  return <input {...rest} />;
};

export default TextField;

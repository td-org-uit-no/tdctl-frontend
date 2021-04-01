import React from 'react';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
  size?: number;
}

const Icon = ({ type, size = 1, onClick }: Props) => (
  <span
    className={`las la-${type}`}
    style={{ fontSize: `${size}rem` }}
    onClick={onClick}
  />
);
export default Icon;

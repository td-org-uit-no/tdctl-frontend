import React from 'react';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
  size?: number;
  color?: string;
  cursor?: string;
}

const Icon = ({
  type,
  size = 1,
  color = 'white',
  cursor = 'pointer',
  onClick,
}: Props) => (
  <span
    className={`las la-${type}`}
    style={{ fontSize: `${size}rem`, cursor: cursor, color: color }}
    onClick={onClick}
  />
);
export default Icon;
<p>Test</p>;

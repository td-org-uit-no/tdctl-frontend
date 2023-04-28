import React from 'react';
import { Link } from 'react-router-dom';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
  size?: number;
  color?: string;
  href?: string;
}

const Icon = ({ type, size = 1, color = 'white', onClick, href }: Props) => {
  if (href) {
    return (
      <Link to={href}>
        <span
          className={`las la-${type}`}
          style={{ fontSize: `${size}rem`, cursor: 'pointer', color: color }}
          onClick={onClick}
        />
      </Link>
    );
  } else {
    return (
      <span
        className={`las la-${type}`}
        style={{ fontSize: `${size}rem`, cursor: 'pointer', color: color }}
        onClick={onClick}
      />
    );
  }
};
export default Icon;
<p>Test</p>;

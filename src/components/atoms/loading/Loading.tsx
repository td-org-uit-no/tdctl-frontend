import React from 'react';
import './loading.scss';

// TODO add different types of loading animation
const Loading: React.FC = () => {
  return (
    <div className="ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;

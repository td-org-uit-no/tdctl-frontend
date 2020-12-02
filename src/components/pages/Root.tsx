import React from 'react';
import useTitle from '../../hooks/useTitle';

const RootPage = () => {
  useTitle('Tromsøstudentenes Dataforening');
  return (
    <div>
      <h1> TDCTL-FRONTEND</h1>
    </div>
  );
};

export default RootPage;

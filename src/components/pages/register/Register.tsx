import React from 'react';
import styles from './register.module.scss';
import useTitle from 'hooks/useTitle';
import RegistrerForm from 'components/molecules/Forms/RegisterForm/RegisterForm';

const RegistrerPage = () => {
  useTitle('Bli medlem - Tromsøstudentenes Dataforening');
  return (
    <div>
      <h1> Bli medlem!</h1>
      <div>
        <RegistrerForm />
      </div>
    </div>
  );
};

export default RegistrerPage;

import React from 'react';
import styles from './register.module.scss';
import useTitle from 'hooks/useTitle';
import { RegisterForm } from 'components/molecules/forms';

const RegistrerPage = () => {
  useTitle('Bli medlem - Tromsøstudentenes Dataforening');
  return (
    <div className={styles.registerPage}>
      <h1> Bli medlem!</h1>
      <div className={styles.registerForm}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegistrerPage;

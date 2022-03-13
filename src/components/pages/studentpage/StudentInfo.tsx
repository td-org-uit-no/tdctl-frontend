import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './studentInfo.module.scss';
import Button from 'components/atoms/button/Button';

const StudentInfoPage: React.FC = () => {

    const history = useHistory();

    const moveToRegisterPage = () => {
        history.push('/registrer');
        };

  return (
    <div className={styles.studentpage}>
        <h3>Ny Student</h3>
      <div className={styles.headerContainer}>
        <p>Tromsøstudentenes Dataforening ønsker deg velkommen. Her finner du informasjon..</p>
        <p>Som medlem av TD kan du gjennom semesteret delta på mye sosialt og faglig som vi arrangerer. Medlemskapet er gratis.</p>
      </div>
      <Button className='button-register' version={'primary'} onClick={moveToRegisterPage}>Bli Medlem</Button>
    </div>
  );
};

export default StudentInfoPage;

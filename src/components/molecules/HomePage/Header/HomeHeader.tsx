import React from 'react';
import Button from 'components/atoms/button/Button';
import logo from 'assets/td-full-logo.png';
import styles from './homeHeader.module.scss';
import { useHistory } from 'react-router-dom';

const HomeHeader = () => {
  const history = useHistory();

  const moveToLoginPage = () => {
    history.push('/login');
  };

  const moveToRegisterPage = () => {
    history.push('/registrer');
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerWrapper}>
        <div className={styles.imageContainer}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.buttonWrapper}>
          <Button version="primary" onClick={moveToLoginPage}>
            Logg inn
          </Button>
          <Button version="secondary" onClick={moveToRegisterPage}>
            Bli medlem
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;

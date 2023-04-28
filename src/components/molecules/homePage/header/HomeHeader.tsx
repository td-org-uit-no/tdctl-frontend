import { useContext } from 'react';
import Button from 'components/atoms/button/Button';
import logo from 'assets/td-full-logo.png';
import styles from './homeHeader.module.scss';
import { AuthenticateContext } from 'contexts/authProvider';

const HomeHeader = () => {
  const { authenticated } = useContext(AuthenticateContext);
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerWrapper}>
        <div className={styles.imageContainer}>
          <img src={logo} alt="" />
        </div>
        {!authenticated && (
          <div className={styles.buttonWrapper}>
            <Button version="primary" href="/login">
              Logg inn
            </Button>
            <Button version="secondary" href="/registrer">
              Bli medlem
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;

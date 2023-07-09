import { useContext } from 'react';
import { Button } from '@chakra-ui/react';
import logo from 'assets/td-full-logo.png';
import styles from './homeHeader.module.scss';
import { useHistory } from 'react-router-dom';
import { AuthenticateContext } from 'contexts/authProvider';

const HomeHeader = () => {
  const history = useHistory();
  const { authenticated } = useContext(AuthenticateContext);

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
        {!authenticated && (
          <div className={styles.buttonWrapper}>
            <Button variant="primary" onClick={moveToLoginPage}>
              Logg inn
            </Button>
            <Button variant="secondary" ml="1rem" onClick={moveToRegisterPage}>
              Bli medlem
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;

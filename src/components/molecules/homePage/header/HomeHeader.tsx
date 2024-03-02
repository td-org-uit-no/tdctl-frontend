import { useContext } from 'react';
import { Button } from '@chakra-ui/react';
import logo from 'assets/td-full-logo.png';
import styles from './homeHeader.module.scss';
import { useHistory } from 'react-router-dom';
import { AuthenticateContext } from 'contexts/authProvider';
import { useNavigateWithNewTab } from 'hooks/useNavigateWithNewTab';

const HomeHeader = () => {
  const history = useHistory();
  const navigate = useNavigateWithNewTab();
  const { authenticated } = useContext(AuthenticateContext);

  const moveToLoginPage = (event : React.MouseEvent<HTMLButtonElement>) => {
    navigate('/login', event);
  };

  const moveToRegisterPage = (event : React.MouseEvent<HTMLButtonElement>) => {
    navigate('/registrer', event);
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

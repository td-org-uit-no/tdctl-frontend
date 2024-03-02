import { useContext } from 'react';
import { Button } from '@chakra-ui/react';
import logo from 'assets/td-full-logo.png';
import styles from './homeHeader.module.scss';
import { AuthenticateContext } from 'contexts/authProvider';
import { Link as ReactRouterLink } from 'react-router-dom';

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
            <Button
              variant="primary"
              tabIndex={1}
              as={ReactRouterLink}
              to={'/login'}>
              Logg inn
            </Button>
            <Button
              variant="secondary"
              ml="1rem"
              tabIndex={2}
              as={ReactRouterLink}
              to={'/registrer'}>
              Bli medlem
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;

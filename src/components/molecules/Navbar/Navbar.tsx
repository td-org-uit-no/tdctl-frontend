import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Authenticated } from 'contexts';
import { logout } from 'utils/auth';
import styles from './navbar.module.scss';
import Menu, { MenuItem } from 'components/molecules/Menu/Menu';

const Navbar: React.FC = () => {
  const { authenticated, setAuthenticated } = useContext(Authenticated);

  const onLogout = async () => {
    try {
      await logout();
      setAuthenticated(false);
    } catch (errro) {
      if (errro.statusCode === 401) {
        /* Gracefully ignore it */
        console.log('401');
      }
    }
  };

  return (
    <div className={styles.navbar}>
      <Menu>
        {!authenticated && <MenuItem label={'Logg inn'} path={'/login'} />}
        {!authenticated && (
          <MenuItem label={'Bli medlem'} path={'/registrer'} />
        )}
        {authenticated && (
          <MenuItem label={'Logg ut'} path={'/'} onClick={onLogout} />
        )}
      </Menu>
    </div>
  );
};

export default Navbar;

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
      {authenticated ? (
        <Menu>
          <MenuItem label={'Home'} path={'/'} />
          <MenuItem label={'Profile'} path={'/profile'} />
          <MenuItem label={'Settings'} path={'/settings'} />
          <MenuItem label={'Logg ut'} path={'/'} onClick={onLogout} />
        </Menu>
      ) : (
        <Menu>
          <MenuItem label={'Logg inn'} path={'/login'} />
          <MenuItem label={'Bli medlem'} path={'/registrer'} />
        </Menu>
      )}
    </div>
  );
};

export default Navbar;

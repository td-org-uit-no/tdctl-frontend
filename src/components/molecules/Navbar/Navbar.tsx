import React, { useContext } from 'react';
import { AuthenticateContext } from 'contexts/authProvider';
import { logout } from 'utils/auth';
import styles from './navbar.module.scss';
import Menu, { MenuItem } from 'components/molecules/Menu/Menu';

const DefaultNavbar = () => {
  return (
    <Menu>
      <MenuItem label={'Login'} path={'/login'} />
      <MenuItem label={'Bli medlem'} path={'registrer'} />
    </Menu>
  );
};

const AuthNavbar = () => {
  const { setAuthenticated } = useContext(AuthenticateContext);
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
    <Menu>
      <MenuItem label={'Hjem'} path={'/'} />
      <MenuItem label={'Arrangement'} path={'/events'} />
      <MenuItem label={'Profil'} path={'/profile'} />
      <MenuItem label={'Endre profile'} path={'/settings'} />
      <MenuItem label={'Logg ut'} path={'/'} onClick={onLogout} />
    </Menu>
  );
};

const Navbar: React.FC = () => {
  const { authenticated } = useContext(AuthenticateContext);

  return (
    <div className={styles.navbar}>
      {authenticated ? <AuthNavbar /> : <DefaultNavbar />}
    </div>
  );
};

export default Navbar;

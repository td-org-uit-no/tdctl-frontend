import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import { logout } from 'api';
import styles from './navbar.module.scss';
import Menu, { MenuItem } from 'components/molecules/menu/Menu';
import logo from 'assets/td-logo.png';

const DefaultNavbar = () => {
  return (
    <Menu>
      <MenuItem label={'Login'} path={'/login'} />
      <MenuItem label={'Bli medlem'} path={'/registrer'} />
    </Menu>
  );
};

const AuthNavbar = () => {
  const { updateCredentials, role } = useContext(AuthenticateContext);
  const onLogout = async () => {
    try {
      await logout();
      updateCredentials();
    } catch (errro) {
      if (errro.statusCode === 401) {
        /* Gracefully ignore it */
      }
    }
  };

  return (
    <Menu>
      <MenuItem label={'Hjem'} path={'/'} />
      <MenuItem label={'Profil'} path={'/profile'} />
      <MenuItem label={'Arrangement oversikt'} path={'/eventoverview'} />
      <MenuItem label={'Stillingsutlysninger'} path={'/jobs'} />

      {role === Roles.admin && (
        <MenuItem label={'Opprett Arrangement'} path={'/create-event'} />
      )}
      {role === Roles.admin && <MenuItem label={'Admin'} path={'/admin'} />}
      <MenuItem label={'Logg ut'} path={'/'} onClick={onLogout} />
    </Menu>
  );
};

const Navbar: React.FC = () => {
  const { authenticated } = useContext(AuthenticateContext);
  const history = useHistory();

  const moveToHomePage = () => {
    history.push('/');
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" onClick={moveToHomePage} />
        </div>
      </div>
      <div className={styles.menuContainer}>
        {authenticated ? <AuthNavbar /> : <DefaultNavbar />}
      </div>
    </div>
  );
};

export default Navbar;

import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthenticateContext } from 'contexts/authProvider';
import { logout } from 'utils/auth';
import styles from './navbar.module.scss';
import Menu, { MenuItem } from 'components/molecules/Menu/Menu';
import logo from 'assets/td-logo.png';

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
  const history = useHistory();

  const moveToHomePage = () => {
    history.push('/');
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" onClick={moveToHomePage}/>          
        </div>
      </div>
      <div className={styles.menuContainer}>
        {authenticated ? <AuthNavbar /> : <DefaultNavbar />}
      </div>
    </div>
  );
};

export default Navbar;

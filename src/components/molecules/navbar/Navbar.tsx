import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import { logout } from 'api';
import styles from './navbar.module.scss';
import Menu, { MenuItem } from 'components/molecules/menu/Menu';
import logo from 'assets/td-logo.png';
import { Heading } from '@chakra-ui/react';

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
    } catch (error) {
      if (error.statusCode === 401) {
        /* Gracefully ignore it */
      }
    }
  };

  return (
    <Menu>
      <MenuItem label={'Hjem'} path={'/'} />
      <MenuItem label={'Profil'} path={'/profile'} />
      <MenuItem label={'Arrangementoversikt'} path={'/eventoverview'} />
      <MenuItem label={'Stillingsutlysninger'} path={'/jobs'} />
      {role === Roles.admin && (
        <MenuItem label={'Opprett Arrangement'} path={'/create-event'} />
      )}
      {role === Roles.admin && <MenuItem label={'Admin'} path={'/admin'} />}
      {role === Roles.admin && <MenuItem label={'Stats'} path={'/stats'} />}
      <MenuItem label={'Logg ut'} path={'/'} onClick={onLogout} />
    </Menu>
  );
};

interface NavLinkProps {
  to: string;
  children?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Heading
      size="sm"
      my={0}
      mr={{ base: '1em', md: '2em' }}
      _hover={{
        textDecoration: 'underline',
        textDecorationColor: 'red.td',
      }}>
      <Link to={to}>{children}</Link>
    </Heading>
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
        <NavLink to="/jobs">Karriere</NavLink>
        <NavLink to="/new-student">Ny Student</NavLink>
        {authenticated ? <AuthNavbar /> : <DefaultNavbar />}
      </div>
    </div>
  );
};

export default Navbar;

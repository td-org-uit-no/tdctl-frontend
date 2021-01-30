import React, { useContext } from 'react';
import { Authenticated } from 'contexts';
import styles from './navbar.module.scss';
import { Link } from 'react-router-dom';
import { logout } from './../../../utils/auth';

const Navbar: React.FC = () => {
  const { authenticated, setAuthenticated } = useContext(Authenticated);

  const _logout = async () => {
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
      {!authenticated && <Link to="/login"> Logg inn</Link>}
      {!authenticated && <Link to="/registrer">Registrer</Link>}
      {authenticated && (
        <Link to="/" onClick={_logout}>
          Logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;

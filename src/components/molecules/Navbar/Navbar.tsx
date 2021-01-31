import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Authenticated } from 'contexts';
import { logout } from 'utils/auth';
import styles from './navbar.module.scss';

const Navbar: React.FC = () => {
  const { authenticated, setAuthenticated } = useContext(Authenticated);

  const onLogout = async () => {
    try {
      await logout();
      setAuthenticated(false);
    } catch (errro) {
      console.log(errro);
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
        <Link to="/" onClick={onLogout}>
          Logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;

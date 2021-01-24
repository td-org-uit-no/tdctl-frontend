import React, { useContext } from 'react';
import { Authenticated } from 'contexts';
import styles from './navbar.module.scss';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { authenticated } = useContext(Authenticated);
  return (
    <div className={styles.navbar}>
      {!authenticated && <Link to="/login"> Logg inn</Link>}
    </div>
  );
};

export default Navbar;

import React, { useContext } from 'react';
import { Authenticated } from '../../../contexts';
import styles from './navbar.module.scss';

const Navbar: React.FC = () => {
  const { authenticated } = useContext(Authenticated);
  return (
    <div className={styles.navbar}>
      Hei. {authenticated ? 'Du er logget inn' : 'Du er ikke logget inn'}
    </div>
  );
};

export default Navbar;

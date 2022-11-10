import React from 'react';
import styles from './dropdown.module.scss';

interface Props {
  expanded: boolean;
}

const Dropdown: React.FC<Props> = ({ expanded, children }) => {
  return <div className={styles.container}>{expanded && children}</div>;
};
export default Dropdown;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './dropdownMenu.module.scss';
import Button from 'components/atoms/button/Button';
import Dropdown from 'components/atoms/dropdown/Dropdown';

interface Props {
  title: string;
  items: {
    label: string;
    url: string;
    asyncFunc?: () => Promise<void>;
  }[];
}
const DropdownMenu: React.FC<Props> = ({ items, title }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.menuContainer}>
      <Button version={'secondary'} onClick={() => setExpanded(!expanded)}>
        {title}
      </Button>
      <Dropdown expanded={expanded}>
        <nav className={styles.menu}>
          <ul>
            {items.map((item, index: number) => (
              <li key={index}>
                <Link to={item.url} onClick={item.asyncFunc}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Dropdown>
    </div>
  );
};

export default DropdownMenu;

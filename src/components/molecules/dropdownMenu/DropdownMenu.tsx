import React, { useState } from 'react';
import styles from './dropdownMenu.module.scss';
import Icon from 'components/atoms/icons/icon';

interface Items {
  items: {
    label: string;
    icon?: string;
    action: () => void;
  }[];
}
const DropdownMenu: React.FC<Items> = ({ items }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeElement, setActiveElement] = useState(items[0]);
  return (
    <div className={styles.menuWrapper}>
      <div
        className={styles.activeElement}
        onClick={() => setExpanded(!expanded)}>
        <div style={{ gap: '1rem', display: 'flex', alignItems: 'center' }}>
          {activeElement.icon && <Icon type={activeElement.icon}></Icon>}
          {activeElement.label}
        </div>
        <Icon type={expanded ? 'angle-up' : 'angle-down'} size={0.7}></Icon>
      </div>
      {expanded && (
        <div className={styles.menuList}>
          {items.map(
            (item, index: number) =>
              item.label !== activeElement.label && (
                <div
                  className={styles.menuListItem}
                  onClick={(e) => {
                    setExpanded(false);
                    setActiveElement(item);
                    item.action();
                  }}>
                  {item.icon && <Icon type={item.icon}></Icon>}
                  {item.label}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

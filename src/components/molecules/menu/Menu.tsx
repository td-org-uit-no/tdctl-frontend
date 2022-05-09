import React, { useContext, useState } from 'react';
import Icon from 'components/atoms/icons/icon';
import { Link } from 'react-router-dom';
import className from 'classnames';
import './menu.scss';

interface MenuIconProps {
  open: boolean;
  onClick: () => void;
}

const MenuIcon: React.FC<MenuIconProps> = ({ open, onClick }) => (
  <span className={'menu-icon'}>
    <Icon type={open ? 'times' : 'bars'} size={2.5} onClick={onClick} />
  </span>
);

interface MenuItemProps {
  label: string;
  path: string;
  onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  path,
  onClick = () => {},
}) => {
  const closeMenu = useContext(MenuContext);
  return (
    <li className="menu-item">
      <Link
        to={path}
        onClick={() => {
          onClick();
          closeMenu();
        }}>
        {label}
      </Link>
    </li>
  );
};

const MenuContext = React.createContext<() => void>(() => {});

const Menu: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const menuContent = className('menu-content', { open: open });

  return (
    <MenuContext.Provider value={() => setOpen(false)}>
      <MenuIcon open={open} onClick={() => setOpen(!open)} />
      <div className={menuContent}>
        <div>{children} </div>
      </div>
    </MenuContext.Provider>
  );
};

export default Menu;

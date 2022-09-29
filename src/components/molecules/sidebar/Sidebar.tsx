import react, { createContext } from 'react';
import Menu, {MenuItem} from '../menu/Menu';

// const SideBarContext = createContext<() => void>(() => {});
interface SideMenuItemProps {
  label: string
  component: any;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({ label, component }) => {
  return (
    <li></li>
  )
}

const SideMenu: React.FC = ( {children} ) => {
  return (
    <div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default SideMenu;

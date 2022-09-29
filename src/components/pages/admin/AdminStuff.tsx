import React, { useState } from 'react';
import styles from './adminPage.module.scss';
import AdminForm from 'components/molecules/admin/AdminForm';
import Icon from 'components/atoms/icons/icon';

const Test1 = () => {
  return <div>test1</div>;
};
type componentOptions = 'Members' | 'Events' | 'Announcments';

// TODO only allow componentOptions keys
interface componentsDict {
  [key: string]: JSX.Element;
}

interface ISideBarItem {
  label: string;
  iconType: string;
  onClick: () => void;
}

const SideBarItem: React.FC<ISideBarItem> = ({ label, iconType, onClick }) => {
  return (
    <div className={styles.navItem} onClick={onClick}>
      <div className={styles.iconBox}>
        <Icon type={iconType} size={2}></Icon>
      </div>
      <div className={styles.linkBox}>
        <p>{label}</p>
      </div>
    </div>
  );
};

const AdminStuff = () => {
  const components = {
    Members: <AdminForm />,
    events: <Test1 />,
    announcment: <Test1 />,
  } as componentsDict;

  const [componentKey, setComponentKey] = useState<componentOptions>('Members');

  return (
    <div className={styles.adminContent}>
      <div className={styles.side}>
        <SideBarItem
          onClick={() => setComponentKey('Members')}
          iconType="user"
          label="Members"
        />
        <SideBarItem
          onClick={() => setComponentKey('Events')}
          iconType="calendar"
          label="Events"
        />
      </div>
      <div className={styles.content}>
        <h4>{componentKey}</h4>
        <div>{components[componentKey]}</div>
      </div>
    </div>
  );
};

export default AdminStuff;

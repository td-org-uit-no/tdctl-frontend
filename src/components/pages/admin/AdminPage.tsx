import React, { useState } from 'react';
import styles from './adminPage.module.scss';
import { MemberTable, EventTable } from 'components/molecules/tables';
import Icon from 'components/atoms/icons/icon';

const WIP = () => {
  return (
    <div style={{ height: '10vh', textAlign: 'center' }}>
      {' '}
      <h2> Page coming </h2>{' '}
    </div>
  );
};
type componentOptions = 'Members' | 'Events' | 'Announcements';

// TODO only allow componentOptions keys
interface componentsDict {
  [key: string]: JSX.Element;
}

export interface ISideBarItem {
  label: string;
  iconType: string;
  onClick: () => void;
}

export const SideBarItem: React.FC<ISideBarItem> = ({
  label,
  iconType,
  onClick,
}) => {
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

const AdminPage = () => {
  const components = {
    Members: <MemberTable />,
    Events: <EventTable />,
    Announcements: <WIP />,
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
        <SideBarItem
          onClick={() => setComponentKey('Announcements')}
          iconType="bullhorn"
          label="Announcements"
        />
      </div>
      <div className={styles.content}>
        <div>
          <h4
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span>{componentKey}</span>
            {componentKey === 'Events' && (
              <span style={{ display: 'flex', flexDirection: 'row' }}>
                <p style={{ fontSize: '20px', margin: '0 8px' }}>
                  Active:{' '}
                  <Icon
                    type="calendar-check"
                    cursor="default"
                    color="green"
                    style={{ fontSize: '20px' }}
                  />
                </p>
                <p style={{ fontSize: '20px', margin: '0 8px' }}>
                  Upcoming:{' '}
                  <Icon
                    type="calendar-day"
                    cursor="default"
                    color="orange"
                    style={{ fontSize: '20px' }}
                  />
                </p>
                <p style={{ fontSize: '20px', margin: '0 8px' }}>
                  Inactive:{' '}
                  <Icon
                    type="calendar-times"
                    cursor="default"
                    color="red"
                    style={{ fontSize: '20px' }}
                  />
                </p>
              </span>
            )}
          </h4>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '5rem',
            justifyContent: 'space-between',
          }}>
          {components[componentKey]}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

import React, { useState, useEffect } from 'react';
import styles from './profile.module.scss';
import useTitle from 'hooks/useTitle';
import { PartialMember } from 'models/apiModels';
import { getMemberAssociatedWithToken } from 'utils/api';
import List from 'components/atoms/list/List';

const ProfilePage = () => {
  const [data, setData] = useState<PartialMember>();
  useTitle('Min profil');

  useEffect(() => {
    (async function getUserInfo() {
      const response = (await getMemberAssociatedWithToken()) as PartialMember;
      setData(response);
    })();
  }, []);
  return (
    <div className={styles.container}>
      <h1> Min Profil </h1>
      <div className={styles.menuContainer}>
        <div className={styles.info}>
          {data !== undefined && (
            <List
              items={[
                { lable: 'Navn', data: data['realName'] },
                { lable: 'E-post', data: data['email'] },
                { lable: 'Mobil', data: data['phone'] ?? '' },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useState, useEffect } from 'react';
import styles from './profile.module.scss';
import useTitle from 'hooks/useTitle';
import { PartialMember } from 'models/apiModels';
import { getMemberAssociatedWithToken } from 'api';

const ProfilePage = () => {
  const [data, setData] = useState<PartialMember>();
  useTitle('Min profil');

  useEffect(() => {
    (async function getUserInfo() {
      const response = (await getMemberAssociatedWithToken()) as PartialMember;
      setData(response);
    })();
  }, []);
  const items = [
    { lable: 'Navn', data: data?.realName },
    { lable: 'E-post', data: data?.email },
    ...(data?.phone ? [{lable: 'Mobil', data: data.phone}] : []),
    { lable: 'Årskull', data: data?.classof ?? '' },
  ];
  return (
    <div className={styles.container}>
      <h1> Min Profil </h1>
      <div className={styles.menuContainer}>
        <div className={styles.info}>
          {data !== undefined && (
            <div className={styles.list}>
              <ul>
                {items.map((item, index: number) => (
                  <li key={index}>
                    <p>
                      {item.lable} : {item.data}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

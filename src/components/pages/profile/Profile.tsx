import { useState, useEffect } from 'react';
import styles from './profile.module.scss';
import useTitle from 'hooks/useTitle';
import { Member, PartialMember } from 'models/apiModels';
import { getMemberAssociatedWithToken,sendNewVerificationEmail } from 'api';
import Button from 'components/atoms/button/Button';

const ProfilePage = () => {
  const [data, setData] = useState<Member>();
  useTitle('Min profil');

  useEffect(() => {
    (async function getUserInfo() {
      const response = (await getMemberAssociatedWithToken()) as Member;
      setData(response);
    })();
  }, []);
  
  const items = [
    { lable: 'Navn', data: data?.realName },
    { lable: 'E-post', data: data?.email },
    ...(data?.phone ? [{ lable: 'Mobil', data: data.phone }] : []),
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
      {data?.role == "unconfirmed" &&
        <div>
          <p>
            Seems like you have not verified your user, please click on the verification link sent to your email address
          </p>
          <Button version='secondary' onClick={async () => { await sendNewVerificationEmail(data.email)}}>
            Click here to get new verification email.
          </Button>
        </div>
      }
    </div>
  );
};

export default ProfilePage;

import { useState, useEffect } from 'react';
import styles from './settings.module.scss';
import { getMemberAssociatedWithToken, activateUser } from 'api';
import { SettingsForm } from 'components/molecules/forms';
import PasswordValidation from 'components/molecules/passwordValidation/PasswordValidation';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import DropDownHeader from 'components/atoms/dropdown/dropdownHeader/DropdownHeader';
import { useToast } from 'hooks/useToast';

const SettingsPage = () => {
  const [init, setInit] = useState<{ [key: string]: string } | undefined>(
    undefined
  );
  const [active, setActive] = useState('inactive');
  const { addToast } = useToast();

  const getUserInfo = async () => {
    const response = await getMemberAssociatedWithToken();
    const initalValues = {
      name: response.realName ?? '',
      email: response.email ?? '',
      classof: response.classof ?? '',
      phone: response.phone ?? '',
    };
    setInit(initalValues);
    setActive(response.status);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const activate = async () => {
    try {
      await activateUser();
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Brukeren er aktivert',
      });
      setActive('active');
    } catch (error) {
      addToast({
        title: 'Feil under aktiveringen av brukeren',
        status: 'error',
      });
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsBox}>
        <h1>Endre profil</h1>
        {init !== undefined && <SettingsForm init={init} />}
        <PasswordValidation />
        {active !== 'active' && (
          <DropDownHeader title={'Aktiver bruker'}>
            <div className={styles.activateContainer}>
              <ToggleButton label={'Aktiver bruker'} onChange={activate} />
            </div>
          </DropDownHeader>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

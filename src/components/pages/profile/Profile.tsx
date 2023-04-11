import { useState, useEffect, useContext } from 'react';
import styles from './profile.module.scss';
import {
  getMemberAssociatedWithToken,
  activateUser,
  sendNewVerificationEmail,
} from 'api';
import { SettingsForm } from 'components/molecules/forms';
import PasswordValidation from 'components/molecules/passwordValidation/PasswordValidation';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import DropDownHeader from 'components/atoms/dropdown/dropdownHeader/DropdownHeader';
import { useToast } from 'hooks/useToast';
import { ToastStatus } from 'contexts/toastProvider';
import { changePassword } from 'api';
import { ChangePasswordPayload } from 'models/apiModels';
import { useHistory } from 'react-router-dom';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import Button from 'components/atoms/button/Button';

const SettingsPage = () => {
  const [init, setInit] = useState<{ [key: string]: string } | undefined>(
    undefined
  );
  const [active, setActive] = useState('inactive');
  const { addToast } = useToast();
  const { role } = useContext(AuthenticateContext);
  const history = useHistory();

  const updatePassword = async (passwordPayload: ChangePasswordPayload) => {
    try {
      await changePassword(passwordPayload);
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Passordet er oppdatert',
      });
      history.push('/');
    } catch (error) {
      if (error.statusCode === 403) {
        addToast({
          status: 'error',
          title: 'Feil passord',
        });
      }
      if (error.statusCode === 400) {
        addToast({
          status: 'error',
          title: 'Passordet oppfyller ikke kravene',
        });
        return;
      }
    }
  };
  const getUserInfo = async () => {
    try {
      const response = await getMemberAssociatedWithToken();
      const initalValues = {
        name: response.realName ?? '',
        email: response.email ?? '',
        classof: response.classof ?? '',
        phone: response.phone ?? '',
      };
      setInit(initalValues);
      setActive(response.status);
    } catch (error) {
      console.log(error);
    }
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

  const sendConfirmationCode = async () => {
    let title = 'Email bekreftet';
    let status: ToastStatus = 'success';
    let description = '';
    try {
      if (init !== undefined) {
        await sendNewVerificationEmail(init.email);
        description = `Ny bekreftelsekode er sendt til ${init.email}`;
      }
    } catch (error) {
      if (error.statusCode === 400) {
        title = 'Emailen er allerede bekreftet';
        status = 'error';
      } else {
        title = 'En uforutsett feil';
        status = 'error';
      }
    }
    addToast({
      title: title,
      status: status,
      description: description,
    });
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsBox}>
        <h1>Profil</h1>
        {init !== undefined && <SettingsForm init={init} />}
        <DropDownHeader title={'Endre passord'}>
          <div className={styles.updatePasswordContainer}>
            <PasswordValidation upstreamFunction={updatePassword} />
          </div>
        </DropDownHeader>
        {active !== 'active' && (
          <DropDownHeader title={'Aktiver bruker'}>
            <div className={styles.activateContainer}>
              <ToggleButton label={'Aktiver bruker'} onChange={activate} />
            </div>
          </DropDownHeader>
        )}
        {role === Roles.unconfirmed && (
          <DropDownHeader title={'Aktiver email'}>
            <div className={styles.activateContainer}>
              <Button version="secondary" onClick={sendConfirmationCode}>
                {' '}
                Send ny bekreftelse link{' '}
              </Button>
            </div>
          </DropDownHeader>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

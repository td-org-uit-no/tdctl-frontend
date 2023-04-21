import { useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from 'contexts/authProvider';
import { registerAttendence } from 'api';
import styles from './EventRegisterPage.module.scss';
import { useParams } from 'react-router-dom';
import { useToast } from 'hooks/useToast';
import { LoginForm } from 'components/molecules/forms';

const EventRegisterPage = () => {
  const { authenticated } = useContext(AuthenticateContext);
  const [response, setResponse] = useState<string>('Registrerer oppmøte...');
  const { rid } = useParams<{ rid: string }>();

  const { addToast } = useToast();

  useEffect(() => {
    /* Send registration request */
    const register = async (rid: string) => {
      try {
        await registerAttendence(rid);
        setResponse('Du er nå registrert! God fornøyelse!');
        addToast({
          title: 'Suksess',
          status: 'success',
          description: 'Oppmøte registrert.',
        });
      } catch (error) {
        setResponse('Auda! Noe gitt galt...');
      }
    };
    if (authenticated && rid) {
      register(rid);
    }
  }, [authenticated, rid]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentWrapper}>
        <h3>Oppmøteregistrering</h3>
        {!authenticated ? (
          <>
            <div className={styles.loginWrapper}>
              <div className={styles.login}>
                <LoginForm shouldRedirect={false} shouldRegister={false} />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.registerResponse}>{response}</div>
        )}
      </div>
    </div>
  );
};

export default EventRegisterPage;

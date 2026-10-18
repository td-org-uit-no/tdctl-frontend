import { useContext, useState } from 'react';
import useForm from 'hooks/useForm';
import { login, sendNewVerificationEmail } from 'api';
import { Button } from '@chakra-ui/react';
import TextField from 'components/atoms/textfield/Textfield';
import { Link, useHistory, useLocation } from 'react-router-dom';
import './loginForm.scss';
import { AuthenticateContext } from 'contexts/authProvider';

interface LocationState {
  from: { pathname: string };
}

/* shouldRegister determines whether 'bli medlem' will render */
export interface LoginFormProps {
  shouldRedirect?: boolean;
  shouldRegister?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  shouldRedirect = true,
  shouldRegister = true,
}) => {
  const { updateCredentials } = useContext(AuthenticateContext);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const history = useHistory();
  const location = useLocation<LocationState | null>();

  const moveToRegisterPage = () => {
    history.push('/registrer');
  };

  const resendConfirmation = async () => {
    try {
      await sendNewVerificationEmail(fields['email']?.value ?? '');
    } catch {
      // the endpoint answers the same way for every address
    }
    setResendSent(true);
  };

  const onSubmit = async () => {
    try {
      if (!fields['email']?.value || !fields['password']?.value) {
        setError('Du må fylle ut e-post og passord');
        return;
      }

      await login(fields['email'].value, fields['password'].value);
      updateCredentials();
      if (shouldRedirect) {
        history.push(location.state?.from.pathname ?? '/');
      }
    } catch (error) {
      // Unauthorized
      if (error.statusCode === 401) {
        setError('E-post eller passord er feil. Prøv igjen.');
        return;
      }
      // invalid email as password has no validation at input
      if (error.statusCode === 422) {
        setError('E-posten er ikke på riktig format');
        return;
      }
      // the API throttles repeated attempts from one caller or for one account
      if (error.statusCode === 429) {
        setError('For mange forsøk. Vent litt og prøv igjen.');
        return;
      }
      // the account exists, but the e-mail address has not been confirmed yet
      if (error.statusCode === 403) {
        setCanResend(true);
        setError(
          'E-posten er ikke bekreftet. Sjekk innboksen din for bekreftelseslenken.'
        );
        return;
      }
      setError('En ukjent feil skjedde.');
    }
  };

  const { fields, onFieldChange, onSubmitEvent } = useForm({
    onSubmit: onSubmit,
  });

  return (
    <form onSubmit={onSubmitEvent}>
      <div className="loginFormContainer">
        <TextField name={'email'} label={'E-post'} onChange={onFieldChange} />
        <div className="passwordContainer">
          <TextField
            name={'password'}
            label={'Passord'}
            type={'password'}
            onChange={onFieldChange}
          />
          <Link to={'restore-password'}>Glemt passord?</Link>
          {error !== '' && <p style={{ margin: 0 }}>{error}</p>}
          {canResend && !resendSent && (
            <Button variant={'secondary'} onClick={resendConfirmation}>
              Send ny bekreftelses-e-post
            </Button>
          )}
          {resendSent && (
            <p style={{ margin: 0 }}>Ny bekreftelses-e-post er sendt.</p>
          )}
        </div>
        <div className="buttonContainer">
          <Button variant={'primary'} type="submit">
            Logg inn
          </Button>
          {shouldRegister && (
            <Button
              variant={'secondary'}
              onClick={moveToRegisterPage}
              style={{ margin: '0 0 0 1rem' }}>
              Bli medlem
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

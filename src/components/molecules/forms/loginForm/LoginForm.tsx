import { useContext, useState } from 'react';
import useForm from 'hooks/useForm';
import { login } from 'api';
import Button from 'components/atoms/button/Button';
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
  const history = useHistory();
  const location = useLocation<LocationState | null>();

  const moveToRegisterPage = () => {
    history.push('/registrer');
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
        </div>
        <div className="buttonContainer">
          <Button version={'primary'} type="submit">
            Logg inn
          </Button>
          {shouldRegister && (
            <Button
              version={'secondary'}
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

import { useContext, useState } from 'react';
import useForm from 'hooks/useForm';
import { login } from 'api';
import { Button, IconButton } from '@chakra-ui/react';
import TextField from 'components/atoms/textfield/Textfield';
import { Link, useHistory, useLocation } from 'react-router-dom';
import './loginForm.scss';
import { AuthenticateContext } from 'contexts/authProvider';

interface LocationState {
  from: { pathname: string };
}

export interface LoginFormProps {
  shouldRedirect?: boolean;
  shouldRegister?: boolean;
}

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LoginForm: React.FC<LoginFormProps> = ({
  shouldRedirect = true,
  shouldRegister = true,
}) => {
  const { updateCredentials } = useContext(AuthenticateContext);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      if (error.statusCode === 401) {
        setError('E-post eller passord er feil. Prøv igjen.');
        return;
      }
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={onSubmitEvent}>
      <div className="loginFormContainer">
        <TextField name={'email'} label={'E-post'} onChange={onFieldChange} />
        
        <div className="passwordContainer">
          <div className="passwordInputWrapper">
            <TextField
              name={'password'}
              label={'Passord'}
              type={showPassword ? 'text' : 'password'}
              onChange={onFieldChange}
            />
            <IconButton
              size="sm"
              variant="ghost"
              onClick={togglePasswordVisibility}
              type="button"
              aria-label={showPassword ? 'Skjul passord' : 'Vis passord'}
              icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
              className="passwordToggle"
            />
          </div>
          <Link to={'restore-password'}>Glemt passord?</Link>
        </div>

        {error !== '' && (
          <p className="errorMessage" role="alert">
            {error}
          </p>
        )}

        <div className="buttonContainer">
          <Button variant={'primary'} type="submit">
            Logg inn
          </Button>
          {shouldRegister && (
            <Button
              variant={'secondary'}
              onClick={moveToRegisterPage}
              type="button"
              style={{ margin: '0 0 0 1rem' }}
            >
              Bli medlem
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
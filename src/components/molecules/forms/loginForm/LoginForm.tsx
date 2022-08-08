import { useContext, useState } from 'react';
import { AuthenticateContext } from 'contexts/authProvider';
import useForm from 'hooks/useForm';
import { login } from 'api';
import Button from 'components/atoms/button/Button';
import TextField from 'components/atoms/textfield/Textfield';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  from: { pathname: string };
}

const LoginForm = () => {
  const { updateCredentials } = useContext(AuthenticateContext);
  const [error, setError] = useState('');
  const history = useHistory();
  const location = useLocation<LocationState | null>();

  const onSubmit = async () => {
    try {
      if (!fields['email']?.value || !fields['password']?.value) {
        setError('Du må fylle ut e-post og passord');
        return;
      }

      await login(fields['email'].value, fields['password'].value);
      updateCredentials();
      history.push(location.state?.from.pathname ?? '/');
    } catch (error) {
      // Unauthorized
      if (error.statusCode === 401) {
        setError('E-post eller passord er feil. Prøv igjen.');
      } else {
        // TODO: 422 Unprocessable entity
        setError('En ukjent feil skjedde.');
      }
    }
  };

  const { fields, onFieldChange, onSubmitEvent } = useForm({onSubmit: onSubmit});

  return (
    <form onSubmit={onSubmitEvent}>
      <TextField
        name={'email'}
        minWidth={30}
        maxWidth={45}
        label={'E-post'}
        onChange={onFieldChange}
      />

      <TextField
        name={'password'}
        minWidth={30}
        maxWidth={45}
        label={'Passord'}
        type={'password'}
        onChange={onFieldChange}
      />
      {error !== '' && <p>{error}</p>}
      <Button version={'primary'} type="submit">
        Logg inn
      </Button>
    </form>
  );
};

export default LoginForm;

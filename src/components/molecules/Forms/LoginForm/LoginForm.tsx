import React, { useContext } from 'react';
import { Authenticated } from '../../../../contexts';
import useForm from '../../../../hooks/useForm';
import { login } from '../../../../utils/auth';
import Button from '../../../atoms/button/Button';
import TextField from '../../../atoms/textfield/Textfield';

const LoginForm = () => {
  const { setAuthenticated } = useContext(Authenticated);

  const onSubmit = async () => {
    try {
      await login(fields['email'].value, fields['password'].value);
      setAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const { fields, onFieldChange, onSubmitEvent } = useForm(onSubmit);

  return (
    <form onSubmit={onSubmitEvent}>
      <TextField
        name={'email'}
        maxWidth={40}
        label={'E-post'}
        onChange={onFieldChange}
      />

      <TextField
        name={'password'}
        maxWidth={40}
        label={'Passord'}
        type={'password'}
        onChange={onFieldChange}
      />

      <Button type="submit">Logg inn</Button>
    </form>
  );
};

export default LoginForm;

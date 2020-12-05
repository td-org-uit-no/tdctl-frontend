import React from 'react';
import useForm from '../../../../hooks/useForm';
import Button from '../../../atoms/button/Button';
import TextField from '../../../atoms/textfield/Textfield';

const LoginForm = () => {
  const onSubmit = () => {
    console.log(fields['email']);
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

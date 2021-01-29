import React, { useState, useContext } from 'react';
import useForm from 'hooks/useForm';
import {
  nameValidator,
  passwordValidator,
  emailValidator,
  phoneValidator,
  classOfValidator,
} from 'utils/validators';
import TextField from 'components/atoms/textfield/Textfield';
import Button from 'components/atoms/button/Button';
import { registerMember } from './../../../../utils/api';
import { PartialMember } from './../../../../models/apiModels';
import ToggleButton from './../../../atoms/toggleButton/ToggleButton';
import { createBrowserHistory } from 'history';
import { Authenticated } from 'contexts';
import { login } from 'utils/auth';

const RegisterForm = () => {
  const { setAuthenticated } = useContext(Authenticated);
  const [errors, setErrors] = useState(false);
  const [msg, setMsg] = useState('Alle feltene må fylles ut');
  const [graduated, setGraduated] = useState(false);

  const validators = {
    name: nameValidator,
    email: emailValidator,
    password: passwordValidator,
    classof: classOfValidator,
    phone: phoneValidator,
  };

  const onSubmit = async () => {
    let _error = false;
    const keys = Object.keys(fields);
    keys.forEach((key) => {
      if (!fields[key].value.length){
        _error = true;
        return;
      }
    });
    setErrors(_error);
    if (hasErrors || _error) {
      return;
    }

    let value = {
      realName: fields['name'].value,
      email: fields['email'].value,
      password: fields['password'].value,
      classof: fields['classof'].value,
      graduated: graduated,
      phone: fields['phone'].value,
    } as PartialMember;

    try {
      await registerMember(value);
    } catch (error) {
      switch (error.statusCode) {
        case 422:
          console.log('422 error');
          setMsg('Alle feltene må fylles ut');
          setErrors(error);
          break;

        case 409:
          console.log('422 error');
          setMsg('Epost er allerede i bruk');
          setErrors(error);
          break;

        case 400:
          console.log('422 error');
          setMsg('Passordet må oppfylle alle kravene');
          setErrors(error);
          break;
      }
    }
    try {
      await login(fields['email'].value, fields['password'].value);
      setAuthenticated(true);
    } catch (error) {
      // Unauthorized
      if (error.statusCode === 401) {
        setMsg('E-post eller passord er feil. Prøv igjen.');
      } else {
        // TODO: 422 Unprocessable entity
        setMsg('En ukjent feil skjedde.');
      }
    }

    const history = createBrowserHistory();
    history.push('/');
  };

  const { fields, onFieldChange, onSubmitEvent, hasErrors } = useForm(
    onSubmit,
    validators
  );

  return (
    <form onSubmit={onSubmitEvent}>
      <TextField
        name={'name'}
        maxWidth={40}
        label={'Navn'}
        onChange={onFieldChange}
      />
      {fields['name'].error !== undefined && <p>{fields['name'].error}</p>}

      <TextField
        name={'email'}
        type="email"
        maxWidth={40}
        label={'E-post'}
        onChange={onFieldChange}
      />
      {fields['email'].error !== undefined && <p>{fields['email'].error}</p>}

      <TextField
        name={'password'}
        type="password"
        maxWidth={40}
        label={'Passord'}
        onChange={onFieldChange}
      />
      {fields['password'].error !== undefined && (
        <ul>
          {' '}
          {fields['password'].error.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      <TextField
        name={'classof'}
        type="number"
        maxWidth={40}
        label={'Årskull'}
        onChange={onFieldChange}
      />

      <TextField
        name={'phone'}
        type="number"
        maxWidth={40}
        label={'Telefon'}
        onChange={onFieldChange}
      />
      {fields['phone'].error !== undefined && <p>{fields['phone'].error}</p>}

      <ToggleButton
        checked={graduated}
        onChange={() => setGraduated(!graduated)}
        label={'Graduated'}
      />

      {errors && <p>{msg}</p>}

      <Button version={'primary'} type="submit">
        Registrer
      </Button>
    </form>
  );
};

export default RegisterForm;

import { useState, useContext } from 'react';
import useForm from 'hooks/useForm';
import { AuthenticateContext } from 'contexts/authProvider';
import { login, registerMember } from 'api';
import {
  nameValidator,
  emailValidator,
  passwordValidator,
  classOfValidator,
  notRequiredPhoneValidator,
  emptyFieldsValidator,
} from 'utils/validators';
import Button from 'components/atoms/button/Button';
import TextField from 'components/atoms/textfield/Textfield';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import { useHistory } from 'react-router-dom';
import { useToast } from 'hooks/useToast';

const RegisterForm = () => {
  const { setAuthenticated } = useContext(AuthenticateContext);
  const [errors, setErrors] = useState<string | undefined>(undefined);
  const [graduated, setGraduated] = useState(false);
  const history = useHistory();
  const { addToast } = useToast();

  //easier if we want more optional keys
  const optionalKeys = ['phone'];
  const validators = {
    name: nameValidator,
    email: emailValidator,
    password: passwordValidator,
    classof: classOfValidator,
    phone: notRequiredPhoneValidator,
  };

  const onSubmit = async () => {
    // Check that all fields are filled
    const emptyFields = emptyFieldsValidator({
      fields: fields,
      optFields: optionalKeys,
    });

    emptyFields ? setErrors('Alle feltene må fylles ut') : setErrors(undefined);

    if (hasErrors || emptyFields) {
      return;
    }

    try {
      const validationCode = await registerMember({
        realName: fields['name'].value,
        email: fields['email'].value,
        password: fields['password'].value,
        classof: fields['classof'].value,
        graduated: graduated,
        phone: fields['phone'].value,
      });
      console.log(validationCode);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          setFieldError('password', fields['password'].value, [
            'Passordet må oppfylle alle kravene',
          ]);
          return;
        case 409:
          setFieldError('email', fields['email'].value, [
            'Epost er allerede i bruk',
          ]);
          return;
        case 422:
          setErrors('Alle feltene må fylles ut');
          return;
        default:
          setErrors('Noe gikk galt');
          return;
      }
    }
    try {
      await login(fields['email'].value, fields['password'].value);
      setAuthenticated(true);
      history.push('/');
      addToast({
        title: 'Success',
        status: 'success',
        description: 'Du er registrert som bruker',
      });
    } catch (error) {
      // Unauthorized
      if (error.statusCode === 401) {
        setErrors('E-post eller passord er feil. Prøv igjen.');
      } else {
        // TODO: 422 Unprocessable entity
        history.push('/login');
        setErrors('En ukjent feil skjedde.');
      }
    }
  };

  const onGraduateToggle = () => setGraduated(!graduated);

  const { fields, onFieldChange, onSubmitEvent, hasErrors, setFieldError } =
    useForm({ onSubmit: onSubmit, validators: validators });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={onSubmitEvent}>
        <TextField
          name={'name'}
          maxWidth={60}
          minWidth={40}
          label={'Navn'}
          onChange={onFieldChange}
          error={fields['name'].error}
        />
        <br />
        <TextField
          name={'email'}
          type="email"
          maxWidth={60}
          minWidth={40}
          label={'E-post'}
          onChange={onFieldChange}
          error={fields['email'].error}
        />
        <br />

        <TextField
          name={'password'}
          type="password"
          maxWidth={60}
          minWidth={40}
          label={'Passord'}
          onChange={onFieldChange}
          error={fields['password'].error}
        />
        <br />

        <TextField
          name={'classof'}
          type="number"
          maxWidth={60}
          minWidth={40}
          label={'Årskull'}
          onChange={onFieldChange}
        />
        <br />

        <TextField
          name={'phone'}
          type="number"
          maxWidth={60}
          minWidth={40}
          label={'Telefon'}
          onChange={onFieldChange}
        />
        <br />
      </form>
      <div>
        {fields['phone'].error !== undefined && <p>{fields['phone'].error}</p>}
        <ToggleButton onChange={onGraduateToggle} label={'Graduated'} />
        {errors && <p>{errors}</p>}

        <Button version={'primary'} onClick={onSubmit} type="submit">
          Registrer
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;

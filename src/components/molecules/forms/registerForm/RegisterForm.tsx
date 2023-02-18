import { useState, useContext } from 'react';
import './registerForm.scss';
import useForm from 'hooks/useForm';
import { AuthenticateContext } from 'contexts/authProvider';
import { login, registerMember } from 'api';
import {
  nameValidator,
  lastNameValidator,
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
    lastname: lastNameValidator,
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
        realName: fields['name'].value + ' ' + fields['lastname'].value,
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
        title: 'Suksess',
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
    <div className="contnet">
      <form onSubmit={onSubmitEvent}>
        <TextField
          name={'name'}
          minWidth={40}
          label={'Fornavn'}
          onChange={onFieldChange}
          error={fields['name'].error}
        />
        <TextField
          name={'lastname'}
          minWidth={40}
          label={'Etternavn'}
          onChange={onFieldChange}
          error={fields['lastname'].error}
        />
        <TextField
          name={'email'}
          type="email"
          minWidth={40}
          label={'E-post'}
          onChange={onFieldChange}
          error={fields['email'].error}
        />
        <TextField
          name={'password'}
          type="password"
          minWidth={40}
          label={'Passord'}
          onChange={onFieldChange}
          error={fields['password'].error}
        />
        {/* type = text as firefox for some reason does not support type=number so the validators must handle the number validations */}
        <TextField
          name={'classof'}
          type="text"
          minWidth={40}
          label={'Studiestart'}
          onChange={onFieldChange}
          error={fields['classof'].error}
        />
        <TextField
          name={'phone'}
          type="text"
          minWidth={40}
          label={'Telefon'}
          onChange={onFieldChange}
          error={fields['phone'].error}
        />
      </form>
      <div>
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

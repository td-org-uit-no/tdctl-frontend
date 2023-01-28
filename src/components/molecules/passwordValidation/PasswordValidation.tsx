import { useState } from 'react';
import styles from './passwordValidation.module.scss';
import DropDownHeader from 'components/atoms/dropdown/dropdownHeader/DropdownHeader';
import Button from 'components/atoms/button/Button';
import TextField from 'components/atoms/textfield/Textfield';
import useForm from 'hooks/useForm';
import { passwordValidator } from 'utils/validators';
import { changePassword } from 'api';
import { useHistory } from 'react-router-dom';
import { useToast } from 'hooks/useToast';

const PasswordValidation = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const history = useHistory();
  const validators = {
    newPassword: passwordValidator,
  };
  const { addToast } = useToast();
  const submit = async () => {
    if (hasErrors) {
      return;
    }
    const isNotFilled = Object.keys(fields).filter(
      (key) => !fields[key].value.length
    ).length;

    isNotFilled ? setError('Begge feltene må fylles ut') : setError(undefined);

    // pasword has no validation therefore it can be uninitialized
    if (isNotFilled || !fields['password']) {
      setError('Begge feltene må fylles ut');
      return;
    }

    if (fields['password']?.value === fields['newPassword']?.value) {
      setError('Det gamle og nye passordet kan ikke være likt');
      return;
    }

    const passwordPayload = {
      password: fields['password'].value,
      newPassword: fields['newPassword'].value,
    };

    try {
      await changePassword(passwordPayload);
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Passordet er oppdatert',
      });
      history.push('/');
    } catch (error) {
      if (error.statusCode === 403) {
        setFieldError('password', fields['password'].value, ['Feil passord']);
        return;
      }
      if (error.statusCode === 400) {
        setFieldError('newPassword', fields['newPassword'].value, [
          'Passordet oppfyller ikke kravene',
        ]);
        return;
      }
    }
  };

  const { fields, onFieldChange, setFieldError, hasErrors } = useForm({
    onSubmit: submit,
    validators: validators,
  });

  return (
    <DropDownHeader title={'Endre passord'}>
      <div className={styles.info}>
        <TextField
          name={'password'}
          minWidth={40}
          type="password"
          label={'Passord'}
          value={fields['password']?.value ?? ''}
          error={fields['password']?.error}
          onChange={onFieldChange}
        />
        <br />
        <TextField
          name={'newPassword'}
          minWidth={40}
          type="password"
          label={'Nytt passord'}
          value={fields['newPassword']?.value ?? ''}
          error={fields['newPassword']?.error}
          onChange={onFieldChange}
        />
        {error !== undefined && <p>{error}</p>}
        <Button
          className={styles.submitButton}
          version="secondary"
          onClick={submit}>
          Submit
        </Button>
      </div>
    </DropDownHeader>
  );
};

export default PasswordValidation;

import { useState, useEffect } from 'react';
import styles from './passwordValidation.module.scss';
import DropDownHeader from 'components/atoms/dropdown/dropdownHeader/DropdownHeader';
import Button from 'components/atoms/button/Button';
import TextField from 'components/atoms/textfield/Textfield';
import useForm from 'hooks/useForm';
import { passwordValidator } from 'utils/validators';
import { changePassword } from 'api';
import { useHistory } from 'react-router-dom';
import { useToast } from 'hooks/useToast';
import { ChangePasswordPayload } from 'models/apiModels';

interface IPasswordValidation{
  upstreamFunction: (payload:ChangePasswordPayload) => void, 
  errorMsg: string | undefined
}

const PasswordValidation : React.FC<IPasswordValidation> = ({upstreamFunction}) => {
  const [errors, setError] = useState<string | undefined>(undefined);
  const history = useHistory();
  const validators = {
    newPassword: passwordValidator,
  };
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

    //Caller has to handle errors thrown by input function
    upstreamFunction(passwordPayload)

  };

  const { fields, onFieldChange, hasErrors } = useForm({
    onSubmit: submit,
    validators: validators,
  });

  return (
      <div className={styles.info}>
        <TextField
          name={'password'}
          maxWidth={40}
          type="password"
          label={'Passord'}
          value={fields['password']?.value ?? ''}
          error={fields['password']?.error}
          onChange={onFieldChange}
        />
        <br />
        <TextField
          name={'newPassword'}
          maxWidth={40}
          type="password"
          label={'Nytt passord'}
          value={fields['newPassword']?.value ?? ''}
          error={fields['newPassword']?.error}
          onChange={onFieldChange}
        />
        {errors !== undefined && <p>{errors}</p>}
        <Button
          className={styles.submitButton}
          version="secondary"
          onClick={submit}
          >
          Submit
        </Button>
      </div>
  );
};

export default PasswordValidation;

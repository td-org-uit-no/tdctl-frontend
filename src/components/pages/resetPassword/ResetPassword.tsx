import { useHistory, useParams } from 'react-router-dom';
import TextField from 'components/atoms/textfield/Textfield';
import Button from 'components/atoms/button/Button';
import { useToast } from 'hooks/useToast';
import { ToastStatus } from 'contexts/toastProvider';
import './resetPassword.scss';
import useForm from 'hooks/useForm';
import { passwordValidator } from 'utils/validators';
import { resetPassword } from 'api';
import useTitle from 'hooks/useTitle';

const ResetPasswordPage: React.FC = () => {
  const { resetPasswordCode } = useParams<{ resetPasswordCode: string }>();
  const { addToast } = useToast();
  const history = useHistory();

  const validators = {
    password: passwordValidator,
  };
  useTitle('Tromsøstudentenes-Dataforening');

  const onSubmit = async () => {
    var status: ToastStatus = 'success';
    var title: string = 'Your password has been reset';
    if (hasErrors) {
      return;
    }

    if (fields['password'].value !== fields['confirmPassword'].value) {
      addToast({
        status: 'error',
        title: 'Passordene er ikke like',
      });
      return;
    }

    try {
      await resetPassword(resetPasswordCode, fields['password'].value);
    } catch (error) {
      if (error.statusCode === 404) {
        addToast({
          status: 'error',
          title: 'Reset password token not valid or expired',
          description: 'Please provide email again',
        });
        //Redirect user to restore password page so that they can provide email again.
        history.push('/restore-password');
        return;
      }
      //This should never happen
      if (error.statusCode === 400) {
        addToast({
          status: 'error',
          title: 'Password not valid',
          description: 'Please provide a valid password',
        });
        return;
      }
    }
    //Comunicate to the user that the email is sent using a toast.
    addToast({ status: status, title: title });
    //Redirect the user to the homepage
    history.push('/login');
  };

  const { fields, onFieldChange, onSubmitEvent, hasErrors } = useForm({
    onSubmit: onSubmit,
    validators: validators,
  });

  return (
    <div className="resetPassword-container">
      <form onSubmit={onSubmitEvent}>
        <p>Provide a new password for your user</p>
        <br />
        <TextField
          name={'password'}
          minWidth={40}
          maxWidth={45}
          label={'Password'}
          type={'password'}
          onChange={onFieldChange}
          error={fields['password']?.error}
          value={fields['password']?.value ?? ''}
        />
        <TextField
          name={'confirmPassword'}
          minWidth={40}
          maxWidth={45}
          label={'Retype new password'}
          type={'password'}
          onChange={onFieldChange}
        />
        <br />
        <Button version={'primary'} type="submit">
          Reset passord
        </Button>
      </form>
    </div>
  );
};
export default ResetPasswordPage;

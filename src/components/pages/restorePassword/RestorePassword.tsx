import { useHistory } from 'react-router-dom';
import TextField from 'components/atoms/textfield/Textfield';
import Button from 'components/atoms/button/Button';
import { useToast } from 'hooks/useToast';
import { ToastStatus } from 'contexts/toastProvider';
import './restorePassword.scss';
import useForm from 'hooks/useForm';
import { sendRestorePasswordEmail } from 'api';
import useTitle from 'hooks/useTitle';

const RestorePasswordPage: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();

  useTitle('Tromsøstudentenes-Dataforening');

  const onSubmit = async () => {
    var status: ToastStatus = 'success';
    var title: string =
      'An Email has been sent to the email provided\n if it matches with one of our users';

    try {
      await sendRestorePasswordEmail(fields['email']?.value);
    } catch (error: any) {
      if (error.statusCode === 500) {
        status = 'error';
        title = 'Something went wrong when sending the email, please try again';
      } else if (error.statusCode === 504) {
        status = 'error';
        title = 'Could not send email, Connection timed out.';
      }
      //If email is not found, we don't want to notify the user because of security issues.
    }

    //Comunicate to the user that the email is sent using a toast.
    addToast({ status: status, title: title });
    //Redirect the user to the homepage
    history.push('/');
  };

  const { fields, onFieldChange, onSubmitEvent } = useForm({
    onSubmit: onSubmit,
  });

  return (
    <div className="restorePassword-container">
      <form onSubmit={onSubmitEvent}>
        <p>Skriv inn Emailen din.</p>
        <br />
        <TextField
          name={'email'}
          minWidth={30}
          maxWidth={45}
          label={'E-post'}
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
export default RestorePasswordPage;

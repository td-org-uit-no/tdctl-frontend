import { confirmMember } from 'api';
import { useToast } from 'hooks/useToast';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const ConfirmationPage: React.FC = () => {
  const { confirmationCode } = useParams<{ confirmationCode: string }>();
  const { addToast } = useToast();
  const history = useHistory();

  const confirm = async function () {
    try {
      await confirmMember(confirmationCode);
      addToast({ status: 'success', title: 'User confirmed' });
    } catch (error) {
      addToast({ status: 'error', title: 'Confirmation code not found' });
    }
    history.push('/');
  };
  useEffect(() => {
    confirm();
  }, []);

  return <></>;
};
export default ConfirmationPage;

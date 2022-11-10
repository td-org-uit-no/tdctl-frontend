import React, {
  useState,
  useEffect,
  useContext,
  ButtonHTMLAttributes,
} from 'react';
import Button from 'components/atoms/button/Button';
import { AuthenticateContext } from 'contexts/authProvider';
import { joinEvent, leaveEvent, isJoinedEvent } from 'api';
import { useHistory, useLocation } from 'react-router-dom';
import { useToast } from 'hooks/useToast';

interface ButtonAction {
  [key: string]: (eid: string) => Promise<{ max: boolean } | string>;
}

interface AuthButtonProps extends EventButtonProps {
  joined: boolean;
}

const AuthEventButton: React.FC<AuthButtonProps> = ({
  joined,
  id,
  onClick,
  ...rest
}) => {
  const [isJoined, setIsjoined] = useState<boolean>(joined);
  const [buttonText, setButtonText] = useState('');
  const { addToast } = useToast();

  const buttonAction: ButtonAction = {
    true: leaveEvent,
    false: joinEvent,
  };

  const handleButtonAction = async () => {
    try {
      const res = await buttonAction[`${isJoined}`](id);
      setIsjoined(!isJoined);
      if (onClick) {
        try {
          onClick();
        } catch (error) {
          // caller must handle the error
          throw error;
        }
      }
      if (typeof res !== 'string' && res.max) {
        addToast({
          title: 'Info',
          status: 'info',
          description: 'Arrangementet er fullt, du er satt på venteliste',
        });
        return;
      }
      addToast({
        title: 'Suksess',
        status: 'success',
        description: isJoined ? 'Avmeldt' : 'Påmeldt',
      });
    } catch (error) {
      // TODO add toasts
      console.log(error);
      switch (error.statusCode) {
        case 400:
          console.log(400);
          break;
        case 404:
          console.log(404);
          break;
        default:
          console.log(error.statusCode);
      }
    }
  };

  useEffect(() => {
    const updateText = () => {
      const text = isJoined ? 'Meld av!' : 'Bli med!';
      setButtonText(text);
    };

    updateText();
  }, [isJoined]);

  return (
    <div>
      <Button version="secondary" onClick={handleButtonAction} {...rest}>
        {' '}
        {buttonText}{' '}
      </Button>
    </div>
  );
};

const AuthButton: React.FC<EventButtonProps> = ({ id, onClick, ...rest }) => {
  const [isJoined, setIsJoined] = useState<boolean | undefined>();

  useEffect(() => {
    const checkIsJoined = async () => {
      try {
        const response = await isJoinedEvent(id);
        setIsJoined(response.joined);
      } catch (error) {
        setIsJoined(false);
      }
    };

    checkIsJoined();
  }, [id]);

  return (
    <div>
      {isJoined !== undefined && (
        <AuthEventButton
          joined={isJoined}
          id={id}
          onClick={onClick}
          {...rest}
        />
      )}
    </div>
  );
};

const DefaultButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ...rest
}) => {
  const history = useHistory();
  const location = useLocation();

  const login = async () => {
    history.push('/login', { from: location });
  };

  return (
    <div>
      <Button version="secondary" onClick={login} {...rest}>
        {' '}
        Bli med!{' '}
      </Button>
    </div>
  );
};

interface EventButtonTypeProps extends EventButtonProps {
  authenticated: boolean;
}

const JoinOrLeaveButton: React.FC<EventButtonTypeProps> = ({
  authenticated,
  id,
  onClick,
  ...rest
}) => {
  return (
    <div>
      {authenticated ? (
        <AuthButton id={id} onClick={onClick} {...rest} />
      ) : (
        <DefaultButton {...rest} />
      )}
    </div>
  );
};

interface EventButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  onClick?: () => void;
}

const EventButton: React.FC<EventButtonProps> = ({ id, onClick, ...rest }) => {
  const { authenticated, isValidating } = useContext(AuthenticateContext);

  return (
    <div>
      {!isValidating && (
        <JoinOrLeaveButton
          authenticated={authenticated}
          id={id}
          onClick={onClick}
          {...rest}
        />
      )}
    </div>
  );
};

export default EventButton;

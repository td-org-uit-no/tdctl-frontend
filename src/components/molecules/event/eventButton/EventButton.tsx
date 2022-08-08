import React, { useState, useEffect, useContext } from 'react';
import Button from 'components/atoms/button/Button';
import { AuthenticateContext } from 'contexts/authProvider';
import { joinEvent, leaveEvent, isJoinedEvent } from 'api';
import { useHistory, useLocation } from 'react-router-dom';

interface ButtonAction {
  [key: string]: (eid: string) => Promise<{}>;
}

const AuthEventButton: React.FC<{ joined: boolean; id: string }> = ({
  joined,
  id,
}) => {
  const [isJoined, setIsjoined] = useState(joined);
  const [buttonText, setButtonText] = useState('');

  const updateText = () => {
    const text = isJoined ? 'Meld av!' : 'Bli med!';
    setButtonText(text);
  };

  const buttonAction: ButtonAction = {
    true: leaveEvent,
    false: joinEvent,
  };

  const handleButtonAction = async () => {
    try {
      await buttonAction[`${isJoined}`](id);
      setIsjoined(!isJoined);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          console.log(400);
          break;
        case 404:
          console.log(404);
      }
    }
  };

  useEffect(() => {
    updateText();
  }, [isJoined]);

  return (
    <div>
      <Button version="secondary" onClick={handleButtonAction}>
        {' '}
        {buttonText}{' '}
      </Button>
    </div>
  );
};

const AuthButton: React.FC<{ id: string }> = ({ id }) => {
  const [isJoined, setIsJoined] = useState<boolean | undefined>();

  const checkIsJoined = async () => {
    try {
      const response = await isJoinedEvent(id);
      setIsJoined(response.joined);
    } catch (error) {
      setIsJoined(false);
    }
  };

  useEffect(() => {
    checkIsJoined();
  }, []);

  return (
    <div>
      {isJoined !== undefined && <AuthEventButton joined={isJoined} id={id} />}
    </div>
  );
};

const DefaultButton = () => {
  const history = useHistory();
  const location = useLocation();

  const login = async () => {
    history.push('/login', { from: location });
  };

  return (
    <div>
      <Button version="secondary" onClick={login}>
        {' '}
        Bli med!{' '}
      </Button>
    </div>
  );
};

const JoinOrLeaveButton: React.FC<{ authenticated: boolean; id: string }> = ({
  authenticated,
  id,
}) => {
  return (
    <div>{authenticated ? <AuthButton id={id} /> : <DefaultButton />}</div>
  );
};

const EventButton: React.FC<{ id: string }> = ({ id }) => {
  const { authenticated, isValidating } = useContext(AuthenticateContext);

  return (
    <div>
      {!isValidating && (
        <JoinOrLeaveButton authenticated={authenticated} id={id} />
      )}
    </div>
  );
};

export default EventButton;

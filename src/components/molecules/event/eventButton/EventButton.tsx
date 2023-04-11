import React, {
  useState,
  useEffect,
  useContext,
  ButtonHTMLAttributes,
} from 'react';
import Button from 'components/atoms/button/Button';
import { AuthenticateContext } from 'contexts/authProvider';
import { joinEvent, leaveEvent, isJoinedEvent, getEventById } from 'api';
import { useHistory, useLocation } from 'react-router-dom';
import { useToast } from 'hooks/useToast';
import { JoinEventPayload } from 'models/apiModels';
import { Event } from 'models/apiModels';
import styles from './eventButton.module.scss';
import Modal from 'components/molecules/modal/Modal';
import useModal from 'hooks/useModal';
import EventPreferences from '../eventPreferences/EventPreferences';

interface AuthButtonProps extends EventButtonProps {
  joined: boolean;
}

const valid_cancellation = (start_date: Date) => {
  const threshold = 24; // in hours
  const today = new Date();
  // convert diff from milliseconds to hours
  return Math.abs(start_date.getTime() - today.getTime()) / 36e5 > threshold;
};

const AuthEventButton: React.FC<AuthButtonProps> = ({
  joined,
  id,
  onClick,
  ...rest
}) => {
  const [isJoined, setIsjoined] = useState<boolean>(joined);
  const [buttonText, setButtonText] = useState('');
  const [event, setEvent] = useState<Event>();
  const [isValidCancellation, setValidCancellation] = useState<boolean>(true);
  const [joinEventPayload, setJoinEventPayload] = useState<JoinEventPayload>({
    food: false,
    transportation: false,
    dietaryRestrictions: '',
  });
  const { addToast } = useToast();
  const { isOpen, onOpen, onClose } = useModal();
  const {
    isOpen: preferencesOpen,
    onOpen: openPreferences,
    onClose: closePreferences,
  } = useModal();

  const leaveEventAction = async () => {
    try {
      if (!isOpen) {
        onOpen();
        setValidCancellation(valid_cancellation(new Date(event?.date!!)));
        return;
      }
      await leaveEvent(id);
      setIsjoined(!isJoined);
      onClose();
      setValidCancellation(false);
      if (onClick) {
        try {
          onClick();
        } catch (error) {
          // caller must handle the error
          throw error;
        }
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

  const joinEventAction = async () => {
    try {
      await joinEvent(id, joinEventPayload);

      setIsjoined(!isJoined);
      closePreferences();
      if (onClick) {
        try {
          onClick();
        } catch (error) {
          // caller must handle the error
          throw error;
        }
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

  /* Set payload on form change */
  const handlePrefsChange = (prefs: JoinEventPayload) => {
    setJoinEventPayload(prefs);
  };

  const handleButtonAction = () => {
    if (!isJoined) {
      !preferencesOpen && (event?.transportation || event?.food)
        ? openPreferences()
        : joinEventAction();
      return;
    } else {
      leaveEventAction();
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventById(id);
      setEvent(event);
    };
    fetchEvent();

    const updateText = () => {
      const text = isJoined ? 'Meld av!' : 'Bli med!';
      setButtonText(text);
    };

    updateText();
  }, [isJoined, id]);

  return (
    <div>
      {!preferencesOpen && (
        <Button version="secondary" onClick={handleButtonAction} {...rest}>
          {' '}
          {buttonText}
        </Button>
      )}
      <Modal
        title="Er du sikker på at vil melde deg av?"
        isOpen={isOpen}
        onClose={onClose}
        minWidth={25}>
        <div className={styles.cancellationWrapper}>
          <div className={styles.cancellationMessageContainer}>
            {isValidCancellation ? (
              <p>Hvis du melder deg av vil du miste plassen din i køen!</p>
            ) : (
              <p>
                Arrangementet begynner om under 24 timer, og avmelding så nærme
                arrangement start vil medføre{' '}
                <u
                  style={{
                    textDecorationColor: '#b73653',
                    textDecorationThickness: '.2rem',
                  }}>
                  {' '}
                  en merknad hvis du har mottat bekreftelse om plass
                </u>
                . To eller flere merknader vil gi nedsatt prioritet på andre
                arrangementer ut semesteret. Har du gyldig grunn ta kontakt med{' '}
                <a href="mailto:">{event?.host ?? 'kontakt@td-uit.no'}</a>
              </p>
            )}
          </div>
          <Button version="secondary" onClick={leaveEventAction}>
            {' '}
            Bekreft{' '}
          </Button>
        </div>
      </Modal>

      <Modal
        title={'Påmelding'}
        isOpen={preferencesOpen}
        onClose={closePreferences}
        maxWidth={100}>
        <div className={styles.formContent}>
          <EventPreferences
            prefs={joinEventPayload}
            isfood={event?.food}
            istransportation={event?.transportation}
            changePrefs={handlePrefsChange}
          />
          <Button version="secondary" onClick={joinEventAction}>
            Meld på
          </Button>
        </div>
      </Modal>
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
        Bli med!
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

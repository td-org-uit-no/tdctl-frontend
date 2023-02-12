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
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import styles from './eventButton.module.scss';
import Modal from 'components/molecules/modal/Modal';
import TextField from 'components/atoms/textfield/Textfield';

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
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [event, setEvent] = useState<Event>();
  const [lateCancellation, setLateCancellation] = useState<boolean>(false);
  const [showAllergies, setShowAllergies] = useState<boolean>(false);
  const [joinEventPayload, setJoinEventPayload] = useState<JoinEventPayload>({
    food: false,
    transportation: false,
    dietaryRestrictions: '',
  });

  useEffect(() => {
    if (!showForm) {
      setShowAllergies(false);
    }
  }, [showForm]);

  const leaveEventAction = async () => {
    try {
      if (!lateCancellation && !valid_cancellation(new Date(event?.date!!))) {
        setLateCancellation(true);
        return;
      }
      await leaveEvent(id);
      setIsjoined(!isJoined);
      setLateCancellation(false);
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
      const res = await joinEvent(id, joinEventPayload);

      setIsjoined(!isJoined);
      setShowForm(false);
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

  const handleButtonAction = () => {
    if (!isJoined) {
      !showForm && (event?.transportation || event?.food)
        ? setShowForm(true)
        : joinEventAction();
      return;
    } else {
      leaveEventAction();
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventById(id, true);
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
      {!showForm && (
        <Button version="secondary" onClick={handleButtonAction} {...rest}>
          {' '}
          {buttonText}
        </Button>
      )}
      {lateCancellation && (
        <Modal
          title="Er du sikker på at vil melde deg av?"
          minWidth={25}
          setIsOpen={setLateCancellation}>
          <div className={styles.cancellationWrapper}>
            <div className={styles.cancellationMessageContainer}>
              <p>
                Arrangementet begynner om under 24 timer, og avmelding så nærme
                arrangement start vil medføre en merknad. 2 eller flere
                merknader vil gi nedsatt prioritet på andre arrangementer ut
                semesteret. Har du gyldig grunn ta kontakt med{' '}
                <a href="mailto:">{event?.host ?? 'post.td.uit.no'}</a>
              </p>
            </div>
            <Button version="secondary" onClick={leaveEventAction}>
              {' '}
              Bekreft{' '}
            </Button>
          </div>
        </Modal>
      )}
      {showForm && (
        <Modal maxWidth={100} title={'Påmelding'} setIsOpen={setShowForm}>
          <div className={styles.formContent}>
            <div className={styles.formToggles}>
              {event?.food && (
                <>
                  <ToggleButton
                    label={'Vil du ha mat på arragementet?'}
                    onChange={() =>
                      setJoinEventPayload({
                        ...joinEventPayload,
                        food: !joinEventPayload.food,
                      })
                    }></ToggleButton>
                  <ToggleButton
                    label={'Har du en allergi/matpreferanse?'}
                    onChange={() => {
                      if (showAllergies) {
                        setJoinEventPayload({
                          ...joinEventPayload,
                          dietaryRestrictions: '',
                        });
                        setShowAllergies(false);
                      } else {
                        setShowAllergies(true);
                      }
                    }}></ToggleButton>
                  {showAllergies && (
                    <div className={styles.allergyTextFieldContainer}>
                      <div className={styles.allergyTextFieldAnim}>
                        <TextField
                          label={'Allergier, vegetar, vegansk...'}
                          onChange={(e) => {
                            setJoinEventPayload({
                              ...joinEventPayload,
                              dietaryRestrictions: e.target.value,
                            });
                          }}></TextField>
                      </div>
                    </div>
                  )}
                </>
              )}
              {event?.transportation && (
                <>
                  <ToggleButton
                    label={'Har du behov for transport?'}
                    onChange={() =>
                      setJoinEventPayload({
                        ...joinEventPayload,
                        transportation: !joinEventPayload.transportation,
                      })
                    }></ToggleButton>
                </>
              )}
            </div>

            <Button version="secondary" onClick={joinEventAction}>
              Meld på
            </Button>
          </div>
        </Modal>
      )}
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

import React, { useContext, useEffect, useState } from 'react';
import styles from './myEventCard.module.scss';
import { Event, JoinEventPayload } from 'models/apiModels';
import EventHeader from '../eventHeader/EventHeader';
import Icon from 'components/atoms/icons/icon';
import { Link } from 'react-router-dom';
import {
  getEventOptions,
  updateEventOptions,
  isConfirmedEvent,
  getJoinedParticipants,
  getMemberAssociatedWithToken,
} from 'api';
import { AuthenticateContext } from 'contexts/authProvider';
import Button from 'components/atoms/button/Button';
import EventPreferences from '../eventPreferences/EventPreferences';
import useModal from 'hooks/useModal';
import Modal from 'components/molecules/modal/Modal';
import { useToast } from 'hooks/useToast';
import { transformDate } from 'utils/timeConverter';
import classNames from 'classnames';

const NA = () => {
  return <span className={styles.NA}>N/A</span>;
};

interface SpotStatus {
  message: string;
  color: 'success' | 'warning' | 'error';
}

/* Pill component to display confirmation status */
const StatusPill: React.FC<SpotStatus> = ({ message, color }) => {
  const classes = classNames(`${styles[color]}`, styles.status);
  return <div className={classes}>{message}</div>;
};

export interface MyEventCardProps {
  eventData: Event;
}

const MyEventCard: React.FC<MyEventCardProps> = ({ eventData }) => {
  /* Options pulled from backend */
  const [options, setOptions] = useState<JoinEventPayload>({
    food: false,
    transportation: false,
    dietaryRestrictions: '',
  });
  /* Payload to send */
  const [editPrefsPayload, setEditPrefsPayload] = useState<JoinEventPayload>({
    food: false,
    transportation: false,
    dietaryRestrictions: '',
  });

  /* Predefined statuses */
  const confStatus: SpotStatus = {
    message: 'Bekreftet',
    color: 'success',
  };
  const unConfStatus: SpotStatus = {
    message: 'Ubekreftet',
    color: 'warning',
  };
  const noSpotStatus: SpotStatus = {
    message: 'Ikke plass',
    color: 'error',
  };
  /* Event confirmation status */
  const [spotStatus, setSpotStatus] = useState<SpotStatus>(unConfStatus);

  const { authenticated } = useContext(AuthenticateContext);
  const { addToast } = useToast();

  const {
    isOpen: preferencesOpen,
    onOpen: openPreferences,
    onClose: closePreferences,
  } = useModal();

  /* Fetch event options from backend */
  const fetchOptions = async () => {
    try {
      /* Get data from backend */
      const data = await getEventOptions(eventData.eid);
      /* Insert into useState */
      setOptions(data);
      setEditPrefsPayload(data);
    } catch (error) {
      addToast({
        title: 'Feilmelding',
        status: 'error',
        description: 'Noe gikk galt.',
      });
    }
  };

  /* Check whether user is confirmed spot */
  const checkSpotStatus = async () => {
    /* Check whether event needs confirmation */
    if (eventData.bindingRegistration) {
      /* Check whether event is confirmed yet */
      if (eventData.confirmed) {
        try {
          /* Get user confirmed status */
          const response = await isConfirmedEvent(eventData.eid);
          response.confirmed
            ? setSpotStatus(confStatus)
            : setSpotStatus(noSpotStatus);
        } catch (error) {
          addToast({
            title: 'Feilmelding',
            status: 'error',
            description: 'Noe gikk galt.',
          });
        }
      } else {
        /* Event is not confirmed yet */
        setSpotStatus(unConfStatus);
      }
    } else if (
      'maxParticipants' in eventData &&
      eventData.maxParticipants !== undefined
    ) {
      try {
        /* Get member */
        const memberResp = await getMemberAssociatedWithToken();
        const uid = memberResp.id;
        /* Get event participants */
        const participantsResp = await getJoinedParticipants(eventData.eid);
        /* Determine spot in queue */
        const spot = participantsResp.findIndex((p) => p.id === uid);
        spot + 1 < eventData.maxParticipants
          ? setSpotStatus(confStatus)
          : setSpotStatus(noSpotStatus);
      } catch (error) {
        addToast({
          title: 'Feilmelding',
          status: 'error',
          description: 'Noe gikk galt.',
        });
      }
    } else {
      /* Open event with no max participants */
      setSpotStatus(confStatus);
    }
  };

  /* Fetch options and confirm status on auth update */
  useEffect(() => {
    fetchOptions();
    checkSpotStatus();
  }, [authenticated]);

  /* Open modal to edit preferences */
  const handleEditButton = () => {
    if ('confirmed' in eventData && eventData.confirmed) {
      addToast({
        title: 'Ulovlig',
        status: 'warning',
        description: 'Det er for sent å endre preferansene dine nå',
      });
    } else if (
      !preferencesOpen &&
      (eventData?.food || eventData?.transportation)
    ) {
      openPreferences();
    } else {
      addToast({
        title: 'Ulovlig',
        status: 'warning',
        description: 'Dette arrangementet har ingen valg',
      });
    }
  };

  /* Handle change of preferences in modal */
  const handlePrefsChange = (prefs: JoinEventPayload) => {
    setEditPrefsPayload(prefs);
  };

  /* Send preference changes to api */
  const editPrefsAction = async () => {
    try {
      await updateEventOptions(eventData.eid, editPrefsPayload);
      /* Close modal */
      closePreferences();
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Valgene dine er endret.',
      });
      /* Fetch options again to show update */
      fetchOptions();
    } catch (error) {
      addToast({
        title: 'Feilmelding',
        status: 'error',
        description: 'Noe gikk galt.',
      });
    }
  };

  return (
    <div className={styles.myEventCard}>
      <div className={styles.eventHeader}>
        <EventHeader id={eventData.eid} className={styles.eventImage} />
        <div className={styles.eventHeaderText}>
          <h5 style={{ margin: 0 }}> {eventData.title} </h5>
          <div className={styles.eventDateWrapper}>
            <Icon type={'calendar'} color="$primary" />
            <small>{transformDate(new Date(eventData.date))}</small>
          </div>
        </div>
      </div>
      <div className={styles.eventInfoWrapper}>
        <div className={styles.eventInfo}>
          <div className={styles.eventOptions}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Dine valg:</p>
            <div>
              Mat{' '}
              {options.food ? (
                <Icon type={'check'} color={'green'} />
              ) : eventData?.food ? (
                <Icon type={'ban'} color={'red'} />
              ) : (
                <NA />
              )}
            </div>
            <div>
              Transport{' '}
              {options.transportation ? (
                <Icon type={'check'} color={'green'} />
              ) : eventData?.transportation ? (
                <Icon type={'ban'} color={'red'} />
              ) : (
                <NA />
              )}
            </div>
            <div>
              Allergier{' '}
              {options.dietaryRestrictions === '' ? (
                eventData?.food ? (
                  <Icon type={'ban'} color={'red'} />
                ) : (
                  <NA />
                )
              ) : (
                <span>
                  {'{ '}
                  {options.dietaryRestrictions}
                  {' }'}
                </span>
              )}
            </div>
          </div>
          <div className={styles.rightWrapper}>
            <div className={styles.statusWrapper}>
              <StatusPill
                message={spotStatus.message}
                color={spotStatus.color}
              />
            </div>
            <div className={styles.buttonWrapper}>
              <Button
                version="secondary"
                onClick={handleEditButton}
                className={styles.editButton}>
                Rediger valg
              </Button>
            </div>
            <Link
              to={'/event/' + eventData.eid}
              style={{ textDecoration: 'none' }}>
              <div className={styles.toEvent}>
                Til arrangement
                <Icon type="arrow-right" color="#f09667" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Modal
        title={'Rediger preferanser'}
        isOpen={preferencesOpen}
        onClose={closePreferences}
        maxWidth={100}>
        <div className={styles.formContent}>
          <EventPreferences
            prefs={editPrefsPayload}
            isfood={eventData?.food}
            istransportation={eventData?.transportation}
            changePrefs={handlePrefsChange}
          />
          <Button version="secondary" onClick={editPrefsAction}>
            Oppdater
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyEventCard;

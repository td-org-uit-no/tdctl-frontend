import React, { useState, useEffect } from 'react';
import { Event } from 'models/apiModels';
import { useParams } from 'react-router-dom';
import ValidEventLayout from './validEvent/ValidEvent';
import { getEventById } from 'api';
import styles from './eventPage.module.scss'

export interface ValidEventLayout {
  eventData: Event | undefined;
}

const ValidEvent: React.FC<ValidEventLayout> = ({ eventData }) => {
  return (
    <div className={styles.eventPageBody}>
      {eventData !== undefined ? (
        <ValidEventLayout event={eventData} />
      ) : (
        <p> 404 event not found!</p>
      )}
    </div>
  );
};

const EventPage = () => {
  const [isValid, setIsValid] = useState<boolean | undefined>();
  const [event, setEvent] = useState<Event>();

  const { id } = useParams<{ id: string }>();

  const isValidEventId = async () => {
    try {
      const res = await getEventById(id);
      setEvent(res);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  useEffect(() => {
    isValidEventId();
  }, []);

  return (
    <div style={{ width: '100vw', maxWidth: '100%' }}>
      {isValid !== undefined && (
        <div className={styles.eventPageBody}>
          <div className={styles.eventContainer}>
            <ValidEvent eventData={event} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;

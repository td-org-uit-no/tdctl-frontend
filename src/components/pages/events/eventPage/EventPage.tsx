import React, { useState, useEffect, useContext } from 'react';
import { Event } from 'models/apiModels';
import { useParams } from 'react-router-dom';
import ValidEventLayout from './validEvent/ValidEvent';
import { getEventById } from 'api';
import styles from './eventPage.module.scss';
import { AuthenticateContext, Roles } from 'contexts/authProvider';

export interface IValidEventLayout {
  eventData: Event | undefined;
}

// return 404 regardless of reasons for not being able to getEventById
const ValidEvent: React.FC<IValidEventLayout> = ({ eventData }) => {
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
  const { role } = useContext(AuthenticateContext);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const isValidEventId = async (id: string) => {
      try {
        const res = await getEventById(id);
        setEvent(res);
        if (res.public === false && role !== Roles.admin) {
          // only allow admin to access unpublished events
          setIsValid(false);
          return;
        }
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    };
    isValidEventId(id);
  }, [id, role]);

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

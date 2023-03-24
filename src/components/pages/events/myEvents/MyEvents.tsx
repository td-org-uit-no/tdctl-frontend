import React, { useState, useEffect, useContext } from 'react';
import { Event } from 'models/apiModels';
import { getJoinedEvents } from 'api';
import styles from './MyEvents.module.scss';
import { AuthenticateContext } from 'contexts/authProvider';
import MyEventCard from 'components/molecules/event/myEventCard/myEventCard';

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { authenticated } = useContext(AuthenticateContext);

  /* Detect error to display message */
  const [isErr, setIsErr] = useState<boolean>(false);

  /* Fetch joined events on auth update */
  useEffect(() => {
    fetchEvents();
  }, [authenticated]);

  /* Sort events by date (TODO: --> utils/sorting) */
  const sortEventByDate = (a: Event, b: Event) => {
    return Number(new Date(a.date)) - Number(new Date(b.date));
  };

  const fetchEvents = async () => {
    try {
      /* Get events */
      const events = await getJoinedEvents();
      const sorted = [...events].sort(sortEventByDate);
      setEvents(sorted);
    } catch (error) {
      console.log(error.statusCode);
      setIsErr(true);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.myEventsWrapper}>
        <div className={styles.eventsWrapper}>
          <div className={styles.myEventsHeader}>
            <h4>Mine arrangementer</h4>
          </div>
          <div className={styles.events}>
            {!isErr
              ? events.length !== 0
                ? events.map((event) => (
                    <MyEventCard eventData={event} key={event.eid} />
                  ))
                : 'Ingen påmeldte arrangementer'
              : 'Kunne ikke hente arrangementer'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;

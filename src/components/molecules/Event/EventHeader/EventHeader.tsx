import React, { useContext }from 'react'
import styles from './eventHeader.module.scss';
import { EventContext } from 'components/pages/events/EventPage/ValidEvent/validEvent';
import EventButton from 'components/molecules/Event/EventButton/Eventbutton';
import logo from 'assets/td-logo-blue.png';

const EventHeader: React.FC = () => {
  const { eid, event } = useContext(EventContext);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.logoWrapper}>
          <div className={styles.logo}>
            <img src={logo} />
          </div>
        </div>
      </div>
      <div className={styles.descriptionContainer}>
        <div className={styles.description}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.button}>
          <EventButton id={eid} />
        </div>
      </div>
    </div>
  );
};

export default EventHeader;

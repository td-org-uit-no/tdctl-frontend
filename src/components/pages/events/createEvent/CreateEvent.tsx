import React from 'react';
import EventForm from 'components/molecules/forms/eventForm/EventForm';
import styles from './createEvent.module.scss';

const EventPage: React.FC = () => {
  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContainer}>
        <h3>Lag et arrangement!</h3>
        <EventForm />
      </div>
    </div>
  );
};

export default EventPage;

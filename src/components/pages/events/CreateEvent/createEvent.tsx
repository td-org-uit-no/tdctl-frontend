import React from 'react';
import EventForm from 'components/molecules/Forms/EventForm/EventForm';
import styles from './createEvent.module.scss';

const EventPage = () => {
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

import React from 'react';
import styles from './eventDetails.module.scss';

interface EventInfo {
  date: string;
  address : string;
}

const EventDetails: React.FC<EventInfo> = ( {date, address} ) => {
  return(
    <div className={styles.eventDetails}>
      <div> {date} </div>
      <div> {address} </div>
    </div>
  )
};

export default EventDetails;

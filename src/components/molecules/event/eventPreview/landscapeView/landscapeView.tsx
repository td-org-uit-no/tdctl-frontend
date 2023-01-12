import React from 'react';
import styles from './landscapeView.module.scss';
import { Event } from 'models/apiModels';
import { useHistory } from 'react-router-dom';
import EventHeader from '../../eventHeader/EventHeader';
import { transformDate } from 'utils/timeConverter';

const LandscapeView: React.FC<{ eventData: Event }> = ({ eventData }) => {
  const history = useHistory();

  const moveToEventPage = () => {
    history.push(`event/${eventData.eid}`);
  };

  return (
    <div className={styles.landscapeView} onClick={moveToEventPage}>
      <div className={styles.landscapeViewContainer}>
        <div className={styles.landscapeViewDate}>
          <p>{transformDate(new Date(eventData.date))}</p>
        </div>
        <div className={styles.landscapeViewTextContainer}>
          <div className={styles.landscapeViewText}>
            <p> {eventData.title} </p>
          </div>
          <div className={styles.landscapeViewAddress}>
            <p> {eventData.address} </p>
          </div>
        </div>
        <div className={styles.landscapeViewImage}>
          <EventHeader id={eventData.eid} />
        </div>
      </div>
    </div>
  );
};

export default LandscapeView;

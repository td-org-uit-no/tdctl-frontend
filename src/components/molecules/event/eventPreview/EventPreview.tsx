import React from 'react';
import styles from './eventPreview.module.scss';
import { Event } from 'models/apiModels';
import EventHeader from '../eventHeader/EventHeader';
import Icon from 'components/atoms/icons/icon';
import { transformDate } from 'utils/timeConverter';
import { useHistory } from 'react-router-dom';

const EventPreview: React.FC<{ eventData: Event }> = ({ eventData }) => {
  const history = useHistory();

  const moveToEventPage = () => {
    history.push(`event/${eventData.eid}`);
  };

  return (
    <div className={styles.eventPreview} onClick={moveToEventPage}>
      <div className={styles.previewContainer}>
        <div className={styles.header}>
          <p> {eventData.title} </p>
        </div>
        <div style={{ height: '60%', width: '100%', paddingTop: '1rem' }}>
          {eventData.eid !== undefined && <EventHeader id={eventData.eid} />}
        </div>
        <div className={styles.info}>
          <div className={styles.infoText}>
            <Icon type={'calendar'} size={1.5} />
            <p>{transformDate(new Date(eventData.date))}</p>
          </div>
          <div className={styles.infoText}>
            <Icon type={'map'} size={1.5} /> <p>{eventData.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;

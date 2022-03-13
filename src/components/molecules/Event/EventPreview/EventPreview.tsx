import React from 'react';
import styles from './eventPreview.module.scss';
import { Event } from 'models/apiModels';
import EventHeader from '../EventHeader/eventHeader';
import Icon from 'components/atoms/icons/icon';
import {transformDate} from 'utils/timeConverter';

const EventPreview: React.FC<{ eventData: Event }> = ({ eventData }) => {
  console.log(eventData?.id);
  return (
    <div className={styles.eventPreview}>
      <div className={styles.previewContainer}>
        {eventData.title}
        <div style={{ height: '60%', width: '100%' }}>
          {eventData.id !== undefined && (
            <EventHeader id={eventData.id ?? ''} />
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.infoText}>
            <Icon type={'calendar'} size={1.5} /> <p>{transformDate(new Date(eventData.date))}</p>
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

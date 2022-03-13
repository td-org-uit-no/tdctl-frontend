import React from 'react';
import useTitle from 'hooks/useTitle';
import styles from './validEvent.module.scss';
import { ValidEventLayout } from '../eventPage';
import { Event } from 'models/apiModels';
import EventBody from 'components/molecules/Event/EventBody/eventBody';

const ValidEvent: React.FC<ValidEventLayout> = ({ eventData, eid }) => {
  return (
    <div>
      {eventData !== undefined && <EventLayout event={eventData} eid={eid} />}
    </div>
  );
};

export interface eventPagePropos {
  eid: string;
  event: Event;
}

const EventLayout: React.FC<eventPagePropos> = ({
  event,
  eid,
}) => {
  useTitle(event.title);

  return (
      <div className={styles.eventPageBody}>
        <div className={styles.eventContainer}>
          <EventBody eid={eid} event={event}/>
        </div>
      </div>
  );
};

export default ValidEvent;

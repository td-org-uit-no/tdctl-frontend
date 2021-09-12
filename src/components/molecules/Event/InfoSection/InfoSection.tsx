import React from 'react';
import styles from './infoSection.module.scss';
import EventDetails from 'components/molecules/Event/EventDetails/EventDetails';
import ParticipantsSection from 'components/molecules/Event/ParticipantsSection/ParticipantsSection';
import { Event } from 'models/apiModels';

export interface EventInfo {
  date: string;
  address: string;
  description: string;
}

const InfoSection: React.FC<{ event: Event | undefined; eid: string }> = ({
  event,
  eid,
}) => {
  return (
    <div className={styles.infoContainer}>
      {event !== undefined && <Info event={event} eid={eid} />}
    </div>
  );
};

const Info: React.FC<{ event: Event; eid: string }> = ({ event, eid }) => {
  return (
    <div className={styles.itemsWrapper}>
      <div className={styles.detailContainer}>
        <EventDetails event={event} eid={eid} />
      </div>
      <div className={styles.participantsContainer}>
        <ParticipantsSection eid={eid} />
      </div>
    </div>
  );
};

export default InfoSection;

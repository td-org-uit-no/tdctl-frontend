import React from 'react';
import styles from './announcementSection.module.scss';
import { Event } from 'models/apiModels';
import EventPosts from 'components/molecules/Event/EventPost/EventPost';
import EventDetails from 'components/molecules/Event/EventDetails/EventDetails';

const AnnouncementSection: React.FC<{ event: Event | undefined; eid: string }> = ({
  event,
  eid,
}) => {
  return (
    <div className={styles.infoContainer}>
      {event !== undefined && <Announcement event={event} eid={eid} />}
    </div>
  );
};

const Announcement:React.FC<{event: Event, eid: string}> = ({eid, event}) => {
  return (
    <div className={styles.announcementContainer}>
      <div className={styles.sectionWrapper}>
        <div className={styles.announcementWrapper}>
          <div className={styles.annoucments}>
            <EventPosts />
          </div>
        </div>
        <div className={styles.detailsWrapper}>
          <div className={styles.test}>
            <EventDetails event={event} eid={eid} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSection;

import React, { useState, useEffect } from 'react';
import useTitle  from 'hooks/useTitle';
import styles from './validEvent.module.scss';
import InfoSection from 'components/molecules/Event/InfoSection/InfoSection';
import EventButton from 'components/molecules/Event/EventButton/Eventbutton';
import logo from 'assets/td-logo-blue.png';
import { ValidEventLayout } from '../eventPage';
import EventNav from 'components/molecules/Event/EventNav/EventNav';
import AnnouncementSection from 'components/molecules/Event/AnnouncementSection/AnnouncementSection';
import { Event } from 'models/apiModels';

const EventHeader: React.FC<{
  title: string;
  description: string;
  id: string;
}> = ({ id, title, description }) => {
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
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.button}>
          <EventButton id={id} />
        </div>
      </div>
    </div>
  );
};

const ValidEvent: React.FC<ValidEventLayout> = ({ eventData, id }) => {
  return(
    <div>
    { eventData !== undefined  && (
      <EventLayout event={eventData} eid={id} />
    )}
    </div>
  )
}

const EventLayout: React.FC<{event: Event, eid: string}> = ({ event, eid }) => {
  const [renderDiscussion, setRender] = useState(false);
  useTitle(event.title);
  return (
    <div>
      <EventHeader
        description={event.description}
        title={event.title}
        id={eid}
      />
      <div>
        <EventNav renderDiscussion={renderDiscussion} setRender={setRender} />
      </div>
      <div className={styles.eventBody}>
        {!renderDiscussion ? (
          <InfoSection event={event} eid={eid} />
        ) : (
          <AnnouncementSection event={event} eid={eid} />
        )}
      </div>
    </div>
  );
};

export default ValidEvent;

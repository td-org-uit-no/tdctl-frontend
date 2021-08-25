import React, { useState, useEffect } from 'react';
import styles from './validEvent.module.scss';
import EventButton from 'components/molecules/Event/EventButton/Eventbutton';
import EventDetails from 'components/molecules/Event/EventDetails/EventDetails';
import logo from 'assets/td-logo-blue.png';
import { ValidEventLayout } from '../eventPage';
import EventNav from 'components/molecules/Event/EventNav/EventNav';
import EventPosts from 'components/molecules/Event/EventPost/EventPost';

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
          <div>{description}</div>
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
  const [renderDiscussion, setRender] = useState(false);

  return (
    <div>
      <EventHeader
        description={eventData?.description ?? ''}
        title={eventData?.title ?? ''}
        id={id}
      />
      <div>
        <EventNav renderDiscussion={renderDiscussion} setRender={setRender} />
      </div>
      <div className={styles.eventBody}>
        {!renderDiscussion ? (
          <EventDetails
            date={eventData?.date ?? ''}
            address={eventData?.address ?? ''}
          />
        ) : (
          <EventPosts eid={id}/>
        )}
      </div>
    </div>
  );
};

export default ValidEvent;

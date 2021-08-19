import React, { useState, useEffect } from 'react';
import styles from './validEvent.module.scss';
import EventButton from 'components/molecules/Event/EventButton/Eventbutton';
import { joinEvent } from 'utils/api';
import { Event } from 'models/apiModels';
import logo from 'assets/td-logo-blue.png';
import { ValidEventLayout } from '../eventPage';

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
  return (
    <div>
      <EventHeader
        description={eventData?.description ?? ''}
        title={eventData?.title ?? ''}
        id={id}
      />
      <div>
        <div>details</div>
      </div>
    </div>
  );
};

export default ValidEvent;

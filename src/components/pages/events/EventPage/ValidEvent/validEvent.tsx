import React, { useState, useContext } from 'react';
import useTitle from 'hooks/useTitle';
import styles from './validEvent.module.scss';
import EventHeader from 'components/molecules/Event/EventHeader/EventHeader';
import EventButton from 'components/molecules/Event/EventButton/Eventbutton';
import { ValidEventLayout } from '../eventPage';
import { Event } from 'models/apiModels';
import InfoSection from 'components/molecules/Event/InfoSection/InfoSection';
import EventBody from 'components/molecules/Event/EventBody/EventBody';

const ValidEvent: React.FC<ValidEventLayout> = ({ eventData, id }) => {
  return (
    <div>
      {eventData !== undefined && <EventLayout event={eventData} eid={id} />}
    </div>
  );
};

interface eventContextProps{
  eid: string;
  event: Event;
}

export const EventContext = React.createContext<eventContextProps>({} as eventContextProps);

const EventLayout: React.FC<{ event: Event; eid: string }> = ({
  event,
  eid,
}) => {
  useTitle(event.title);
  return (
    <EventContext.Provider value={{eid, event}}>
      <EventHeader />
      <div className={styles.eventBody}>
        <EventBody />
      </div>
      </EventContext.Provider>
  );
};

export default ValidEvent;

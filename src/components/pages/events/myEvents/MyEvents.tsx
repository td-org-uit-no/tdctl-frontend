import React, { useState, useEffect, useContext } from 'react';
import { Event } from 'models/apiModels';
import { getJoinedEvents } from 'api';
import './MyEvents.scss';
import { AuthenticateContext } from 'contexts/authProvider';
import MyEventCard from 'components/molecules/event/myEventCard/myEventCard';

interface IMyEvents {
  events: Event[];
  isErr: boolean;
}

export const DisplayMyEvents: React.FC<IMyEvents> = ({ events, isErr }) => {
  return (
    <div className={'myEventPage'}>
      <div className={'myEventsWrapper'}>
        <div className={'myEvents'}>
          {!isErr
            ? events.length !== 0
              ? events.map((event) => (
                  <MyEventCard eventData={event} key={event.eid} />
                ))
              : 'Ingen påmeldte arrangementer'
            : 'Kunne ikke hente arrangementer'}
        </div>
      </div>
    </div>
  );
};

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { authenticated } = useContext(AuthenticateContext);

  /* Detect error to display message */
  const [isErr, setIsErr] = useState<boolean>(false);

  /* Fetch joined events on auth update */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        /* Get events */
        const events = await getJoinedEvents();
        const sorted = events.sort(sortEventByDate);
        setEvents(sorted);
      } catch (error) {
        setIsErr(true);
      }
    };
    fetchEvents();
  }, [authenticated]);

  /* Sort events by date (TODO: --> utils/sorting) */
  const sortEventByDate = (a: Event, b: Event) => {
    return Number(new Date(a.date)) - Number(new Date(b.date));
  };

  return <>{events && <DisplayMyEvents events={events} isErr={isErr} />}</>;
};

export default MyEvents;

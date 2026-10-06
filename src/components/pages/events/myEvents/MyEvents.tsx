import React from 'react';
import { Event } from 'models/apiModels';
import './MyEvents.scss';
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

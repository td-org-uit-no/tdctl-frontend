import React, { useEffect, useState } from 'react';
import './eventOverview.scss';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import Footer from 'components/molecules/footer/Footer';
import { DisplayMyEvents } from '../myEvents/MyEvents';
import { Event } from 'models/apiModels';
import { getJoinedEvents, getPastEvents } from 'api';
import { sortDate } from 'utils/sorting';
import { useToast } from 'hooks/useToast';

interface IEventOverview {
  events: Event[];
}

export const DisplayEventOverview: React.FC<IEventOverview> = ({ events }) => {
  return (
    <div className="eventOverview">
      <div className="eventOverviewContainer">
        <div className="events">
          {events.length ? (
            events.map((event) => (
              <EventPreview
                eventData={event}
                orientation={'horizontal'}
                key={event.eid}
              />
            ))
          ) : (
            <h3 style={{ minHeight: '65vh' }}>Ingen kommende arrangementer </h3>
          )}
        </div>
      </div>
    </div>
  );
};

type eventContent = 'overview' | 'my events' | 'past events';

const EventOverview: React.FC = () => {
  const [eventContent, setEventContent] = useState<eventContent>('overview');
  const { events } = useUpcomingEvents();
  const [joinedEvents, setJoinedEvents] = useState<Event[] | undefined>();
  const [joinedErrorMsg, setJoinedErrorMsg] = useState<string>('');
  const [pastEvents, setPastEvents] = useState<Event[] | undefined>();
  const [pastErrorMsg, setPastErrorMsg] = useState<string>('');
  const { addToast } = useToast();

  const fetchEvents = async () => {
    try {
      /* Get joined events */
      const joined = await getJoinedEvents();
      joined.sort((a: Event, b: Event) =>
        sortDate(new Date(a.date), new Date(b.date))
      );
      setJoinedEvents(joined);
    } catch (error) {
      // 404 and 500 gets same message as 404 here should not happen
      setJoinedErrorMsg('En ukjent feil skjedde');
    }
    try {
      /* Get past events */
      const past = await getPastEvents();
      past.sort((a: Event, b: Event) =>
        sortDate(new Date(b.date), new Date(a.date))
      );
      setPastEvents(past);
    } catch (error) {
      setPastErrorMsg('En ukjent feil skjedde');
    }
  };

  useEffect(() => {
    if (eventContent === 'my events' && joinedErrorMsg.length) {
      // only display joined event error when user is on 'my event' page
      addToast({
        title: joinedErrorMsg,
        status: 'error',
      });
      setJoinedErrorMsg('');
    } else if (eventContent === 'past events' && pastErrorMsg.length) {
      addToast({
        title: pastErrorMsg,
        status: 'error',
      });
    }
  }, [eventContent, joinedErrorMsg, pastErrorMsg, addToast]);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="eventOverview">
      <div className="eventContent">
        <div className="mainTitle">
          <h2>Arrangementer</h2>
        </div>
        <div className="eventOverviewTitles">
          <div className="itemRight">
            <h6 onClick={() => setEventContent('overview')}>Kommende</h6>
          </div>
          <div className="itemMiddle">
            <h6 onClick={() => setEventContent('my events')}>Påmeldte</h6>
          </div>
          <div className="itemLeft">
            <h6 onClick={() => setEventContent('past events')}>Tidligere</h6>
          </div>
        </div>
        <div className="eventOverviewContainer">
          <div className="animation" key={`${eventContent}`}>
            {eventContent !== 'my events' ? (
              <LoadingWrapper
                data={events}
                startAfter={250}
                className={'wrapper'}>
                {eventContent === 'overview' ? (
                  <DisplayEventOverview events={events ?? []} />
                ) : (
                  <DisplayEventOverview events={pastEvents ?? []} />
                )}
              </LoadingWrapper>
            ) : (
              <LoadingWrapper
                data={joinedEvents}
                startAfter={250}
                className={'wrapper'}>
                <DisplayMyEvents
                  events={joinedEvents ?? []}
                  isErr={joinedErrorMsg.length !== 0}
                />
              </LoadingWrapper>
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default EventOverview;

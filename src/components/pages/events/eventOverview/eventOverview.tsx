import React, { useEffect, useState } from 'react';
import './eventOverview.scss';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import Footer from 'components/molecules/footer/Footer';
import MyEvents, { DisplayMyEvents } from '../myEvents/MyEvents';
import { Event } from 'models/apiModels';
import { getJoinedEvents } from 'api';
import { sortDate } from 'utils/sorting';
import { useToast } from 'hooks/useToast';

interface IUpcomingEvents {
  events: Event[];
}

export const DisplayUpcomingEventOverview: React.FC<IUpcomingEvents> = ({
  events,
}) => {
  return (
    <div className="upcomingEventOverview">
      <div className="upcomingEventOverviewContainer">
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

export const UpcomingEventOverview: React.FC = () => {
  const { events } = useUpcomingEvents();
  return (
    <>
      <LoadingWrapper data={events} startAfter={250}>
        <DisplayUpcomingEventOverview events={events ?? []} />
      </LoadingWrapper>
    </>
  );
};

type eventContent = 'overview' | 'my events';

const EventOverview: React.FC = () => {
  const [eventContent, setEventContent] = useState<eventContent>('overview');
  const { events } = useUpcomingEvents();
  const [joinedEvents, setJoinedEvents] = useState<Event[] | undefined>();
  const [joinedErrorMessage, setJoinedErrorMsg] = useState<string>('');
  const { addToast } = useToast();

  const fetchEvents = async () => {
    try {
      /* Get events */
      const events = await getJoinedEvents();
      events.sort((a: Event, b: Event) =>
        sortDate(new Date(a.date), new Date(b.date))
      );
      setJoinedEvents(events);
    } catch (error) {
      // 404 and 500 gets same message as 404 here should not happen
      setJoinedErrorMsg('En ukjent feil skjedde');
    }
  };

  useEffect(() => {
    if (eventContent === 'my events' && joinedErrorMessage.length) {
      // only display joined event error when user is on 'my event' page
      addToast({
        title: joinedErrorMessage,
        status: 'error',
      });
      setJoinedErrorMsg('');
    }
  }, [eventContent]);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="eventOverview">
      <div className="eventContent">
        <div className="eventOverviewTitles">
          <div className="itemRight">
            <h6 onClick={() => setEventContent('overview')}>
              {' '}
              Kommende arrangementer{' '}
            </h6>
          </div>
          <div className="itemLeft">
            <h6 onClick={() => setEventContent('my events')}>
              Mine arrangementer
            </h6>
          </div>
        </div>
        <div className="eventOverviewContainer">
          <div className="animation" key={`${eventContent}`}>
            {eventContent === 'overview' ? (
              <LoadingWrapper
                data={events}
                startAfter={250}
                className={'wrapper'}
              >
                <DisplayUpcomingEventOverview events={events ?? []} />
              </LoadingWrapper>
            ) : (
              <LoadingWrapper
                data={joinedEvents}
                startAfter={250}
                className={'wrapper'}
              >
                <DisplayMyEvents
                  events={joinedEvents ?? []}
                  isErr={joinedErrorMessage.length !== 0}
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

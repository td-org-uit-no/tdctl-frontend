import React, { useEffect, useState } from 'react';
import './eventOverview.scss';
import Icon from 'components/atoms/icons/icon';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import Footer from 'components/molecules/footer/Footer';
import { DisplayMyEvents } from '../myEvents/MyEvents';
import { Event } from 'models/apiModels';
import { getJoinedEvents, getPastEvents } from 'api';
import { sortDate } from 'utils/sorting';
import { useToast } from 'hooks/useToast';
import { getPastEventsCount } from 'api';

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
  const [skip, setSkip] = useState<number>(0);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const limit = 10;
  const totalPages = Math.ceil(totalEvents / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  // Jumping to top after new page is loaded
  useEffect(() => {
    if (pastEvents && pastEvents.length > 0) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
    }
  }, [pastEvents]);

  const fetchEvents = async () => {
    setPastEvents([]);
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
      const past = await getPastEvents(skip);
      past.sort((a: Event, b: Event) =>
        sortDate(new Date(b.date), new Date(a.date))
      );
      setPastEvents(past);
    } catch (error) {
      setPastErrorMsg('En ukjent feil skjedde');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [skip]);

  useEffect(() => {
    const fetchTotalEvents = async () => {
      try {
        const data = await getPastEventsCount();
        setTotalEvents(data.count);
      } catch (error) {
        console.error('Error fetching total past events:', error);
        setTotalEvents(0);
        addToast({
          title: 'Failed to fetch past events count',
          status: 'error',
        });
      }
    };
    fetchTotalEvents();
  }, []);

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSkip((prevSkip) => prevSkip + limit);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSkip((prevSkip) => Math.max(prevSkip - limit, 0));
    }
  };

  const generatePages = () => {
    const pages: string[] = [];

    // Always show the first page
    pages.push('1');

    // Show ellipsis if there are several pages between the first and the current page
    if (currentPage > 3) {
      pages.push('...');
    }

    // Add pages around the current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(String(i));
    }

    // Add ellipsis and the last page if necessary
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    if (totalPages > 1) {
      pages.push(String(totalPages));
    }

    return pages;
  };
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
            <div className="paginationControls">
              {eventContent === 'past events' && (
                <>
                  <div
                    onClick={currentPage === 1 ? undefined : handlePreviousPage}
                    style={{
                      opacity: currentPage === 1 ? 0 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      pointerEvents: currentPage === 1 ? 'none' : 'auto',
                    }}>
                    <Icon type="angle-double-left" size={1.5} />
                  </div>

                  {generatePages().map((page, index) =>
                    page === '...' ? (
                      <span key={index} className="paginationEllipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={index}
                        className={`pageButton ${
                          currentPage === Number(page) ? 'active' : ''
                        }`}
                        onClick={() => {
                          setSkip((Number(page) - 1) * limit);
                        }}>
                        {page}
                      </button>
                    )
                  )}

                  <div
                    onClick={
                      currentPage === totalPages ? undefined : handleNextPage
                    }
                    style={{
                      opacity: currentPage === totalPages ? 0 : 1,
                      cursor:
                        currentPage === totalPages ? 'not-allowed' : 'pointer',
                      pointerEvents:
                        currentPage === totalPages ? 'none' : 'auto',
                    }}>
                    <Icon type="angle-double-right" size={1.5} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default EventOverview;

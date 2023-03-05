import React from 'react';
import styles from './eventOverview.module.scss';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import Footer from 'components/molecules/footer/Footer';

const EventOverview: React.FC = () => {
  const { events } = useUpcomingEvents();
  return (
    <div>
      <div className={styles.eventOverview}>
        <div className={styles.eventOverviewTitle}>
          <h3> Kommende arrangementer </h3>
        </div>
        <div className={styles.eventOverviewContainer}>
          <LoadingWrapper
            data={events}
            animation={false}
            className={styles.wrapper}>
            {events.length ? (
              events.map((event) => (
                <EventPreview
                  eventData={event}
                  orientation={'landscape'}
                  key={event.eid}
                />
              ))
            ) : (
              <h3 style={{ minHeight: '65vh' }}>
                Ingen kommende arrangementer{' '}
              </h3>
            )}
          </LoadingWrapper>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default EventOverview;

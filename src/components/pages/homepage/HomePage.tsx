import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/homePage/header/HomeHeader';
import Footer from 'components/molecules/footer/Footer';
import styles from './homePage.module.scss';
import Carousel from 'components/molecules/carousel/Carousel';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import { useMobileScreen } from 'hooks/useMobileScreen';
import NoUpcomingEvents from 'components/molecules/homePage/noUpcomingEventResponse/evnetResponse';

const RootPage = () => {
  useTitle('Tromsøstudentenes-Dataforening');
  const { events } = useUpcomingEvents();
  const isMobile = useMobileScreen();

  return (
    <div className={styles.root}>
      <HomeHeader />
      <div className={styles.eventsContainer}>
        <div className={styles.eventsWrapper}>
          <LoadingWrapper
            data={events}
            animation={true}
            startAfter={400}
            className={styles.wrapper}>
            {events && events.length ? (
              <div style={{ width: '75vw' }}>
                <Carousel
                  title="Arrangementer"
                  dir={isMobile ? 'column' : 'row'}
                  viewItems={isMobile ? 1 : 3}
                  spacing={!isMobile}
                  height={'45vh'}>
                  {events.map((event) => (
                    <EventPreview
                      eventData={event}
                      orientation={'vertical'}
                      key={event.eid}
                    />
                  ))}
                </Carousel>
              </div>
            ) : (
              <NoUpcomingEvents />
            )}
          </LoadingWrapper>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;

import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/homePage/header/HomeHeader';
import Footer from 'components/molecules/footer/Footer';
import styles from './homePage.module.scss';
import Carousel from 'components/molecules/carousel/Carousel';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import { useMobileScreen } from 'hooks/useMobileScreen';

const RootPage = () => {
  const { events } = useUpcomingEvents();
  useTitle('Tromsøstudentenes-Dataforening');
  const isMobile = useMobileScreen();
  return (
    <div className={styles.root}>
      <HomeHeader />
      <div className={styles.eventsContainer}>
        <div className={styles.eventsWrapper}>
          <LoadingWrapper
            data={events}
            animation={false}
            className={styles.wrapper}>
            {events.length ? (
              <div style={{ maxWidth: '75vw' }}>
                <Carousel
                  title="Arrangementer"
                  dir={isMobile ? 'column' : 'row'}
                  viewItems={isMobile ? 1 : 3}
                  spacing={!isMobile}
                  height={'45vh'}>
                  {events.map((event) => (
                    <EventPreview eventData={event} key={event.eid} />
                  ))}
                </Carousel>
              </div>
            ) : (
              <h3 style={{ minHeight: '45vh' }}>
                Ingen kommende arrangementer{' '}
              </h3>
            )}
          </LoadingWrapper>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;

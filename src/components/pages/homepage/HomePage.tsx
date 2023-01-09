import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/homePage/header/HomeHeader';
import Footer from 'components/molecules/footer/Footer';
import styles from './homePage.module.scss';
import Carousel from 'components/molecules/carousel/Carousel';
import Verticalcarousel from 'components/molecules/carousel/mobileCarousel';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import { useContext } from 'react';
import { BrowserContext } from '../../../contexts/browserProvider';


const RootPage = () => {
  const { events } = useUpcomingEvents();
  useTitle('Tromsøstudentenes-Dataforening');
  const { isMobile } = useContext(BrowserContext)
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
                <div>
                {isMobile ? (
                  <Verticalcarousel
                    title="Arrangementer"
                    dir="column"
                    viewItems={1}
                    spacing={true}
                    height={'45vh'}>
                    {events.map((event) => (
                      <EventPreview eventData={event} key={event.eid} />
                    ))}
                  </Verticalcarousel>
                ) : (
                  <Carousel
                    title="Arrangementer"
                    dir="row"
                    viewItems={3}
                    spacing={true}
                    height={'45vh'}>
                    {events.map((event) => (
                      <EventPreview eventData={event} key={event.eid} />
                    ))}
                  </Carousel>
                )}
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

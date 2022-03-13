import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/HomePage/Header/HomeHeader';
import Footer from 'components/molecules/Footer/Footer';
import styles from './homePage.module.scss';
import Carousel from 'components/molecules/Carousel/Carousel';
import EventPreview from 'components/molecules/Event/EventPreview/EventPreview';
import {getUpcomingEvents} from 'utils/api';
import {useEffect, useState} from 'react';
import {Event} from 'models/apiModels';

const RootPage = () => {
  const [ events, setEvents ] = useState<Event[]>([])
  useTitle('Tromsøstudentenes-Dataforening');

  const fetchEvents = async () => {
    const eventData = await getUpcomingEvents();
    setEvents(eventData);
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className={styles.root}>
      <HomeHeader />
      <div className={styles.eventsContainer}>
        <div className={styles.eventsWrapper}>
          <Carousel title="ka blir å skje" dir="column" viewItems={3} spacing={true}>
            { events.map((event) => (
              <EventPreview eventData={event} key={event.id} />
            )) }
            { events.map((event) => (
              <EventPreview eventData={event} key={event.id} />
            )) }
            { events.map((event) => (
              <EventPreview eventData={event} key={event.id} />
            )) }
          </Carousel>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;

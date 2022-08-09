import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/homePage/header/HomeHeader';
import Footer from 'components/molecules/footer/Footer';
import styles from './homePage.module.scss';
import Carousel from 'components/molecules/carousel/Carousel';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import { getUpcomingEvents } from 'api';
import { useEffect, useState } from 'react';
import { Event } from 'models/apiModels';

const RootPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  useTitle('Tromsøstudentenes-Dataforening');

  const sortByDate = (a: Event, b: Event) => {
    return Number(new Date(a.date)) - Number(new Date(b.date));
  };

  const fetchEvents = async () => {
    try {
      const eventData = await getUpcomingEvents();
      const sorted = [...eventData].sort(sortByDate);
      setEvents(sorted);
    } catch (error) {
      console.log(error.statusCode);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className={styles.root}>
      <HomeHeader />
      <div className={styles.eventsContainer}>
        <div className={styles.eventsWrapper}>
          <Carousel
            title="Arrangementer"
            dir="row"
            viewItems={3}
            spacing={true}
            height={'42.5vh'}>
            {events.map((event) => (
              <EventPreview eventData={event} key={event.eid} />
            ))}
          </Carousel>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;

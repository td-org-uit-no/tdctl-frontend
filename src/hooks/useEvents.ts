import { useEffect, useState } from 'react';
import { getUpcomingEvents } from 'api';
import { Event } from 'models/apiModels';

const useUpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<number | null>(null);

  // TODO integrated with utils->sorting
  const sortByDate = (a: Event, b: Event) => {
    return Number(new Date(a.date)) - Number(new Date(b.date));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsFetching(true);
        const eventData = await getUpcomingEvents();
        const sorted = [...eventData].sort(sortByDate);
        setEvents(sorted);
        setIsFetching(false);
      } catch (error) {
        setError(error.statusCode);
      } finally {
        setIsFetching(false);
      }
    };
    fetchEvents();
  }, []);

  return { isFetching, events, setEvents, error };
};

export default useUpcomingEvents;

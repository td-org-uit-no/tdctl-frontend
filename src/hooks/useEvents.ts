import { useContext, useEffect, useState } from 'react';
import { getUpcomingEvents } from 'api';
import { Event } from 'models/apiModels';
import { AuthenticateContext } from 'contexts/authProvider';

const useUpcomingEvents = () => {
  const [events, setEvents] = useState<Event[] | undefined>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<number | null>(null);
  const { authenticated } = useContext(AuthenticateContext);

  // TODO integrated with utils->sorting
  const sortByDate = (a: Event, b: Event) => {
    return Number(new Date(a.date)) - Number(new Date(b.date));
  };

  const fetchEvents = async () => {
    try {
      setIsFetching(true);
      const eventData = await getUpcomingEvents();
      const sorted = eventData.sort(sortByDate);
      setEvents(sorted);
      setIsFetching(false);
    } catch (error) {
      setError(error.statusCode);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [authenticated]);

  return { isFetching, events, setEvents, error, fetchEvents };
};

export default useUpcomingEvents;

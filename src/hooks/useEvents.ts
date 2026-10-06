import { useContext, useEffect, useState } from 'react';
import { getJoinedEvents, getUpcomingEvents } from 'api';
import { Event } from 'models/apiModels';
import { AuthenticateContext } from 'contexts/authProvider';
import { sortDate } from 'utils/sorting';

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

/** The member's upcoming joined events, by date, fetched when asked. */
export function useJoinedEvents() {
  const [joinedEvents, setJoinedEvents] = useState<Event[] | undefined>();
  const [joinedErrorMsg, setJoinedErrorMsg] = useState<string>('');

  async function fetchJoinedEvents() {
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
  }

  return { joinedEvents, joinedErrorMsg, setJoinedErrorMsg, fetchJoinedEvents };
}

export default useUpcomingEvents;

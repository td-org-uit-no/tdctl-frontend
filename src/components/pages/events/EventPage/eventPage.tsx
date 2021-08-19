import React, { useState, useEffect } from 'react';
import { Event } from 'models/apiModels';
import { useParams } from 'react-router-dom';
import ValidEvent from './ValidEvent/validEvent';
import { getEventById } from 'utils/api';

export interface ValidEventLayout {
  eventData: Event | undefined;
  id : string;
}

const EventLayout: React.FC<ValidEventLayout> = ({ eventData, id}) => {
  return (
    <div>
      {eventData !== undefined ? <ValidEvent eventData={eventData} id={id} /> : <p> 404 event not found!</p>}
    </div>
  );
};

const EventPage = () => {
  const [isValid, setIsValid] = useState<boolean | undefined>();
  const [event, setEvent] = useState<Event>();

  const { id } = useParams<{ id: string }>();

  const isValidEventId = async () => {
    try {
      const res = await getEventById(id);
      setEvent(res);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  useEffect(() => {
    isValidEventId();
  }, []);

  return (
    <div>{isValid !== undefined && <EventLayout eventData={event} id={id} />}</div>
  );
};

export default EventPage;

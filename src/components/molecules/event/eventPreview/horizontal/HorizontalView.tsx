import React from 'react';
import './horizontal.scss';
import { Event } from 'models/apiModels';
import { useHistory } from 'react-router-dom';
import EventHeader from '../../eventHeader/EventHeader';
import { transformDate } from 'utils/timeConverter';

const HorizontalView: React.FC<{ eventData: Event }> = ({ eventData }) => {
  const history = useHistory();

  const moveToEventPage = () => {
    history.push(`event/${eventData.eid}`);
  };

  return (
    <div className="landscapeView" onClick={moveToEventPage}>
      <div className="landscapeViewContainer">
        <div className="landscapeViewDate">
          <p>{transformDate(new Date(eventData.date))}</p>
        </div>
        <div className="landscapeViewTextContainer">
          <div className="landscapeViewText">
            <p> {eventData.title} </p>
          </div>
          <div className="landscapeViewAddress">
            <p> {eventData.address} </p>
          </div>
        </div>
        <div className="landscapeViewImage">
          <EventHeader id={eventData.eid} />
        </div>
      </div>
    </div>
  );
};

export default HorizontalView;

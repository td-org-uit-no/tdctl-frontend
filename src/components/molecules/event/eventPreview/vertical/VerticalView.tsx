import React from 'react';
import './vertical.scss';
import { Event } from 'models/apiModels';
import { Link } from 'react-router-dom';
import EventHeader from '../../eventHeader/EventHeader';
import Icon from 'components/atoms/icons/icon';
import { transformDate } from 'utils/timeConverter';

const VerticalView: React.FC<{ eventData: Event }> = ({ eventData }) => {
  return (
    <Link className="eventPreview" to={`event/${eventData.eid}`}>
      <div className="previewContainer">
        <div className="verticalViewHeader">
          <p> {eventData.title} </p>
        </div>
        <div style={{ height: '60%', width: '100%' }}>
          {eventData.eid !== undefined && <EventHeader id={eventData.eid} />}
        </div>
        <div className="verticalViewInfo">
          <div className="verticalViewInfoText">
            <Icon type={'calendar'} size={1.5} />
            <p>{transformDate(new Date(eventData.date))}</p>
          </div>
          <div className="verticalViewInfoText">
            <Icon type={'map'} size={1.5} /> <p>{eventData.address}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VerticalView;

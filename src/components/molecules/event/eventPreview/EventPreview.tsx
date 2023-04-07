import React from 'react';
import { Event } from 'models/apiModels';
import HorizontalView from './horizontal/HorizontalView';
import VerticalView from './vertical/VerticalView';

type OrientationOptions = 'vertical' | 'horizontal';

const EventPreview: React.FC<{
  eventData: Event;
  orientation: OrientationOptions;
}> = ({ eventData, orientation }) => {
  return (
    <>
      {orientation === 'horizontal' ? (
        <HorizontalView eventData={eventData} />
      ) : (
        <VerticalView eventData={eventData} />
      )}
    </>
  );
};

export default EventPreview;

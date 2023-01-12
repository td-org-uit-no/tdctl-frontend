import React from 'react';
import { Event } from 'models/apiModels';
import LandscapeView from './landscapeView/landscapeView';
import PortraitView from './portraitView/portraitView';

const EventPreview: React.FC<{ eventData: Event; orientation: String }> = ({
  eventData,
  orientation,
}) => {
  if (orientation === 'landscape') {
    return <LandscapeView eventData={eventData} />;
  } else if (orientation === 'portrait') {
    return <PortraitView eventData={eventData} />;
  } else {
    return <h1> Incorrect orientation specified </h1>;
  }
};

export default EventPreview;

import { baseUrl } from 'constants/apiConstants';
import classnames from 'classnames';
import React from 'react';
import './eventHeader.scss';

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  id: string;
}

const EventHeader: React.FC<Props> = ({ id, className }) => {
  const classes = classnames('base', className);
  const imgUrl = baseUrl + 'event/' + id + '/image';

  return (
    <div className={classes}>
      <img src={imgUrl} alt="" />
    </div>
  );
};

export default EventHeader;

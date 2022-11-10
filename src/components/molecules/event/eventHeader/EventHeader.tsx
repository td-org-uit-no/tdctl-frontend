import { baseUrl } from 'constants/apiConstants';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import './eventHeader.scss';

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  id: string;
}

const EventHeader: React.FC<Props> = ({ id, className }) => {
  const classes = classnames('base', className);
  const [imgUrl, setImgUrl] = useState<any>();
  const url = baseUrl + 'event/' + id + '/image';

  useEffect(() => {
    const getImg = async () => {
      const response = await fetch(url);
      const imageBlob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = () => {
        const base64data = reader.result;
        setImgUrl(base64data);
      };
    };
    getImg();
  }, [url]);

  return (
    <div className={classes}>
      <img src={imgUrl} alt="" />
    </div>
  );
};

export default EventHeader;

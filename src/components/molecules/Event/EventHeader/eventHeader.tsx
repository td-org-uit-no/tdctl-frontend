import {baseUrl} from 'constants/apiConstants';
import React, { useEffect, useState } from 'react';
import { getEventImage } from 'utils/api';
import styles from './eventHeader.module.scss';

const EventHeader: React.FC<{ id: string }> = ({ id }) => {
  const [imgUrl, setImgUrl] = useState<any>();
  const url = baseUrl + 'event/'+id+'/image'

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

  const fetchEventImage = async () => {
    const resp = await getImg();
  };

  useEffect(() => {
    fetchEventImage();
  }, []);

  return <div className={styles.headerContainer}>
      <img src={imgUrl} />
  </div>;
};

export default EventHeader;

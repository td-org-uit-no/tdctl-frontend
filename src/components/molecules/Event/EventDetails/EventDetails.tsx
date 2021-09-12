import React, { useState, useEffect } from 'react';
import styles from './eventDetails.module.scss';
import { Event } from 'models/apiModels';
import { transformDate } from 'utils/timeConverter';
import { getParticipants } from 'utils/api';

import { FiCalendar } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';
import { IoIosPricetag } from 'react-icons/io';
import { BiTimer } from 'react-icons/bi';
import { BsFillPeopleFill } from 'react-icons/bs';

const EventDetails: React.FC<{ event: Event; eid: string }> = ({
  event,
  eid,
}) => {
  const [participantsText, setParticipantsText] = useState<string | undefined>(
    undefined
  );
  const dateInText = transformDate(new Date(event.date));
  const priceText = event.price === 0 ? 'Gratis' : `${event.price} kr`;

  const fetchParticipants = async () => {
    const participants = await getParticipants(eid);
    const num = participants.length;
    const text = event.maxParticipants ? `${num}/${event.maxParticipants}` : `${num}`;
    setParticipantsText(text);
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div className={styles.eventDetails}>
      <div className={styles.detailsItemsContainer}>
        <div className={styles.detailsItems}>
          <h5> Detaljer </h5>
          <div className={styles.detailItem}>
            <div className={styles.logo}>
              <FiCalendar size={'1.5rem'} className={styles.icon} />
              <p>{dateInText} </p>
            </div>
            {participantsText !== undefined && (
              <div className={styles.logo}>
                <BsFillPeopleFill size={'1.5rem'} className={styles.icon} />
                <p>{participantsText} personer har svart </p>
              </div>
            )}
            <div className={styles.logo}>
              <GoLocation size={'1.5rem'} className={styles.icon} />
              <p>{event.address} </p>
            </div>
            <div className={styles.logo}>
              <IoIosPricetag size={'1.5rem'} className={styles.icon} />
              <p> {priceText} </p>
            </div>
            {event.duration !== undefined && (
              <div className={styles.logo}>
                <BiTimer size={'1.5rem'} className={styles.icon} />
                <p> {event.duration} timer </p>
              </div>
            )}
          </div>
          <div className={styles.descriptionContainer}>
            {event.extraInformation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

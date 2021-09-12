import React, { useState, useEffect } from 'react';
import styles from './participantsSection.module.scss';
import { getParticipants } from 'utils/api';
import { Participant } from 'models/apiModels';
import defaultPicture from 'assets/default_picture.png';

const ParticipantsSection: React.FC<{ eid: string }> = ({ eid }) => {
  const [participants, setParticipants] = useState<Participant[] | undefined>(
    undefined
  );
  const fetchParticipants = async () => {
    try {
      const participantsList = await getParticipants(eid);
      setParticipants(participantsList);
    } catch (error) {
      console.log(error.statusCode);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);
  return (
    <div className={styles.participantsContainer}>
      {participants !== undefined && (
        <ParticipantsList participants={participants} />
      )}
    </div>
  );
};

const ParticipantCard: React.FC<{ participant: Participant }> = ({
  participant,
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div className={styles.pictureWrapper}>
          <img src={defaultPicture} />
        </div>
      </div>
      <div className={styles.nameContainer}>
        {participant.realName}
      </div>
    </div>
  );
};
const ParticipantsList: React.FC<{ participants: Participant[] }> = ({
  participants,
}) => {
  return (
    <div className={styles.participantsList}>
      <p>Kommer</p>
      {participants.map((p) => {
        return <ParticipantCard participant={p} key={p._id}/>;
      })}
    </div>
  );
};

export default ParticipantsSection;

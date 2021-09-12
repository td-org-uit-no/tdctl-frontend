import React, { useState, useEffect } from 'react';
import styles from './eventPostCard.module.scss';
import { Post, PartialMember } from 'models/apiModels';
import defaultPicture from 'assets/default_picture.png';
import { getMemberById } from 'utils/api';
import { transformDate } from 'utils/timeConverter';
import Dropdown from 'components/atoms/dropdown/Dropdown';
import Button from 'components/atoms/button/Button';

const EventPostCard: React.FC<Post> = (props) => {
  const [userInfo, setUserInfo] = useState<PartialMember | undefined>(
    undefined
  );
  const [expanded, setExpanded] = useState(false);
  const getUserInfo = async () => {
    try {
      const user = await getMemberById(props.author);
      // console.log(user);
      setUserInfo(user);
      // console.log(transformDate(new Date(props.created_at)));
    } catch (error) {
      console.log(error.statusCode);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className={styles.postContainer}>
      <div className={styles.header}>
        <div className={styles.pictureWrapper}>
          <img src={defaultPicture} />
        </div>
      </div>
      <div className={styles.postMessageContainer}>
        {userInfo !== undefined && (
          <div className={styles.textHeader}>
            <p>{userInfo?.realName} </p>
            <small> {transformDate(new Date(props.created_at))} </small>
          </div>
        )}
        <div className={styles.message}>{props.message}</div>
        <div
          className={styles.commentField}
          onClick={() => setExpanded(!expanded)}>
          <div className={styles.buttonContainer}>
            <Button version="primary">Kommentarer</Button>
          </div>
          <Dropdown expanded={expanded}>
            <div>
              {' '}
              <p> dette er kommentarer</p>{' '}
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default EventPostCard;

import React, { useState, useEffect } from 'react';
import styles from './eventPostCard.module.scss';
import { Post, PartialMember } from 'models/apiModels';
import { getMemberById } from 'utils/api';
// import { transformDate } from 'utils/timeConverter';
// import Dropdown from 'components/atoms/dropdown/Dropdown';
// import Button from 'components/atoms/button/Button';
// import default_picture from 'assets/default_picture.png';
// <img src={default_picture} />

// const PostHeader = () => {
//   return (
//   );
// };

const EventPostCard: React.FC<Post> = (props) => {
  // const [userInfo, setUserInfo] = useState<PartialMember | undefined>(
  // undefined
  // );
  // const getUserInfo = async () => {
  // try {
  //   const user = await getMemberById(props.author);
  //   // console.log(user);
  //   setUserInfo(user);
  //   // console.log(transformDate(new Date(props.created_at)));
  // } catch (error) {
  //   console.log(error.statusCode);
  // }
  // };

  // useEffect(() => {
  // getUserInfo();
  // }, []);

  return (
    <div className={styles.navn}>
      <div className={styles.hallo}>test er</div>
    </div>
  );
};

export default EventPostCard;

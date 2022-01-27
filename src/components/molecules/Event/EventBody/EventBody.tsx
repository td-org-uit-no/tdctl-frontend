import React from 'react';
import styles from './eventBody.module.scss'
import EventPosts from 'components/molecules/Event/EventPost/EventPost';

const EventBody = () => {
  return (
    <div className={styles.eventBodyContainer}>
        <div className={styles.sideBarContainer}>Side bar </div>
          <div className={styles.feedContainer}> 
            <EventPosts />
          </div>
        <div className={styles.infoContainer}> Info </div>
    </div>
  )
}

export default EventBody;

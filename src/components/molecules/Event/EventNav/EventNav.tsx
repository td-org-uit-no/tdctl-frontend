import React, { useEffect } from 'react';
import styles from './eventnav.module.scss';

interface NavProps {
  renderDiscussion: boolean;
  setRender: (type: boolean) => void;
}

const EventNav: React.FC<NavProps> = ({ renderDiscussion, setRender }) => {
  const renderInfo = () => {
    if (renderDiscussion) {
      setRender(!renderDiscussion);
    }
  };

  const handleDiscussion = () => {
    if (!renderDiscussion) {
      setRender(!renderDiscussion);
    }
  };

  return (
    <div className={styles.navContainer}>
      <li onClick={renderInfo}>Info</li>
      <li onClick={handleDiscussion}>Kunngjøringer</li>
    </div>
  );
};

export default EventNav;

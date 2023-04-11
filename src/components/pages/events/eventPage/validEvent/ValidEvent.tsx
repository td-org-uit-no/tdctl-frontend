import React, { useContext, useState } from 'react';
import styles from './validEvent.module.scss';
import { Event } from 'models/apiModels';
import {
  EditEvent,
  EventInfo,
} from 'components/molecules/event/eventBody/EventBody';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import EventHeader from 'components/molecules/event/eventHeader/EventHeader';
import Button from 'components/atoms/button/Button';
import Icon from 'components/atoms/icons/icon';
import { useHistory } from 'react-router-dom';
import useTitle from 'hooks/useTitle';

export interface EventPageProps {
  eid: string;
  event: Event;
}

const ValidEventLayout: React.FC<{ event: Event }> = ({ event }) => {
  useTitle(event.title);
  const { role } = useContext(AuthenticateContext);
  const history = useHistory();

  return (
    <div className={styles.eventBody}>
      <EventHeader id={event.eid} className={styles.header} />

      <EventInfo event={event} role={role} />

      {role === Roles.admin && (
        <div className={styles.settingsIcon}>
          <Icon
            type={'cog'}
            size={2}
            onClick={() => history.push(`${event.eid}/admin`)}></Icon>
        </div>
      )}
    </div>
  );
};
export default ValidEventLayout;

export const ValidEventEditLayout: React.FC<{ event: Event }> = ({ event }) => {
  const { role } = useContext(AuthenticateContext);
  const [edit, setEdit] = useState(false);

  const setEventEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className={styles.eventBody}>
      <EventHeader id={event.eid} className={styles.header} />
      {!edit ? (
        <EventInfo event={event} role={role} />
      ) : (
        <EditEvent event={event} setEdit={setEventEdit} />
      )}
      {role === Roles.admin && !edit && (
        <div className={styles.editContainer}>
          <Button
            version="primary"
            onClick={setEventEdit}
            className={styles.adminButtons}>
            Rediger
          </Button>
        </div>
      )}
    </div>
  );
};

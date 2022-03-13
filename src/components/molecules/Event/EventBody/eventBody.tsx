import React, { useContext, useEffect, useState } from 'react';
import styles from './eventBody.module.scss';
import EventHeader from 'components/molecules/Event/EventHeader/eventHeader';
import { eventPagePropos } from 'components/pages/events/EventPage/ValidEvent/validEvent';
import { transformDate } from 'utils/timeConverter';
import EventButton from '../EventButton/eventButton';
import TextField from 'components/atoms/textfield/Textfield';
import Textarea from 'components/atoms/textarea/Textarea';
import { AuthenticateContext } from 'contexts/authProvider';
import Button from 'components/atoms/button/Button';
import { getJoinedParticipants, updateEvent } from 'utils/api';
import {
  addressValidator,
  dateValidator,
  descriptionValidator,
  titleValidator,
} from 'utils/validators';
import useForm from 'hooks/useForm';
import { useHistory } from 'react-router-dom';
import { Event } from 'models/apiModels';

// TODO extend the admin features
const EditEvent: React.FC<{ eid: string; event: Event; setEdit: () => void }> =
  ({ eid, event, setEdit }) => {
    const [error, setError] = useState<string | undefined>(undefined);
    const history = useHistory();

    const initalValue = {
      title: event.title,
      description: event.description,
      date: event.date,
      address: event.address,
    };

    const validators = {
      title: titleValidator,
      description: descriptionValidator,
      date: dateValidator,
      address: addressValidator,
    };

    const submit = async () => {
      if (hasErrors) {
        return;
      }

      const updatePayload = {
        ...(fields['title']?.value !== event.title && {
          title: fields['title']?.value,
        }),
        ...(fields['description']?.value !== event.description && {
          description: fields['description']?.value,
        }),
        ...(fields['date']?.value !== event.date && {
          date: fields['date']?.value,
        }),
        ...(fields['address']?.value !== event.address && {
          address: fields['address']?.value,
        }),
      };

      if (!Object.keys(updatePayload).length) {
        setError('Minst et felt må endres');
        return;
      }

      try {
        await updateEvent(eid, updatePayload);
        // reload page
        history.go(0);
      } catch (error) {
        console.log(error);
      }
    };

    const { fields, onFieldChange, hasErrors } = useForm({
      onSubmit: submit,
      validators: validators,
      initalValue: initalValue,
    });

    return (
      <div>
        <div className={styles.contentContainer}>
          <div className={styles.description}>
            <div className={styles.descriptionContainer}>
              <div>
                <TextField
                  name={'title'}
                  maxWidth={60}
                  label={'Tittel'}
                  onChange={onFieldChange}
                  value={fields['title'].value ?? ''}
                  error={fields['title'].error}
                />
                <Textarea
                  name={'description'}
                  maxWidth={60}
                  onChange={onFieldChange}
                  label={'Beskrivelse'}
                  value={fields['description'].value ?? ''}
                  error={fields['description'].error}
                />
              </div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoContainer}>
              <div className={styles.infoWrapper}>
                <div className={styles.infoSection}>
                  <EventButton id={eid} />
                  <TextField
                    name={'address'}
                    maxWidth={60}
                    onChange={onFieldChange}
                    label={'sted'}
                    value={fields['address'].value ?? ''}
                    error={fields['address'].error}
                  />
                  <p> Dato </p>
                  {transformDate(new Date(event.date))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {error !== undefined && <p>{error}</p>}
        <div>
          <Button
            version="primary"
            onClick={setEdit}
            className={styles.adminButtons}>
            Ferdig
          </Button>
          <Button
            version="secondary"
            className={styles.adminButtons}
            onClick={submit}>
            Oppdater
          </Button>
        </div>
      </div>
    );
  };

const EventInfo: React.FC<eventPagePropos> = ({ eid, event }) => {
  const [participantsText, setParticipantText] = useState('');

  const getNumberOfParticipants = async () => {
    const resp = await getJoinedParticipants(eid);
    console.log(event.maxParticipants)
    const str =
      event.maxParticipants === null
        ? `${resp.length} skal`
        : `${resp.length} / ${event.maxParticipants} påmeldt`;
    setParticipantText(str);
  };

  useEffect(() => {
    getNumberOfParticipants();
  });

  return (
    <div className={styles.contentContainer}>
      <div className={styles.description}>
        <div className={styles.descriptionContainer}>
          <div>
            <h3>{event.title}</h3>
            <p> Bli med {transformDate(new Date(event.date))}</p>
            <p>{event.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.infoWrapper}>
            <div className={styles.infoSection}>
              <EventButton id={eid} />
              <p>Sted</p>
              {event.address}
              <p> Dato </p>
              {transformDate(new Date(event.date))}
              <p> Antall deltakere </p>
              {participantsText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventBody: React.FC<eventPagePropos> = ({ eid, event }) => {
  const { role } = useContext(AuthenticateContext);
  const [edit, setEdit] = useState(false);

  const setEventEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className={styles.eventBody}>
      <EventHeader id={eid} className={styles.header}/>
      {!edit ? (
        <EventInfo eid={eid} event={event} />
      ) : (
        <EditEvent eid={eid} event={event} setEdit={setEventEdit} />
      )}
      {role === 'admin' && !edit && (
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

export default EventBody;

// TODO add footer

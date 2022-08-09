import { useEffect, useState } from 'react';
import styles from './eventBody.module.scss';
import { transformDate } from 'utils/timeConverter';
import EventButton from '../eventButton/EventButton';
import TextField from 'components/atoms/textfield/Textfield';
import Textarea from 'components/atoms/textarea/Textarea';
import Button from 'components/atoms/button/Button';
import { getJoinedParticipants, updateEvent } from 'api';
import {
  addressValidator,
  dateValidator,
  descriptionValidator,
  maxParticipantsValidator,
  titleValidator,
} from 'utils/validators';
import useForm from 'hooks/useForm';
import { useHistory } from 'react-router-dom';
import { Event } from 'models/apiModels';
import { RoleOptions } from 'contexts/authProvider';

// TODO extend the admin features
export const EditEvent: React.FC<{ event: Event; setEdit: () => void }> = ({
  event,
  setEdit,
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const history = useHistory();

  const initalValue = {
    title: event.title,
    description: event.description,
    date: event.date,
    address: event.address,
    ...(event?.maxParticipants !== undefined && {
      maxParticipants: event.maxParticipants.toString(),
    }),
  };

  const validators = {
    title: titleValidator,
    description: descriptionValidator,
    date: dateValidator,
    address: addressValidator,
    maxParticipants: maxParticipantsValidator,
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
      ...(fields['maxParticipants']?.value !==
        event?.maxParticipants?.toString() && {
        maxParticipants: fields['maxParticipants']?.value,
      }),
    } as Event;
    if (!Object.keys(updatePayload).length) {
      setError('Minst et felt må endres');
      return;
    }
    try {
      await updateEvent(event.eid, updatePayload);
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
    <div className={styles.editContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.description}>
          <div className={styles.descriptionContainer}>
            <div>
              <TextField
                name={'title'}
                maxWidth={81}
                minWidth={81}
                label={'Tittel'}
                onChange={onFieldChange}
                value={fields['title'].value ?? ''}
                error={fields['title'].error}
              />
              <br />
              <Textarea
                name={'description'}
                maxWidth={75}
                minWidth={75}
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
                <EventButton id={event.eid} />
                <TextField
                  name={'address'}
                  maxWidth={80}
                  onChange={onFieldChange}
                  label={'Sted'}
                  value={fields['address'].value ?? ''}
                  error={fields['address'].error}
                />
                <p> Dato </p>
                {transformDate(new Date(event.date))}
                <TextField
                  name={'maxParticipants'}
                  type={'number'}
                  maxWidth={60}
                  onChange={onFieldChange}
                  label={'Max antall påmeldte'}
                  value={
                    fields['maxParticipants']?.value ?? event.maxParticipants
                  }
                  error={fields['maxParticipants']?.error}
                />
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

export const EventInfo: React.FC<{ event: Event; role: RoleOptions }> = ({
  event,
  role,
}) => {
  const [participantsText, setParticipantText] = useState('');

  const getNumberOfParticipants = async () => {
    try {
      const resp = await getJoinedParticipants(event.eid);
      const str =
        event.maxParticipants === null
          ? `${resp.length} skal`
          : `${resp.length} / ${event.maxParticipants} påmeldt`;
      setParticipantText(str);
    } catch (error) {
      // gracefully ignore the error
    }
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
              <EventButton id={event.eid} />
              <p>Sted</p>
              {event.address}
              <p> Dato </p>
              {transformDate(new Date(event.date))}
              <p> Antall deltakere </p>
              {participantsText}
              {role === 'admin' && (
                <ol>
                  {event.participants?.map((p, i) => {
                    return (
                      <li
                        key={i}
                        style={{
                          color:
                            (event.maxParticipants ?? 0) < i + 1
                              ? 'red'
                              : 'none',
                        }}>
                        {p.realName}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

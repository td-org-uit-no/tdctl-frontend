import { useCallback, useEffect, useState } from 'react';
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
    // juggling-check, checks for both null and undefined
    ...(event?.maxParticipants != null && {
      maxParticipants: event?.maxParticipants.toString() ?? '',
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
            <TextField
              name={'title'}
              label={'Tittel'}
              onChange={onFieldChange}
              value={fields['title'].value ?? ''}
              error={fields['title'].error}
              style={{ boxSizing: 'border-box', width: '100%' }}
            />
            <br />
            <Textarea
              name={'description'}
              onChange={onFieldChange}
              label={'Beskrivelse'}
              value={fields['description'].value ?? ''}
              error={fields['description'].error}
              style={{ boxSizing: 'border-box', width: '100%' }}
            />
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.infoWrapper}>
              <div className={styles.infoSection}>
                <EventButton id={event.eid} />
                <TextField
                  name={'address'}
                  maxWidth={60}
                  onChange={onFieldChange}
                  label={'Sted'}
                  value={fields['address'].value ?? ''}
                  error={fields['address'].error}
                  style={{ boxSizing: 'border-box', width: '100%' }}
                />
                <p>
                  Dato <br />
                </p>
                <p style={{ fontWeight: 'normal', marginBottom: '.5rem' }}>
                  {transformDate(new Date(event.date))}
                </p>
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
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
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

  function getParticipantsText(
    maxParticipants: number | undefined,
    participants: number
  ) {
    // juggling-check, checks for both null and undefined
    if (maxParticipants == null) {
      return `${participants} skal`;
    }
    if (participants >= maxParticipants) {
      return 'Fullt';
    }
    return `${participants} / ${maxParticipants} påmeldt`;
  }

  const getNumberOfParticipants = useCallback(async () => {
    try {
      const resp = await getJoinedParticipants(event.eid);
      const str = getParticipantsText(event?.maxParticipants, resp.length);
      setParticipantText(str);
    } catch (error) {
      // Dont think users needs an error modal as its an API call the user should think about
      setParticipantText('Unavailable');
    }
  }, [event.eid, event?.maxParticipants]);

  useEffect(() => {
    getNumberOfParticipants();
  }, [getNumberOfParticipants]);

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
              <EventButton id={event.eid} onClick={getNumberOfParticipants} />
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

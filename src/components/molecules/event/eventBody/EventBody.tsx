import { useCallback, useEffect, useState } from 'react';
import styles from './eventBody.module.scss';
import { transformDate } from 'utils/timeConverter';
import EventButton from '../eventButton/EventButton';
import TextField from 'components/atoms/textfield/Textfield';
import Textarea from 'components/atoms/textarea/Textarea';
import Button from 'components/atoms/button/Button';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import { getJoinedParticipants, updateEvent } from 'api';
import {
  addressValidator,
  dateValidator,
  descriptionValidator,
  maxParticipantsValidator,
  titleValidator,
  priceValidator,
  timeValidator,
} from 'utils/validators';
import useForm from 'hooks/useForm';
import { useHistory } from 'react-router-dom';
import { Event } from 'models/apiModels';
import { RoleOptions, Roles } from 'contexts/authProvider';

// TODO extend the admin features
export const EditEvent: React.FC<{ event: Event; setEdit: () => void }> = ({
  event,
  setEdit,
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const history = useHistory();
  const timeDate = new Date(event.date);
  const [toggleActive, setToggleActive] = useState<boolean>(
    event.public ?? false
  );
  const [toggleFood, setToggleFood] = useState<boolean>(event.food ?? false);
  const [toggleTransportation, setToggleTransportation] = useState<boolean>(
    event.transportation ?? false
  );
  const initalValue = {
    title: event.title,
    description: event.description,
    date: event.date.split('T')[0], //sets [YYYY-MM-DD]
    time: timeDate.getHours() + ':' + timeDate.getMinutes(), //sets [HH:MM] and not [HH:MM:SS]
    address: event.address,
    price: event.price.toString(),
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
    price: priceValidator,
    time: timeValidator,
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
      ...(fields['date']?.value + ' ' + fields['time']?.value !==
        event.date && {
        date: fields['date']?.value + ' ' + fields['time']?.value,
      }),
      ...(fields['address']?.value !== event.address && {
        address: fields['address']?.value,
      }),
      ...(fields['price']?.value !== event.price.toString() && {
        price: Number(fields['price']?.value),
      }),
      ...(fields['maxParticipants']?.value !==
        event?.maxParticipants?.toString() && {
        maxParticipants: fields['maxParticipants']?.value,
      }),
      food: toggleFood,
      transportation: toggleTransportation,
      public: toggleActive,
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
                <TextField
                  name={'date'}
                  label={'Dato'}
                  type={'date'}
                  value={fields['date'].value ?? ''}
                  onChange={onFieldChange}
                />
                <TextField
                  name={'time'}
                  label={'Tid'}
                  type={'time'}
                  value={fields['time'].value ?? ''}
                  onChange={onFieldChange}
                  error={fields['time']?.error}
                />
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
                <TextField
                  name={'price'}
                  type={'number'}
                  maxWidth={60}
                  onChange={onFieldChange}
                  label={'Pris per deltaker'}
                  value={fields['price']?.value ?? ''}
                  error={fields['price']?.error}
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                />
                <div className={styles.toggleWrapper}>
                  <ToggleButton
                    initValue={toggleFood}
                    onChange={() => setToggleFood(!toggleFood)}
                    label={'Food'}></ToggleButton>
                  <ToggleButton
                    initValue={toggleTransportation}
                    onChange={() =>
                      setToggleTransportation(!toggleTransportation)
                    }
                    label={'Transportation'}></ToggleButton>
                  <ToggleButton
                    initValue={toggleActive}
                    onChange={() => setToggleActive(!toggleActive)}
                    label={toggleActive ? 'Active' : 'Inactive'}></ToggleButton>
                </div>
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

const validJoin = (role: RoleOptions, eventRegString: string | undefined) => {
  if (eventRegString === undefined) {
    return false;
  }
  if (role === Roles.admin) {
    return true;
  }
  const now = new Date();
  const openingDate = new Date(eventRegString);
  return now >= openingDate;
};

export const EventInfo: React.FC<{ event: Event; role: RoleOptions }> = ({
  event,
  role,
}) => {
  const [participantsText, setParticipantText] = useState('');
  const [canJoinEvent, setCanJoin] = useState<boolean>(
    validJoin(role, event.registrationOpeningDate)
  );
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
      setParticipantText('Log inn for å se flere detaljer');
    }
  }, [event.eid, event?.maxParticipants]);

  useEffect(() => {
    getNumberOfParticipants();
  }, [getNumberOfParticipants]);

  return (
    <div className={styles.contentContainer}>
      <div className={styles.contentHeader}>
        <h3>{event.title}</h3>
        <p> Bli med {transformDate(new Date(event.date))}</p>
      </div>
      <div className={styles.description}>
        <div className={styles.descriptionContainer}>
          <div>
            <p style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              {event.description}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoSection}>
          <h4 style={{ marginBottom: '0px' }}>
            {' '}
            Påmelding {canJoinEvent ? '' : 'åpner'}:
          </h4>
          {canJoinEvent ? (
            <EventButton id={event.eid} onClick={getNumberOfParticipants} />
          ) : (
            <div>
              {event.registrationOpeningDate ? (
                <p style={{ fontWeight: 'lighter' }}>
                  {' '}
                  {transformDate(new Date(event.registrationOpeningDate))}
                </p>
              ) : (
                <p> Påmelding kommer </p>
              )}
            </div>
          )}
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
                        (event.maxParticipants ?? 0) < i + 1 ? 'red' : 'none',
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
  );
};

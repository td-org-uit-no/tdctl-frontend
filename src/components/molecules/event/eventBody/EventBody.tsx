import { useCallback, useContext, useEffect, useState } from 'react';
import styles from './eventBody.module.scss';
import { transformDate } from 'utils/timeConverter';
import EventButton from '../eventButton/EventButton';
import TextField from 'components/atoms/textfield/Textfield';
import Textarea from 'components/atoms/textarea/Textarea';
import Button from 'components/atoms/button/Button';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import { getJoinedParticipants, updateEvent, uploadEventPicture } from 'api';
import {
  addressValidator,
  dateValidator,
  descriptionValidator,
  maxParticipantsValidator,
  priceValidator,
  timeValidator,
  PNGImageValidator,
  eventTitleValidator,
} from 'utils/validators';
import useForm from 'hooks/useForm';
import { useHistory } from 'react-router-dom';
import { Event } from 'models/apiModels';
import { AuthenticateContext, RoleOptions, Roles } from 'contexts/authProvider';
import ReactMarkdown from 'react-markdown';
import FileSelector from 'components/atoms/fileSelector/FileSelector';
import { useToast } from 'hooks/useToast';

// TODO extend the admin features
export const EditEvent: React.FC<{ event: Event; setEdit: () => void }> = ({
  event,
  setEdit,
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const history = useHistory();
  const timeDate = new Date(event.date);
  const [togglePublic, setTogglePublic] = useState<boolean>(
    event.public ?? false
  );
  const [toggleFood, setToggleFood] = useState<boolean>(event.food ?? false);
  const [toggleTransportation, setToggleTransportation] = useState<boolean>(
    event.transportation ?? false
  );
  const [file, setFile] = useState<File | undefined>();
  const { addToast } = useToast();

  const initalValue = {
    title: event.title,
    description: event.description,
    date: event.date.split('T')[0], //sets [YYYY-MM-DD]
    time: timeDate.getHours() + ':' + timeDate.getMinutes(), //sets [HH:MM] and not [HH:MM:SS]
    address: event.address,
    price: event.price.toString(),
    // maxParticipants is set to "" when event does not have maxParticipants
    // since "" is the init value for fields["maxParticipants"]
    maxParticipants: event.maxParticipants?.toString() ?? '',
  };

  const validators = {
    title: eventTitleValidator,
    description: descriptionValidator,
    date: dateValidator,
    time: timeValidator,
    address: addressValidator,
    maxParticipants: maxParticipantsValidator,
    price: priceValidator,
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
      ...(fields['date']?.value + 'T' + fields['time']?.value !==
        initalValue.date + 'T' + initalValue.time && {
        date: fields['date']?.value + ' ' + fields['time']?.value,
      }),
      ...(fields['address']?.value !== event.address && {
        address: fields['address']?.value,
      }),
      ...(fields['price']?.value !== event.price.toString() && {
        price: Number(fields['price']?.value),
      }),
      // values to be removed must be sat ti null and not undefined as api sees null as a field which should be removed
      ...(fields['maxParticipants']?.value !== initalValue.maxParticipants && {
        maxParticipants:
          fields['maxParticipants'].value === ''
            ? null
            : Number(fields['maxParticipants']?.value),
      }),
      ...(toggleFood !== event.food && {
        food: toggleFood,
      }),
      ...(toggleTransportation !== event.transportation && {
        transportation: toggleTransportation,
      }),
      ...(togglePublic !== event.public && {
        public: togglePublic,
      }),
    } as Event;

    if (!Object.keys(updatePayload).length && !file) {
      setError('Minst et felt må endres');
      return;
    }
    try {
      if (file) {
        await uploadEventPicture(event.eid, file);
      }
    } catch (error) {
      addToast({
        title: 'Feil ved opplasting av bilde',
        status: 'error',
      });
      return;
    }
    try {
      /* Check both file and payload as we the set error does not trigger if the 
         file is set but the payload is not, and we cant send an empty payload*/
      if (Object.keys(updatePayload).length) {
        await updateEvent(event.eid, updatePayload);
      }
    } catch (error) {
      const detail = await error.getText();
      if (error.statusCode === 400) {
        addToast({
          title: 'Ikke godkjent oppdatering',
          status: 'error',
          description: `${detail}`,
        });
        return;
      }
      addToast({
        title: 'En ukjent feil skjedde ved oppdatering av arrangementet',
        status: 'error',
      });
      return;
    }
    addToast({
      title: 'Arrangement oppdatert',
      status: 'success',
    });

    setTimeout(function () {
      // reload page after some time for better UX
      // TODO: apply changes to component, avoiding data to be re fetched
      history.go(0);
    }, 300);
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
            <FileSelector
              setFile={setFile}
              text="Endre arrangement bilde"
              accept="image/png"
              fileValidator={PNGImageValidator}
            />
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.infoWrapper}>
              <div className={styles.infoSection}>
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
                    label={'Matservering'}></ToggleButton>
                  <ToggleButton
                    initValue={toggleTransportation}
                    onChange={() =>
                      setToggleTransportation(!toggleTransportation)
                    }
                    label={'Transport'}></ToggleButton>
                  <ToggleButton
                    initValue={togglePublic}
                    onChange={() => setTogglePublic(!togglePublic)}
                    label={
                      togglePublic ? 'Offentlig' : 'Privat'
                    }></ToggleButton>
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
          Forkast endringer
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
  const [participantsHeader, setParticipantHeader] = useState('');
  const [participantsText, setParticipantText] = useState('');
  const canJoinEvent = validJoin(role, event.registrationOpeningDate);
  const { authenticated } = useContext(AuthenticateContext);

  // sets correct header and text based on what the user should see
  function getParticipantsText(
    maxParticipants: number | undefined,
    participants?: number
  ) {
    if (role === Roles.admin) {
      setParticipantHeader('Antall deltakere');
      return `${participants} ${
        event.maxParticipants ? '/ ' + maxParticipants : ''
      } påmeldt `;
    }
    // juggling-check, checks for both null and undefined
    if (maxParticipants == null) {
      setParticipantHeader('Antall deltakere');
      return `${participants} skal`;
    }
    setParticipantHeader('Antall plasser totalt');
    return `${maxParticipants} plasser`;
  }

  const getNumberOfParticipants = useCallback(async () => {
    if (!authenticated) {
      setParticipantText('Logg inn for å se flere detaljer');
      return;
    }
    try {
      const resp = await getJoinedParticipants(event.eid);
      const str = getParticipantsText(event?.maxParticipants, resp.length);
      setParticipantText(str);
    } catch (error) {
      if (error.statusCode === 401) {
        const str = getParticipantsText(event?.maxParticipants);
        setParticipantText(str);
      }
      if (error.statusCode === 403) {
        setParticipantText('Logg inn for å se flere detaljer');
      }
    }
  }, [event.eid, event?.maxParticipants]);

  useEffect(() => {
    // only fetch participants list when the list is actually used
    // the list/number of participants should only be displayed for admins and events with no cap
    getNumberOfParticipants();
  }, [getNumberOfParticipants, authenticated]);

  return (
    <div className={styles.contentContainer}>
      <div className={styles.contentHeader}>
        <h3>{event.title}</h3>
        <p> Bli med {transformDate(new Date(event.date))}</p>
      </div>
      <div className={styles.description}>
        <div className={styles.descriptionContainer}>
          <ReactMarkdown children={event.description} />
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
          <p>{participantsHeader}</p>
          {participantsText}
          {role === 'admin' && (
            <ol>
              {event.participants?.map((p, i, arr) => {
                return (
                  <li
                    key={i}
                    style={{
                      color:
                        (event.maxParticipants ?? arr.length) < i + 1
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
  );
};

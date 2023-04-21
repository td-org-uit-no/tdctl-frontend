import { useState } from 'react';
import useForm from 'hooks/useForm';
import TextField from 'components/atoms/textfield/Textfield';
import {
  descriptionValidator,
  dateValidator,
  timeValidator,
  addressValidator,
  emptyFieldsValidator,
  priceValidator,
  maxParticipantsValidator,
  PNGImageValidator,
  eventTitleValidator,
} from 'utils/validators';
import styles from './eventForm.module.scss';
import Button from 'components/atoms/button/Button';
import { createEvent, uploadEventPicture } from 'api';
import { useHistory } from 'react-router-dom';
import Textarea from 'components/atoms/textarea/Textarea';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import DropdownHeader from 'components/atoms/dropdown/dropdownHeader/DropdownHeader';
import { useToast } from 'hooks/useToast';
import FileSelector from 'components/atoms/fileSelector/FileSelector';
import ReuploadImageModal from 'components/molecules/modals/reuploadModal/ReuploadModal';

const EventForm = () => {
  const [file, setFile] = useState<File | undefined>();
  const [eid, setEid] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [food, setFood] = useState<boolean>(false);
  const [transportation, setTransportation] = useState<boolean>(false);
  const [publicEvent, setPublicEvent] = useState<boolean>(false);
  const [shouldOpen, setShouldOpen] = useState<boolean>(false);
  const [bindingRegistration, setBindingRegistration] =
    useState<boolean>(false);
  const { addToast } = useToast();
  const history = useHistory();

  const validators = {
    title: eventTitleValidator,
    description: descriptionValidator,
    date: dateValidator,
    time: timeValidator,
    address: addressValidator,
    price: priceValidator,
    maxParticipants: maxParticipantsValidator,
  };
  // allows maxParticipants to be empty
  const optionalKeys = ['maxParticipants'];

  const submit = async () => {
    const emptyFields = emptyFieldsValidator({
      fields: fields,
      optFields: optionalKeys,
    });

    emptyFields ? setError('Alle feltene må fylles ut') : setError(undefined);

    if (hasErrors || emptyFields) {
      return;
    }
    try {
      const price = parseInt(fields['price']?.value);
      const maxParticipants = parseInt(fields['maxParticipants']?.value);
      let regDate = undefined;
      if (fields['registerDate']?.value && fields['registerTime']?.value) {
        regDate =
          fields['registerDate']?.value + ' ' + fields['registerTime']?.value;
      }
      const resp = await createEvent({
        title: fields['title']?.value,
        description: fields['description']?.value,
        date: fields['date']?.value + ' ' + fields['time']?.value,
        address: fields['address']?.value,
        maxParticipants: maxParticipants,
        price: price,
        food: food,
        transportation: transportation,
        public: publicEvent,
        bindingRegistration: bindingRegistration,
        registrationOpeningDate: regDate,
      });
      setEid(resp.eid);
      if (file) {
        try {
          await uploadEventPicture(resp.eid, file);
        } catch (error) {
          setShouldOpen(true);
          addToast({
            title: 'Feil ved opplasting av bilde',
            status: 'error',
            description: 'prøv på nytt',
          });
          return;
        }
      }
      addToast({
        title: 'Suksess',
        status: 'success',
        description: `${fields['title']?.value} er lagt til`,
      });
      history.push('/event/' + resp.eid);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          addToast({
            title: 'Feil ved opplasting',
            status: 'error',
            description: 'Ikke gylding dato',
          });
          setError('Ugyldig dato');
          return;
        case 422:
          setError('Alle feltene må fylles ut');
          return;
        default:
          addToast({
            title: 'En ukjent feil skjedde',
            status: 'error',
          });
          setError('Noe gikk galt');
          return;
      }
    }
  };

  const { fields, onFieldChange, hasErrors, onSubmitEvent } = useForm({
    onSubmit: submit,
    validators: validators,
  });

  // TODO fix date-time alignment and better description textarea
  return (
    <div className={styles.eventForm}>
      <form onSubmit={onSubmitEvent} className={styles.eventContainer}>
        <TextField
          name={'title'}
          label={'Tittel'}
          minWidth={40}
          onChange={onFieldChange}
          error={fields['title'].error}
        />
        <TextField
          name={'date'}
          label={'Dato'}
          type={'date'}
          minWidth={40}
          onChange={onFieldChange}
        />
        <TextField
          name={'time'}
          label={'Tid'}
          type={'time'}
          minWidth={40}
          onChange={onFieldChange}
        />

        <TextField
          name={'address'}
          label={'Adresse'}
          minWidth={40}
          onChange={onFieldChange}
          error={fields['address'].error}
        />

        <TextField
          name={'price'}
          label={'Pris'}
          minWidth={40}
          type={'number'}
          onChange={onFieldChange}
          error={fields['price'].error}
        />
        <TextField
          name={'maxParticipants'}
          label={'Maks antall deltagere (valgfritt)'}
          type={'number'}
          minWidth={40}
          onChange={onFieldChange}
          error={fields['maxParticipants'].error}
        />

        <Textarea
          name={'description'}
          label={'Beskrivelse'}
          minWidth={65}
          onChange={onFieldChange}
          resize={true}
          error={fields['description'].error}
        />

        <DropdownHeader
          title={'Valgfritt: Sett dato for når påmeldingen åpner'}
          style={{ width: '100%' }}>
          <div className={styles.registerContainer}>
            <TextField
              name={'registerDate'}
              label={'Påmeldings dato'}
              type={'date'}
              minWidth={40}
              onChange={onFieldChange}
            />
            <TextField
              name={'registerTime'}
              label={'Tid'}
              type={'time'}
              minWidth={40}
              onChange={onFieldChange}
            />
          </div>
        </DropdownHeader>
        <div className={styles.toggleContainer}>
          <ToggleButton
            onChange={() => {
              setFood(!food);
            }}
            label={'Servering av mat'}
            initValue={food}></ToggleButton>
          <ToggleButton
            onChange={() => {
              setTransportation(!transportation);
            }}
            label={'Mulighet for transport'}
            initValue={transportation}></ToggleButton>
          <ToggleButton
            onChange={() => {
              setPublicEvent(!publicEvent);
            }}
            label={'Skal arrangementet være synlig for vanlige brukere'}
            initValue={publicEvent}></ToggleButton>
          <ToggleButton
            onChange={() => {
              setBindingRegistration(!bindingRegistration);
            }}
            label={'Bindende påmelding'}
            initValue={bindingRegistration}></ToggleButton>
        </div>
        <FileSelector
          setFile={setFile}
          text="Last opp bilde til arrangementet"
          fileValidator={PNGImageValidator}
          accept="image/png"
        />
      </form>
      <div>
        <ReuploadImageModal
          title="Last opp bilde til arrangementet på nytt"
          id={eid}
          shouldOpen={shouldOpen}
          prefix={`/event`}
          textOnFinish="Arrangementet er opprettet"
          uploadFunction={uploadEventPicture}
        />
        {error && <p>{error}</p>}
        <Button version={'primary'} onClick={submit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EventForm;

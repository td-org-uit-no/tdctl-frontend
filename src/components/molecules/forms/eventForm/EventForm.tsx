import React, { useState } from 'react';
import useForm from 'hooks/useForm';
import TextField from 'components/atoms/textfield/Textfield';
import {
  titleValidator,
  descriptionValidator,
  dateValidator,
  timeValidator,
  addressValidator,
  emptyFieldsValidator,
  priceValidator,
  maxParticipantsValidator,
} from 'utils/validators';
import styles from './eventForm.module.scss';
import Button from 'components/atoms/button/Button';
import { createEvent, uploadEventPicture } from 'api';
import { useHistory } from 'react-router-dom';
import Textarea from 'components/atoms/textarea/Textarea';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';

const EventForm = () => {
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const history = useHistory();
  const [food, setFood] = useState<boolean>(false);
  const [transportation, setTransportation] = useState<boolean>(false);

  const validators = {
    title: titleValidator,
    description: descriptionValidator,
    date: dateValidator,
    time: timeValidator,
    address: addressValidator,
    price: priceValidator,
    maxParticipants: maxParticipantsValidator,
  };

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  const submit = async () => {
    const emptyFields = emptyFieldsValidator({
      fields: fields,
    });

    emptyFields ? setError('Alle feltene må fylles ut') : setError(undefined);

    if (hasErrors || emptyFields) {
      return;
    }
    try {
      const price = parseInt(fields['price']?.value);
      const maxParticipants = parseInt(fields['maxParticipants']?.value);
      const resp = await createEvent({
        title: fields['title']?.value,
        description: fields['description']?.value,
        date: fields['date']?.value + ' ' + fields['time']?.value,
        address: fields['address']?.value,
        maxParticipants: maxParticipants,
        price: price,
        food: food,
        transportation: transportation,
        active: false,
      });
      // TODO handle image upload errors separately
      if (file) {
        const data = new FormData();
        data.append('image', file, file.name);
        await uploadEventPicture(resp.eid, data);
      }
      history.push('/event/' + resp.eid);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          setError('Invalid date');
          return;
        case 422:
          setError('Alle feltene må fylles ut');
          return;
        default:
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
          minWidth={35}
          name={'title'}
          label={'Tittel'}
          onChange={onFieldChange}
          error={fields['title'].error}
        />

        <div className={styles.dateTimeWrapper}>
          <div className={styles.date}>
            <TextField
              minWidth={14}
              name={'date'}
              label={'Dato'}
              type={'date'}
              onChange={onFieldChange}
            />
          </div>
          <div className={styles.time}>
            <TextField
              minWidth={12}
              name={'time'}
              label={'Tid'}
              type={'time'}
              onChange={onFieldChange}
            />
          </div>
        </div>

        <TextField
          minWidth={35}
          name={'address'}
          label={'Adresse'}
          onChange={onFieldChange}
          error={fields['address'].error}
        />

        <Textarea
          minWidth={33}
          name={'description'}
          label={'Beskrivelse'}
          onChange={onFieldChange}
          error={fields['description'].error}
        />

        <TextField
          minWidth={35}
          name={'price'}
          label={'Pris'}
          type={'number'}
          onChange={onFieldChange}
          error={fields['price'].error}
        />
        <TextField
          minWidth={35}
          name={'maxParticipants'}
          label={'Maks antall deltagere'}
          type={'number'}
          onChange={onFieldChange}
          error={fields['maxParticipants'].error}
        />
        <div
          style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          <ToggleButton
            onChange={() => {
              setFood(!food);
            }}
            label={'Servering av mat'}
            initValue={food}></ToggleButton>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          <ToggleButton
            onChange={() => {
              setTransportation(!transportation);
            }}
            label={'Mulighet for transport'}
            initValue={transportation}></ToggleButton>
        </div>
        <div className={styles.imgContainer}>
          <label>Last opp bilde til arrangementet </label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </div>
      </form>
      <div>
        {error && <p>{error}</p>}
        <Button version={'primary'} onClick={submit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EventForm;

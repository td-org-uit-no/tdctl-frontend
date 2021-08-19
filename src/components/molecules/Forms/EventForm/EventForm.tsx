import React, { useState } from 'react';
import useForm from 'hooks/useForm';
import TextField from 'components/atoms/textfield/Textfield';
import {
  nameValidator,
  descriptionValidator,
  dateValidator,
  timeValidator,
  addressValidator,
  emptyFieldsValidator,
} from 'utils/validators';
import styles from './eventForm.module.scss';
import Button from 'components/atoms/button/Button';
import { createEvent } from 'utils/api';
import { useHistory } from 'react-router-dom';

const EventForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const history = useHistory();
  const validators = {
    title: nameValidator,
    description: descriptionValidator,
    date: dateValidator,
    time: timeValidator,
    address: addressValidator,
  };
  const optionalKeys = ['description'];

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
      const id = await createEvent({
        title: fields['title']?.value,
        description: fields['description']?.value,
        date: fields['date']?.value + ' ' + fields['time']?.value,
        address: fields['address']?.value,
      });
      console.log(id);
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
    history.push('/');
  };

  const { fields, onFieldChange, hasErrors, onSubmitEvent } = useForm({
    onSubmit: submit,
    validators: validators,
  });

  return (
    <div className={styles.eventForm}>
      <form onSubmit={onSubmitEvent} className={styles.eventContainer}>
        <TextField
          name={'title'}
          maxWidth={40}
          label={'Tittel'}
          onChange={onFieldChange}
          error={fields['title'].error}
        />
        <TextField
          name={'description'}
          maxWidth={40}
          label={'Beskrivelse'}
          onChange={onFieldChange}
        />

        <div className={styles.dateTimeWrapper}>
          <TextField
            className={styles.dateTimeInput}
            name={'date'}
            maxWidth={40}
            label={'Dato'}
            type={'date'}
            onChange={onFieldChange}
          />
          <TextField
            className={styles.dateTimeInput}
            name={'time'}
            maxWidth={40}
            label={'Tid'}
            type={'time'}
            onChange={onFieldChange}
          />
        </div>

        <TextField
          name={'address'}
          maxWidth={40}
          label={'Adresse'}
          onChange={onFieldChange}
          error={fields['address'].error}
        />
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

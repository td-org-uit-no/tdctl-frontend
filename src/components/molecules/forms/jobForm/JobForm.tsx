import React, { useState } from 'react';
import useForm from 'hooks/useForm';
import TextField from 'components/atoms/textfield/Textfield';
import {
  JobDescriptionValidator,
  dateValidator,
  emptyFieldsValidator,
  JobDescriptionPreviewValidator,
  JobTypeValidator,
  JobLocationValidator,
  JobTitleValidator,
} from 'utils/validators';
import './jobForm.scss';
import Button from 'components/atoms/button/Button';
import { createJob, uploadJobPicture } from 'api/jobs';
import { useHistory } from 'react-router-dom';
import Textarea from 'components/atoms/textarea/Textarea';

const JobForm = () => {
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const history = useHistory();

  const validators = {
    company: JobTitleValidator,
    title: JobTitleValidator,
    description_preview: JobDescriptionPreviewValidator,
    description: JobDescriptionValidator,
    due_date: dateValidator,
    start_date: dateValidator,
    location: JobLocationValidator,
    link: JobLocationValidator,
    type: JobTypeValidator,
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
    const _tags = fields['tags']?.value.split(' ');
    emptyFields ? setError('Alle feltene må fylles ut') : setError(undefined);
    if (hasErrors || emptyFields) {
      return;
    }
    try {
      const resp = await createJob({
        company: fields['company']?.value,
        title: fields['title']?.value,
        type: fields['type']?.value,
        tags: _tags,
        description_preview: fields['description_preview'].value,
        description: fields['description'].value,
        start_date: new Date(fields['start_date'].value),
        location: fields['location'].value,
        link: fields['link'].value,
        due_date: new Date(fields['due_date'].value),
        published_date: new Date(),
      });
      if (file) {
        const data = new FormData();
        data.append('image', file, file.name);
        await uploadJobPicture(resp.id, data);
      }
      history.push('/jobs/' + resp.id);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          setError('Ugyldig dato');
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
    <div className={'jobForm'}>
      <form onSubmit={onSubmitEvent} className={'eventContainer'}>
        <TextField
          minWidth={35}
          name={'company'}
          label={'Bedrift'}
          onChange={onFieldChange}
          error={fields['company'].error}
        />
        <TextField
          minWidth={35}
          name={'type'}
          label={'Type'}
          onChange={onFieldChange}
          error={fields['type'].error}
        />
        <TextField
          minWidth={35}
          name={'tags'}
          label={'Tags(space separated)'}
          onChange={onFieldChange}
        />
        <TextField
          minWidth={35}
          name={'title'}
          label={'Tittel'}
          onChange={onFieldChange}
          error={fields['title'].error}
        />

        <TextField
          minWidth={35}
          name={'location'}
          label={'Lokasjon'}
          onChange={onFieldChange}
          error={fields['location'].error}
        />
        <Textarea
          minWidth={33}
          name={'description_preview'}
          label={'Beskrivelse forhåndsvisning'}
          onChange={onFieldChange}
          error={fields['description_preview'].error}
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
          name={'link'}
          label={'Link til bedrift'}
          onChange={onFieldChange}
          error={fields['link'].error}
        />
        <div className={'dateTimeWrapper'}>
          <div className={'date'}>
            <TextField
              minWidth={33}
              name={'due_date'}
              label={'Søknadsfrist'}
              type={'date'}
              onChange={onFieldChange}
            />
          </div>
          <div className={'time'}>
            <TextField
              minWidth={33}
              name={'start_date'}
              label={'Start dato'}
              type={'date'}
              onChange={onFieldChange}
            />
          </div>
        </div>

        <div className={'imgContainer'}>
          <label>Last opp bilde til jobben </label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </div>
      </form>
      <div>
        {error && <p>{error}</p>}
        <Button version={'primary'} onClick={submit}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default JobForm;

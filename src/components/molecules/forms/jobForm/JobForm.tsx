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
  PNGImageValidator,
} from 'utils/validators';
import './jobForm.scss';
import Button from 'components/atoms/button/Button';
import { createJob, uploadJobPicture } from 'api/jobs';
import { useHistory } from 'react-router-dom';
import Textarea from 'components/atoms/textarea/Textarea';
import Modal from 'components/molecules/modal/Modal';
import { JobItem } from 'models/apiModels';
import useModal from 'hooks/useModal';
import FileSelector from 'components/atoms/fileSelector/FileSelector';
import { useToast } from 'hooks/useToast';
import ReuploadImageModal from 'components/molecules/modals/reuploadModal/ReuploadModal';
import { ValidJob } from 'components/pages/jobs/Job';

const JobForm: React.FC = () => {
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [prevData, setPrevData] = useState<JobItem | undefined>(undefined);
  const [id, setId] = useState<string | undefined>(undefined);
  const [shouldReupload, setShouldReupload] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useModal();
  const { addToast } = useToast();
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

  const getJob = () => {
    return {
      company: fields['company']?.value,
      title: fields['title']?.value,
      type: fields['type']?.value,
      tags: fields['tags']?.value.split(' '),
      description_preview: fields['description_preview'].value,
      description: fields['description'].value,
      start_date:
        fields['start_date'].value !== ''
          ? new Date(fields['start_date'].value)
          : undefined,
      location: fields['location'].value,
      link: fields['link'].value,
      due_date:
        fields['due_date'].value !== ''
          ? new Date(fields['due_date'].value)
          : undefined,

      published_date: new Date(),
    } as JobItem;
  };

  const submit = async () => {
    const emptyFields = emptyFieldsValidator({
      fields: fields,
      optFields: ['due_date', 'start_date'],
    });
    emptyFields ? setError('Alle feltene må fylles ut') : setError(undefined);
    if (hasErrors || emptyFields) {
      return;
    }
    try {
      const data = getJob();
      const resp = await createJob(data);
      setId(resp.id);
      if (file) {
        try {
          await uploadJobPicture(resp.id, file);
        } catch (error) {
          setShouldReupload(true);
          addToast({
            title: 'Feil ved opplasting av bilde',
            status: 'error',
            description: 'prøv på nytt',
          });
          return;
        }
      }
      addToast({
        title: 'Stillingsutlysning lagt til',
        status: 'success',
      });
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

  const preview = () => {
    const data = getJob();
    setPrevData(data);
    onOpen();
  };

  const { fields, onFieldChange, hasErrors, onSubmitEvent } = useForm({
    onSubmit: submit,
    validators: validators,
  });

  // TODO fix date-time alignment and better description textarea
  return (
    <div className={'jobsFormContainer'}>
      <form onSubmit={onSubmitEvent} className={'jobsForm'}>
        <div className={'shortInfo'}>
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
          <TextField
            minWidth={35}
            name={'link'}
            label={'Link til bedrift'}
            onChange={onFieldChange}
            error={fields['link'].error}
          />
          <TextField
            minWidth={33}
            name={'due_date'}
            label={'Søknadsfrist'}
            type={'date'}
            onChange={onFieldChange}
          />
          <TextField
            minWidth={33}
            name={'start_date'}
            label={'Start dato'}
            type={'date'}
            onChange={onFieldChange}
          />
        </div>
        <div className={'descriptions'}>
          <Textarea
            name={'description_preview'}
            label={'Beskrivelse forhåndsvisning'}
            onChange={onFieldChange}
            resize={true}
            error={fields['description_preview'].error}
          />
          <Textarea
            name={'description'}
            label={'Beskrivelse'}
            resize={true}
            onChange={onFieldChange}
            error={fields['description'].error}
          />
        </div>
      </form>
      <Modal title="Forhåndsvisning" isOpen={isOpen} onClose={onClose}>
        <div
          style={{
            display: 'flex',
            width: '95vw',
            height: '85vh',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}>
          <ValidJob jobData={prevData} />
        </div>
      </Modal>
      <ReuploadImageModal
        title="Last opp stillingsutlysning bilde på nytt"
        id={id}
        shouldOpen={shouldReupload}
        prefix={`/jobs`}
        textOnFinish="Stillingsutlysningen er opprettet"
        uploadFunction={uploadJobPicture}
      />
      <div>
        <div className={'upload'}>
          {error && <p>{error}</p>}
          <FileSelector
            setFile={setFile}
            text="Last opp bilde til stillingsutlysningen"
            accept="image/png"
            fileValidator={PNGImageValidator}
          />
          <Button version={'primary'} onClick={submit}>
            Send
          </Button>
          <Button version="primary" onClick={preview}>
            Forhåndsvisning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobForm;

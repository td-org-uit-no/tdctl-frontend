import React, { useState } from 'react';
import styles from './settingsForm.module.scss';
import Button from 'components/atoms/button/Button';
import useForm from 'hooks/useForm';
import { updateMember } from 'api';
import { useHistory } from 'react-router-dom';
import TextField from 'components/atoms/textfield/Textfield';
import DropDownHeader from 'components/atoms/dropdown/dropdownHeader/DropdownHeader';
import DropDown from 'components/atoms/dropdown/Dropdown';
import * as v from 'utils/validators';
import { useToast } from 'hooks/useToast';

interface Props {
  init: { [key: string]: string } | undefined;
}

const SettingsForm: React.FC<Props> = ({ init }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [phoneExpanded, setPhoneExpanded] = useState(false);
  const [phoneBtnTxt, setButtonTxt] = useState('Legg til');
  const history = useHistory();
  const { addToast } = useToast();

  const validators = {
    name: v.notRequiredNameValidator,
    email: v.emailValidator,
    classof: v.classOfValidator,
    phone: v.notRequiredPhoneValidator,
  };

  const submit = async () => {
    if (hasErrors) {
      return;
    }

    //only adds fields that contains data
    const data = {
      ...(fields['name']?.value !== init?.name && {
        realName: fields['name']?.value,
      }),
      ...(fields['email']?.value !== init?.email && {
        email: fields['email']?.value,
      }),
      ...(fields['classof']?.value !== init?.classof && {
        classof: fields['classof']?.value,
      }),
      ...(fields['phone']?.value !== init?.phone &&
        phoneExpanded && {
          phone: fields['phone']?.value,
        }),
    };

    if (!Object.keys(data).length) {
      setError('Minst et felt må endres');
      return;
    }

    try {
      await updateMember(data);
      history.push('/profile');
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Bruker oppdatert',
      });
    } catch (error) {
      if (error.statusCode === 400) {
        setError('Minst et felt må fylles ut');
        return;
      }
      if (error.statusCode === 422) {
        //422 only returns on error in email
        setError('Ikke gyldig epost');
        return;
      }
      if (error.statusCode === 500) {
        setError('Internal server error');
        return;
      }
    }
  };

  const { fields, onFieldChange, hasErrors } = useForm({
    onSubmit: submit,
    validators: validators,
    initalValue: init,
  });

  const updatePhoneData = () => {
    setPhoneExpanded(!phoneExpanded);
    const phoneTxt = !phoneExpanded ? 'Fjern ' : 'Legg til';
    setButtonTxt(phoneTxt);
  };
  return (
    <div className={styles.general}>
      <DropDownHeader title={'Generell info'}>
        <div className={styles.info}>
          <TextField
            name={'name'}
            maxWidth={40}
            value={fields['name'].value}
            label={'Endre navn'}
            onChange={onFieldChange}
            error={fields['name'].error}
          />
          <br />
          <TextField
            name={'email'}
            maxWidth={40}
            value={fields['email'].value}
            label={'Endre epost'}
            onChange={onFieldChange}
            error={fields['email'].error}
          />
          <br />
          <TextField
            name={'classof'}
            maxWidth={40}
            value={fields['classof'].value}
            label={'Endre årskull'}
            type="number"
            onChange={onFieldChange}
            error={fields['classof'].error}
          />
          {init?.phone ? (
            <>
              <br />
              <TextField
                name={'phone'}
                maxWidth={40}
                type="number"
                value={fields['phone'].value}
                label={'Endre mobilnummer'}
                onChange={onFieldChange}
                error={fields['phone'].error}
              />
            </>
          ) : (
            <div>
              <Button
                version="secondary"
                onClick={updatePhoneData}
                style={{ margin: '1rem 0 1rem 0' }}>
                {phoneBtnTxt} Mobil
              </Button>
              <DropDown expanded={phoneExpanded}>
                <TextField
                  name={'phone'}
                  maxWidth={40}
                  type="number"
                  value={fields['phone'].value}
                  label={'Mobilnummer'}
                  onChange={onFieldChange}
                  error={fields['phone'].error}
                />
              </DropDown>
            </div>
          )}
          {error !== undefined && <p>{error}</p>}
          <Button
            className={styles.submitButton}
            version="secondary"
            onClick={submit}>
            Submit
          </Button>
        </div>
      </DropDownHeader>
    </div>
  );
};

export default SettingsForm;

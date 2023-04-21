import { Fields } from 'hooks/useForm';

function numberValidator(value: string): boolean {
  const numbReg = /^[0-9]*$/;
  return new RegExp(numbReg).test(value);
}

export const emailValidator = (email: string) => {
  const errors: string[] = [];
  const emailReg = /.+@.+\.[A-Za-z]+$/;

  if (email.length < 4) {
    return ['Eposten er ikke gyldig'];
  }
  if (!new RegExp(emailReg).test(email)) {
    return ['Eposten er ikke gyldig'];
  }

  return errors.length > 0 ? errors : undefined;
};

export const passwordValidator = (password: string): string[] | undefined => {
  const errors: string[] = [];

  const validation = [
    { key: /\d+/g, msg: 'Passordet må inneholde minst et tall' },
    { key: /[a-zæøå]/g, msg: 'Passordet må inneholde små bokstaver' },
    { key: /[A-ZÆØÅ]/g, msg: 'Passordet må inneholde store bokstaver' },
    {
      key: /[!-/:-@[-`{-~]/g,
      msg: 'Passordet må inneholde minst et spesial tegn',
    },
    { key: /^.{8,}$/g, msg: 'Passordet må inneholde minst 8 bokstaver' },
  ];

  validation.forEach((item) => {
    if (!new RegExp(item.key).test(password)) {
      errors.push(item.msg);
    }
  });

  return errors.length > 0 ? errors : undefined;
};

// allows field to be undefined i.e optional validator
export const maxParticipantsValidator = (
  maxParticipants: string | undefined
): string[] | undefined => {
  if (maxParticipants !== undefined) {
    if (parseInt(maxParticipants) < 0) {
      return ['Maks antall kan ikke være negativt'];
    }
  }
  return undefined;
};

export const nameValidator = (name: string): string[] | undefined => {
  const nameReg = /^[a-zæøåA-ZÆØÅ ]+$/; //! note the last space

  if (name.length === 0) {
    return ['Navn er påkrevd'];
  }
  if (!new RegExp(nameReg).test(name)) {
    return ['Kun bokstavene A-Å'];
  }
  return undefined;
};

export const lastNameValidator = (name: string): string[] | undefined => {
  if (name.length === 0) {
    return ['Etternavn er påkrevd'];
  }
  return nameValidator(name);
};

export const titleValidator = (name: string): string[] | undefined => {
  const nameReg = /^[a-zæøåA-ZÆØÅ ]+$/; //! note the last space

  if (name.length === 0) {
    return ['Tittel er påkrevd'];
  }
  if (!new RegExp(nameReg).test(name)) {
    return ['Kun bokstavene A-Å'];
  }
  return undefined;
};

export const notRequiredNameValidator = (name: string): string[] | undefined =>
  !name.length ? undefined : nameValidator(name);

export const classOfValidator = (year: string): string[] | undefined => {
  if (!numberValidator(year)) {
    return ['Studiestart kan kun inneholde tall'];
  }
  if (year.length !== 4) {
    return ['Studiestart må være på formen: YYYY'];
  }

  const currentYear = new Date().getFullYear();
  if (Number(year) > currentYear || Number(year) < 1968) {
    return ['Ikke godkjent årstall'];
  }

  return undefined;
};

export const notRequiredPhoneValidator = (
  phone: string
): string[] | undefined => (!phone.length ? undefined : phoneValidator(phone));

export const phoneValidator = (num: string): string[] | undefined => {
  // assumes all numbers are Norwegian
  if (!numberValidator(num)) {
    return ['Telefonnummeret kan kun inneholde tall'];
  }

  if (num.length !== 8) {
    return ['Telefonnummer må inneholde 8 tall'];
  }
  return undefined;
};

export const eventTitleValidator = (title: string) => {
  return title.length ? undefined : ['Arrangement tittelen må fylles ut'];
};

export const addressValidator = (address: string) => {
  return address.length ? undefined : ['Adresse må fylles ut'];
};

export const priceValidator = (price: string) => {
  return price.length ? undefined : ['Arrangement pris må fylles ut'];
};

export const dateValidator = (date: string) => {
  return date.length ? undefined : ['Dato må fylles ut'];
};

export const timeValidator = (time: string) => {
  return time.length ? undefined : ['Tidspunkt må fylles ut'];
};

// description length constraint
export const descriptionValidator = (description: string) => {
  return description.length
    ? undefined
    : ['Arrangement beskrivelse må fylles ut'];
};

interface InputFields {
  fields: Fields;
  optFields?: string[];
}

// validates if fields all required fields are filled
// optFields array of keys which are allowed to be empty
export const emptyFieldsValidator = ({ fields, optFields }: InputFields) => {
  return (
    Object.keys(fields).filter((key) => {
      return !fields[key].value.length && !optFields?.includes(key);
    }).length !== 0
  );
};

// Job validators//
export const JobDescriptionPreviewValidator = (description: string) => {
  return description.length >= 750 ? ['Beskrivelse er for lang'] : undefined;
};
export const JobDescriptionValidator = (description: string) => {
  return description.length >= 7500 ? ['Beskrivelse er for lang'] : undefined;
};

export const JobTypeValidator = (description: string) => {
  return description.length >= 35 ? ['Typen er for lang'] : undefined;
};

export const JobLocationValidator = (description: string) => {
  return description.length >= 100 ? ['Lokasjon er for lang'] : undefined;
};
export const JobTitleValidator = (title: string) => {
  return title.length >= 50 ? ['Tittel er for lang'] : undefined;
};

export const PNGImageValidator = (file: File) => {
  return file.type !== 'image/png' ? 'Kun PNG filer er støttet' : undefined;
};

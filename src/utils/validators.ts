import {Fields} from 'hooks/useForm';

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
    { key: /[@$!%*?&]/g, msg: 'Passordet må inneholde minst et spesial tegn' },
    { key: /^.{8,}$/g, msg: 'Passordet må inneholde minst 8 bokstaver' },
  ];

  validation.forEach((item) => {
    if (!new RegExp(item.key).test(password)) {
      errors.push(item.msg);
    }
  });

  return errors.length > 0 ? errors : undefined;
};

export const nameValidator = (name: string): string[] | undefined => {
  const nameReg = /^[a-zæøåA-ZÆØÅ ]+$/ //! note the last space

  if (name.length === 0) {
    return ['Navn er påkrevd'];
  }
  if (!new RegExp(nameReg).test(name)) {
    return ['Kun bokstavene A-Å'];
  }
  return undefined;
};

export const titleValidator = (name: string): string[] | undefined => {
  const nameReg = /^[a-zæøåA-ZÆØÅ ]+$/ //! note the last space

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
  const numbReg = /^[0-9]*$/

  if (year.length !== 4){
    return['Årskull: YYYY']
  }

  if (!new RegExp(numbReg).test(year)) {
    return ['Årskull kan kun inneholde tall'];
  }
  /* Reactivate when backend has a proper validation
  if (year.length > 4) {
    return ['Årskull: YYYY'];
  }
  const currentYear = new Date().getFullYear();
  if (Number(year) > currentYear || Number(year) < 1968) {
    return ['Ikke godkjent årskull'];
  }
  */
  return undefined;
};

export const notRequiredPhoneValidator = (phone: string): string[] | undefined =>
  !phone.length ? undefined : phoneValidator(phone)

export const phoneValidator = (num: string): string[] | undefined => {
  if (num.length !== 8) {
    return ['Telefon nummer må inneholde 8 tall'];
  }
  return undefined;
};

export const addressValidator = (address: string) => {
  return address.length ? undefined : ['Adresse må fylles ut'];
}

export const priceValidator = (price: string) => {
  return price.length ? undefined : ['Arrangement pris må fylles ut'];
}

export const dateValidator = (date: string) => {
  return date.length ? undefined : ['Dato må fylles ut'];
}

export const timeValidator = (time: string) => {
  return time.length ? undefined : ['Tidspunkt må fylles ut'];
}

// description length constraint
export const descriptionValidator = (description: string) => {
  return description.length >= 750 ? ['Beskrivelse er for lang'] : undefined;
}

interface InputFields {
  fields: Fields;
  optFields?: string[];
}

export const emptyFieldsValidator = ({ fields, optFields }: InputFields) => {
  return Object.keys(fields).filter((key) => {
    return !fields[key].value.length && !optFields?.includes(key);
  }).length !== 0;
};

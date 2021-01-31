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
  const nameReg = /^[a-zæøå]/gi;

  if (name.length === 0) {
    return ['Navn er påkrevd'];
  }
  if (!new RegExp(nameReg).test(name)) {
    return ['Kun bokstavene A-Å'];
  }
  return undefined;
};

export const classOfValidator = (year: string): string[] | undefined => {
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

export const phoneValidator = (num: string): string[] | undefined => {
  if (num.length !== 8) {
    return ['Telefon nummer må inneholde 8 tall'];
  }
  return undefined;
};

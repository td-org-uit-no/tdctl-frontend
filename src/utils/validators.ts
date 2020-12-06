export const emailValidator = (email: string) => {
  if (email.length === 0) {
    return ['E-post er påkrevd'];
  }
  if (email.length < 2) {
    return ['E-posten er ikke gyldig'];
  }
};

export const passwordValidator = (password: string): string[] | undefined => {
  const errors: string[] = [];

  const validation = [
    { key: /\w{8,}$/g, msg: 'Passordet må inneholde minst 8 bokstaver' },
    { key: /\d+/g, msg: 'Passordet må inneholde minst et tall' },
    { key: /[a-z\æøå]/g, msg: 'Passordet må inneholde små bokstaver' },
    { key: /[A-Z\ÆØÅ]/g, msg: 'Passordet må inneholde store bokstaver' },
    { key: /[@$!%*?&]/g, msg: 'Passordet må inneholde minst et spesial tegn' },
  ];

  validation.map((item) => {
    if (!new RegExp(item.key).test(password)) {
      errors.push(item.msg);
    }
  });

  return errors.length > 0 ? errors : undefined;
};

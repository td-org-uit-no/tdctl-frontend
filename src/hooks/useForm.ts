import { useEffect, useState } from 'react';
import { dictFromArray } from 'utils/general';

interface Field {
  value: string;
  error: string[] | undefined;
}
interface Fields {
  [name: string]: Field;
}
interface Validators {
  [key: string]: (value: string) => string[] | undefined;
}

const useForm = (onSubmit: () => any, validators?: Validators) => {
  const initialFields = !validators
    ? {}
    : dictFromArray<Field>(Object.keys(validators), {
        value: '',
        error: undefined,
      });

  const [fields, setFields] = useState<Fields>(initialFields);

  /* Finding errors across the enitre form */
  const [hasErrors, setErrors] = useState(false);

  useEffect(() => {
    const isThereErrors = (fields: Field[]) =>
      fields.filter((field) => field.error !== undefined).length > 0;

    setErrors(isThereErrors(Object.keys(fields).map((field) => fields[field])));
  }, [fields]);

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldError = validators?.[name](value);
    setFields({
      ...fields,
      [name]: {
        value,
        error: fieldError,
      },
    });
  };

  const onSubmitEvent = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    onSubmit();
  };

  return { fields, onFieldChange, onSubmitEvent, hasErrors };
};

export default useForm;

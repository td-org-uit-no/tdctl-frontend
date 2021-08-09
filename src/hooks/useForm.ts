import { useEffect, useState } from 'react';
import { dictFromArray } from 'utils/general';

interface Field {
  value: string;
  error: string[] | undefined;
}
export interface Fields {
  [name: string]: Field;
}
interface Validators {
  [key: string]: (value: string) => string[] | undefined;
}
interface InitalValue {
  [key: string]: string;
}

interface formProps {
  onSubmit: () => any;
  validators?: Validators;
  initalValue?: InitalValue;
}

const useForm = ({ onSubmit, validators, initalValue }: formProps) => {
  let initialFields = !validators
    ? {}
    : dictFromArray<Field>(Object.keys(validators), {
        value: '',
        error: undefined,
      });

  // init field with values and validates the data
  if (initalValue) {
    Object.keys(initalValue).forEach((key) => {
      const value = initalValue[key]
      const fieldError = validators?.[key](value) ?? undefined;
      initialFields[key] = {
        value: initalValue[key],
        error: fieldError,
      };
    });
  }
  const [fields, setFields] = useState<Fields>(initialFields);
  /* Finding errors across the enitre form */
  const [hasErrors, setErrors] = useState(false);

  useEffect(() => {
    const isThereErrors = (fields: Field[]) =>
      fields.filter((field) => field.error !== undefined).length > 0;

    setErrors(isThereErrors(Object.keys(fields).map((field) => fields[field])));
  }, [fields]);

  const setFieldError = (
    name: string,
    value: string,
    fieldError: string[] | undefined
  ) => {
    setFields({
      ...fields,
      [name]: {
        value,
        error: fieldError,
      },
    });
  };

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    //Don't require all forms to have a validator
    const fieldError = validators?.hasOwnProperty(name) ? validators?.[name](value) : undefined;
    setFieldError(name, value, fieldError);
  };

  const onSubmitEvent = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    onSubmit();
  };

  return { fields, onFieldChange, onSubmitEvent, hasErrors, setFieldError };
};

export default useForm;

import parser from 'query-string';
import { confirmMember } from 'utils/api';
import React, { useEffect, useState } from 'react';
import useQueryParams from 'hooks/useQueryParams';
import { Link } from 'react-router-dom';
import Button from 'components/atoms/button/Button';
import TextField from 'components/atoms/textfield/Textfield';

const ConfirmPage = () => {
  const { code } = parser.parse(useQueryParams());
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isValidQueryParam = (code: any): code is string =>
    code !== null && code !== undefined && code.length !== undefined;

  useEffect(() => {
    const activateUser = async () => {
      try {
        if (isValidQueryParam(code)) {
          await confirmMember(code);
        }
      } catch (error) {
        console.warn(error);
        setHasError(true);
      }

      setIsLoading(false);
    };
    activateUser();
  }, [code]);

  if (hasError) {
    return (
      <>
        Koden funker ikke. Lag en ny en her
        <TextField placeholder="Din e-post addresse"></TextField>
        <Button version="primary"> Send ny kode på e-post</Button>
      </>
    );
  }

  if (isLoading) {
    return <>Laster...</>;
  }

  return (
    <>
      Din bruker er nå aktivert! <Link to="/">Logg inn her</Link>
    </>
  );
};

export default ConfirmPage;

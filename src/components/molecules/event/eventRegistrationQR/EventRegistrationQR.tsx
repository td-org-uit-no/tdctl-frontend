import React from 'react';
import { Event } from 'models/apiModels';
import Button from 'components/atoms/button/Button';

import { createQR, getQR } from 'api';
import { useToast } from 'hooks/useToast';

const EventRegistrationQR: React.FC<{ event: Event }> = ({ event }) => {
  const { addToast } = useToast();

  const handleDownload = (blob: Blob) => {
    const filename = event.title + '.pdf';
    const pdf_url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = pdf_url;
    link.setAttribute('download', filename);
    link.click();
  };

  const handleButtonClick = async (url: string) => {
    /* Try to get QR first */
    let res;
    try {
      res = await getQR(url);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          break;
        case 404:
          break;
        default:
          addToast({
            title: 'Feilmelding',
            status: 'error',
            description: 'Ukjent feil',
          });
          return;
      }
      /* Create QR document */
      try {
        res = await createQR(event.eid);
      } catch (error) {
        addToast({
          title: 'Feilmelding',
          status: 'error',
          description: 'Ukjent feil',
        });
        return;
      }
    } finally {
      if (!res) {
        addToast({
          title: 'Feilmelding',
          status: 'error',
          description: 'Ukjent feil',
        });
        return;
      }
      handleDownload(res);
    }
  };

  return (
    <div>
      <Button
        version={'secondary'}
        onClick={() => {
          handleButtonClick(event.eid);
        }}>
        Hent QR-kode
      </Button>
    </div>
  );
};

export default EventRegistrationQR;

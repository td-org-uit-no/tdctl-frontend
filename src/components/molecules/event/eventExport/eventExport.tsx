import React from 'react';
import { Event } from 'models/apiModels';
import Button from 'components/atoms/button/Button';

import { baseUrl } from 'constants/apiConstants';
import { getTokens } from 'utils/auth';

const EventExport: React.FC<{ event: Event }> = ({ event }) => {
  const filename = event.title + '.xlsx';

  const exportEventCsv = async (url: string) => {
    const { accessToken } = getTokens();
    const request = new Request(baseUrl + 'event/' + url + '/export', {
      method: 'GET',
      headers: {
        accept: 'application/pdf',
      },
    });
    request.headers.set('Authorization', `Bearer ${accessToken}`);

    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          return response.blob();
        }
        return Promise.reject(response);
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        link.click();
      })
      .catch((response) => {
        alert(`${response.status} ${response.statusText}`);
      });
  };

  return (
    <div>
      <Button version="secondary" onClick={() => exportEventCsv(event.eid)}>
        export as xlsx
      </Button>
    </div>
  );
};

export default EventExport;

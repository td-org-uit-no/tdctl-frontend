import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './eventAdmin.module.scss';
import { Event } from 'models/apiModels';
import { getEventById } from 'api';
import { ValidEventEditLayout } from '../eventPage/validEvent/ValidEvent';
import EventResponses from 'components/molecules/event/eventResponses/EventResponses';
import EventStatistics from 'components/molecules/event/eventStatistics/EventStatistics';
import EventExport from 'components/molecules/event/eventExport/eventExport';
import useFetchUpdate from 'hooks/useFetchUpdate';
import { SideBarItem } from 'components/pages/admin/AdminPage';
import DropdownMenu from 'components/molecules/dropdownMenu/DropdownMenu';
import { useMobileScreen } from 'hooks/useMobileScreen';
export interface IValidEvent {
  eventData: Event | undefined;
}

export interface IupdateEventHook extends IValidEvent {
  // Added to let children notify when highest hierichy component should refetch event
  setFetchUpdateHook: React.Dispatch<React.SetStateAction<boolean>>;
}

const ValidEventBody: React.FC<IValidEvent> = ({ eventData }) => {
  return (
    <div className={styles.eventPageBody}>
      {eventData !== undefined ? (
        <ValidEventEditLayout event={eventData} />
      ) : (
        <p> 404 event not found!</p>
      )}
    </div>
  );
};

const ValidEventResponses: React.FC<IupdateEventHook> = ({
  eventData,
  setFetchUpdateHook,
}) => {
  return (
    <div className={styles.eventPageBody}>
      {eventData !== undefined ? (
        <EventResponses
          event={eventData}
          setFetchUpdateHook={setFetchUpdateHook}
        />
      ) : (
        <p> 404 event not found!</p>
      )}
    </div>
  );
};
const ValidEventStatistics: React.FC<IupdateEventHook> = ({
  eventData,
  setFetchUpdateHook,
}) => {
  return (
    <div className={styles.eventPageBody}>
      {eventData !== undefined ? (
        <EventStatistics
          event={eventData}
          setFetchUpdateHook={setFetchUpdateHook}
        />
      ) : (
        <p> 404 event not found!</p>
      )}
    </div>
  );
};
const ValidEventExport: React.FC<IValidEvent> = ({ eventData }) => {
  return (
    <div className={styles.eventPageBody}>
      {eventData !== undefined ? (
        <EventExport event={eventData} />
      ) : (
        <p> 404 event not found!</p>
      )}
    </div>
  );
};

type adminOptions = 'Settings' | 'Responses' | 'Statistics' | 'Export';

interface componentsDict {
  [key: string]: JSX.Element;
}

const EventAdmin: React.FC<{ eventData: Event }> = ({ eventData }) => {
  const [isValid, setIsValid] = useState<boolean | undefined>();
  const [event, setEvent] = useState<Event>();
  const { id } = useParams<{ id: string }>();
  const isMobile = useMobileScreen();

  const fetchEvent = async () => {
    const event = await getEventById(id);
    setEvent(event);
  };
  const { setShouldFetch } = useFetchUpdate(fetchEvent);

  useEffect(() => {
    const isValidEventId = async (id: string) => {
      try {
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    };

    isValidEventId(id);
  }, [id]);

  useEffect(() => {
    setShouldFetch(true);
  }, [setShouldFetch]);

  const components = {
    Settings: <ValidEventBody eventData={event} />,
    Responses: (
      <ValidEventResponses
        eventData={event}
        setFetchUpdateHook={setShouldFetch}
      />
    ),
    Statistics: (
      <ValidEventStatistics
        eventData={event}
        setFetchUpdateHook={setShouldFetch}
      />
    ),
    Export: <ValidEventExport eventData={event} />,
  } as componentsDict;

  const [componentKey, setComponentKey] = useState<adminOptions>('Settings');
  const dropdownMenuProps = [
    {
      label: 'Settings',
      icon: 'cog',
      action: () => setComponentKey('Settings'),
    },
    {
      label: 'Responses',
      icon: 'poll',
      action: () => setComponentKey('Responses'),
    },
    {
      label: 'Statistics',
      icon: 'chart-line',
      action: () => setComponentKey('Statistics'),
    },
    {
      label: 'Export',
      icon: 'file-export',
      action: () => setComponentKey('Export'),
    },
  ];

  return (
    <div className={styles.adminContent}>
      {!isMobile ? (
        <div className={styles.side}>
          <SideBarItem
            onClick={() => setComponentKey('Settings')}
            iconType="cog"
            label="Settings"
          />
          <SideBarItem
            onClick={() => setComponentKey('Responses')}
            iconType="poll"
            label="Responses"
          />
          <SideBarItem
            onClick={() => setComponentKey('Statistics')}
            iconType="chart-line"
            label="Statistics"
          />
          <SideBarItem
            onClick={() => setComponentKey('Export')}
            iconType="file-export"
            label="Export"
          />
        </div>
      ) : (
        <div className={styles.top}>
          <DropdownMenu items={dropdownMenuProps}></DropdownMenu>
        </div>
      )}

      <div className={styles.content}>
        <h4>{componentKey}</h4>
        {isValid !== undefined && <>{components[componentKey]}</>}
      </div>
    </div>
  );
};

export default EventAdmin;

import { Event } from 'models/apiModels';
import useUpcomingEvents from 'hooks/useEvents';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import { useHistory } from 'react-router-dom';
import Icon from 'components/atoms/icons/icon';
import styles from './eventTable.module.scss';
import { transformDate } from 'utils/timeConverter';
import { useEffect, useState } from 'react';
import Modal from 'components/molecules/modal/Modal';
import ConformationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import useConfirmation from 'hooks/useConfirmation';
import { deleteEvent } from 'api';
import { useToast } from 'hooks/useToast';

const EventTable = () => {
  const { events, error, setFetch } = useUpcomingEvents();
  const [deleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEvent, setSelected] = useState<
    Pick<Event, 'eid' | 'title'> | undefined
  >();
  const history = useHistory();
  const { addToast } = useToast();

  const moveToEventAdminPage = (eid: string) => {
    history.push(`event/${eid}/admin`);
  };

  const openDeleteColumn = (eid: string) => {
    const selected = events?.find((mem) => {
      return mem.eid === eid;
    });
    setSelected(selected);
    setOpenDeleteModal(true);
  };

  const adminDeleteEvent = async () => {
    setOpenDeleteModal(true);
    try {
      if (confirmed === false) {
        setOpenDeleteModal(false);
        return;
      }
      if (!selectedEvent) {
        return;
      }
      await deleteEvent(selectedEvent.eid);
      addToast({
        title: 'Suksess',
        status: 'success',
        description: `${selectedEvent?.title} er slettet`,
      });
    } catch (error) {
      // if another admin deletes the event
      if (error.statusCode === 404) {
        addToast({
          title: 'Kunne ikke finne arrangement',
          status: 'error',
          description: `kunne ikke finne ${selectedEvent?.title}. Prøv å oppdater siden`,
        });
      }
      addToast({
        title: 'En uforutsett feil skjedde',
        status: 'error',
        description: 'Problemer med slettingen av arrangementet',
      });
    }
    setFetch(true);
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    // display error toast on error caught by useUpcomingEvents hook
    if (error !== null) {
      addToast({
        title: 'Kunne ikke laste inn arrangementetene',
        status: 'error',
      });
    }
  }, [error]);

  const { confirmed, setConfirmed } = useConfirmation(adminDeleteEvent);

  const columns: ColumnDefinitionType<Event, keyof Event>[] = [
    { cell: 'title', header: 'Name', type: 'string' },
    {
      cell: (cellValues) => {
        const { date } = cellValues;
        return (
          <>
            <p>{transformDate(new Date(date))}</p>
          </>
        );
      },
      header: 'Active',
      type: 'date',
    },
    {
      cell: (cellValues) => {
        const { active, date } = cellValues;
        let dateNow = Date.now();
        dateNow = new Date(dateNow).setHours(23, 59, 0, 0);
        let dateNow2 = new Date(dateNow);
        let dateOri = new Date(date);
        return (
          <>
            {active ? (
              <Icon type="calendar-check" color="green" size={2}></Icon>
            ) : dateOri.getTime() > dateNow2.getTime() ? (
              <Icon type="calendar-day" color="orange" size={2}></Icon>
            ) : (
              <Icon type="calendar-times" color="red" size={2}></Icon>
            )}
          </>
        );
      },
      header: 'Active',
      type: 'bool',
    },
    {
      cell: (cellValues) => {
        const { eid } = cellValues;
        return (
          <Icon
            type="cog"
            size={2}
            onClick={() => {
              moveToEventAdminPage(eid);
            }}></Icon>
        );
      },
      header: 'Edit',
      type: 'string',
    },
    {
      cell: (cellValues) => {
        const { eid } = cellValues;
        return (
          <>
            <Icon
              size={2}
              type="trash"
              onClick={() => {
                openDeleteColumn(eid);
              }}
            />
          </>
        );
      },
      header: 'Delete',
    },
  ];

  return (
    <>
      <div className={styles.form}>
        <Table columns={columns} data={events}></Table>
        {deleteModal && (
          <Modal
            title={`Are you sure you want to delete ${selectedEvent?.title}?`}
            setIsOpen={setOpenDeleteModal}
            minWidth={45}>
            <ConformationBox
              onAccept={() => {
                setConfirmed(true);
              }}
              onDecline={() => {
                setConfirmed(false);
              }}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default EventTable;

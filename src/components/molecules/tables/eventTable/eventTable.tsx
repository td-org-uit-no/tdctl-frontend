import { Event } from 'models/apiModels';
import useUpcomingEvents from 'hooks/useEvents';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import { useHistory } from 'react-router-dom';
import Icon from 'components/atoms/icons/icon';
import styles from './eventTable.module.scss';
import { transformDate } from 'utils/timeConverter';

const EventTable = () => {
  const { events } = useUpcomingEvents();
  const history = useHistory();

  const moveToEventAdminPage = (eid: string) => {
    history.push(`event/${eid}/admin`);
  };

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
  ];

  return (
    <>
      <div className={styles.form}>
        <Table columns={columns} data={events}></Table>
      </div>
    </>
  );
};

export default EventTable;

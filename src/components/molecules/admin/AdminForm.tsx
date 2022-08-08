import { getAllMembers } from 'api';
import { Member } from 'models/apiModels';
import { useEffect, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import './admin.scss';
import Button from 'components/atoms/button/Button';
import { useHistory } from 'react-router-dom';

interface TableMember extends Member {
  delete: string;
}

const AdminForm = () => {
  const [members, setMembers] = useState<Array<Member> | undefined>();
  const history = useHistory();

  const fetchMembers = async () => {
    try {
      const members = await getAllMembers();
      setMembers(members);
    } catch (error) {
      // TODO: Handle error
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const columns: ColumnDefinitionType<TableMember, keyof Member>[] = [
    { cell: 'realName', header: 'Name' },
    { cell: 'email', header: 'Email' },
    { cell: 'classof', header: 'Class of' },
    { cell: 'role', header: 'Role' },
    {
      cell: (cellValues) => {
        return (
          <Button
            version="secondary"
            onClick={() => {
              // TODO: Edit user
            }}>
            Edit
          </Button>
        );
      },
      header: 'Edit',
    },
    {
      cell: (cellValues) => {
        return (
          <Button
            version="secondary"
            onClick={() => {
              // TODO: Delete here
              console.log('deleting: ', cellValues);
            }}>
            X
          </Button>
        );
      },
      header: 'Delete',
    },
  ];

  return (
    <div>
      <h1>Admin</h1>
      {members ? (
        <Table className="members-table" columns={columns} data={members} />
      ) : (
        <h1>No members</h1>
      )}
    </div>
  );
};

export default AdminForm;

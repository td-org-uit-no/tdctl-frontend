import { getAllMembers } from 'api';
import { Member } from 'models/apiModels';
import { useEffect, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import './admin.scss';

const AdminForm = () => {
  const [members, setMembers] = useState<Array<Member> | undefined>();

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

  const columns: ColumnDefinitionType<Member, keyof Member>[] = [
    { key: 'realName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'classof', header: 'Class of' },
    { key: 'role', header: 'Role' },
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

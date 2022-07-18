import { getAllMembers } from 'api';
import { Member } from 'models/apiModels';
import { useEffect, useState } from 'react';
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

  return (
    <div>
      <h1>Admin</h1>
      {members ? (
        <table className="members-table">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Email</th>
              <th>Class of</th>
              <th>Rolle</th>
            </tr>
          </thead>
          {members.map((item, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <th> {item.realName} </th>
                  <th> {item.email} </th>
                  <th> {item.classof} </th>
                  <th> {item.role} </th>
                </tr>
              </tbody>
            );
          })}
        </table>
      ) : (
        <h1>No members</h1>
      )}
    </div>
  );
};

export default AdminForm;

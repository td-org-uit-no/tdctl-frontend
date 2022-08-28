import { getAllMembers } from 'api';
import { AdminMemberUpdate, Member } from 'models/apiModels';
import { useEffect, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import Button from 'components/atoms/button/Button';
import Modal from '../modal/Modal';
import TextField from 'components/atoms/textfield/Textfield';
import useForm from 'hooks/useForm';
import styles from './admin.module.scss';
import Select from 'components/atoms/select/Select';
import { adminUpdateMember } from 'api/admin';
import { RoleOptions } from 'contexts/authProvider';
import { useToast } from 'hooks/useToast';
import { isDeepEqual } from 'utils/general';

const AdminForm = () => {
  const [members, setMembers] = useState<Array<Member> | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [initialValues, setInitialValues] = useState<AdminMemberUpdate>();

  const { addToast } = useToast();

  const submit = async () => {
    try {
      const id = fields['id'].value;
      const member: AdminMemberUpdate = {
        realName: fields['realName'].value,
        email: fields['email'].value,
        classof: fields['classof'].value,
        phone: fields['phone'].value,
        status: fields['status'].value,
        role: fields['role'].value as RoleOptions,
      };
      if (!isDeepEqual(member, initialValues)) {
        await adminUpdateMember(id, member);
        await fetchMembers();
      }
      addToast({
        title: 'Success',
        status: 'success',
        description: 'Medlem er oppdatert',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        status: 'error',
        description: 'En feil skjedde ved oppdatering av medlem',
      });
    }
  };

  const {
    fields,
    onSubmitEvent,
    onFieldChange,
    onControlledFieldChange,
    resetForm,
  } = useForm({
    onSubmit: submit,
  });

  const fetchMembers = async () => {
    try {
      const members = await getAllMembers();
      setMembers(members);
    } catch (error) {
      addToast({
        title: 'Error',
        status: 'error',
        description: 'En feil skjedde ved innhenting av alle medlemmer',
      });
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const columns: ColumnDefinitionType<Member, keyof Member>[] = [
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
              setIsOpen(true);
              const { role, email, status, classof, realName, phone } =
                cellValues;
              const updateValues: AdminMemberUpdate = {
                role,
                email,
                status,
                classof,
                realName,
                phone,
              };
              resetForm(cellValues as any);
              setInitialValues(updateValues);
            }}>
            Edit
          </Button>
        );
      },
      header: 'Edit',
    },
  ];

  return (
    <div>
      <h1>Admin</h1>
      {isOpen && (
        <form onSubmit={onSubmitEvent}>
          <Modal minWidth={45} title="Endre bruker" setIsOpen={setIsOpen}>
            <div className={styles.general}>
              <TextField
                minWidth={30}
                label="Navn"
                name="realName"
                value={fields['realName']?.value ?? ''}
                onChange={onFieldChange}
              />
              <br />
              <TextField
                minWidth={30}
                name="email"
                value={fields['email']?.value ?? ''}
                onChange={onFieldChange}
                label="Email"
              />
              <br />
              <TextField
                minWidth={30}
                name="phone"
                value={fields['phone']?.value ?? ''}
                onChange={onFieldChange}
                label="Phone"
              />
              <br />
              <TextField
                minWidth={30}
                name="classof"
                value={fields['classof']?.value ?? ''}
                onChange={onFieldChange}
                label="Class of"
              />
              <br />
              <Select
                name="status"
                value={fields['status']?.value}
                onChange={onControlledFieldChange}
                minWidth={26.5}
                items={[
                  {
                    key: 'inactive',
                    label: 'Inactive',
                    value: 'INACTIVE',
                  },
                  {
                    key: 'active',
                    label: 'Active',
                    value: 'ACTIVE',
                  },
                ]}
                label="Status"
              />
              <br />
              <Select
                name="role"
                value={fields['role']?.value}
                onChange={onControlledFieldChange}
                minWidth={26.5}
                items={[
                  {
                    key: 'admin',
                    label: 'Admin',
                    value: 'admin',
                  },
                  {
                    key: 'member',
                    label: 'Member',
                    value: 'member',
                  },
                ]}
                label="Role"
              />
              <br />
              <Button version="primary">Submit</Button>
            </div>
          </Modal>
        </form>
      )}
      {members ? (
        <Table columns={columns} data={members} />
      ) : (
        <h1>No members</h1>
      )}
    </div>
  );
};

export default AdminForm;

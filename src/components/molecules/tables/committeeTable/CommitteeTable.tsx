import { useEffect, useMemo, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import styles from './committeeTable.module.scss';
import Icon from 'components/atoms/icons/icon';
import Modal from 'components/molecules/modal/Modal';
import TextField from 'components/atoms/textfield/Textfield';
import Select from 'components/atoms/select/Select';
import { Button } from '@chakra-ui/react';
import { useToast } from 'hooks/useToast';
import useModal from 'hooks/useModal';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import { isDeepEqual } from 'utils/general';
import {
  Committee,
  CommitteeInput,
  CommitteeMemberListItem,
  CommitteeUpdate,
  PaginatedResponse,
} from 'models/apiModels';
import {
  listCommittees,
  createCommittee,
  updateCommittee,
  deleteCommittee,
  listCommitteeMembers,
  addCommitteeMember,
  removeCommitteeMember,
} from 'api/committee';
import { getMemberByEmail } from 'api/member';
import Textarea from 'components/atoms/textarea/Textarea';

const currentYear = new Date().getFullYear();

const CommitteeTable = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Committee | undefined>();
  const [selectedToDelete, setSelectedToDelete] = useState<
    Committee | undefined
  >();

  // Create/Edit modal state
  const {
    isOpen: isOpenEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useModal();
  const [formValues, setFormValues] = useState<
    CommitteeInput | CommitteeUpdate
  >({
    name: '',
    description: '',
    hasOpenSpots: true,
    status: 'active',
    slug: '',
    email: '',
  });
  const [initialFormValues, setInitialFormValues] = useState<
    CommitteeInput | CommitteeUpdate
  >({});
  const [isCreate, setIsCreate] = useState(true);
  const [editError, setEditError] = useState<string | undefined>();

  // Members modal state
  const {
    isOpen: isOpenMembers,
    onOpen: openMembers,
    onClose: closeMembers,
  } = useModal();
  const [members, setMembers] = useState<CommitteeMemberListItem[]>([]);
  const [membersPage, setMembersPage] = useState(1);
  const [membersTotal, setMembersTotal] = useState(0);
  const [addMemberEmail, setAddMemberEmail] = useState('');

  const { addToast } = useToast();
  const {
    isOpen: isOpenDelete,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useModal();

  // Member removal confirmation state
  const {
    isOpen: isOpenRemoveMember,
    onOpen: openRemoveMember,
    onClose: closeRemoveMember,
  } = useModal();
  const [memberToRemove, setMemberToRemove] = useState<
    CommitteeMemberListItem | undefined
  >();

  const fetchCommittees = async () => {
    setLoading(true);
    try {
      const res = await listCommittees({ limit: 100, sort: 'name' });
      setCommittees(res.items);
    } catch (e) {
      addToast({ title: 'Kunne ikke hente komiteer', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsCreate(true);
    setSelected(undefined);
    setFormValues({
      name: '',
      description: '',
      hasOpenSpots: true,
      status: 'active',
      slug: '',
      email: '',
    });
    openEdit();
  };

  const openEditModal = (row: Committee) => {
    setIsCreate(false);
    setSelected(row);
    const initialValues = {
      name: row.name,
      description: row.description ?? '',
      hasOpenSpots: row.hasOpenSpots,
      status: row.status,
      slug: row.slug,
      email: row.email ?? '',
    };
    setFormValues(initialValues);
    setInitialFormValues(initialValues);
    setEditError(undefined);
    openEdit();
  };

  const submitEdit = async () => {
    try {
      if (isCreate) {
        const payload: CommitteeInput = {
          name: String(formValues.name || '').trim(),
          description: formValues.description?.trim() || undefined,
          hasOpenSpots: !!formValues.hasOpenSpots,
          status: (formValues.status as any) || 'active',
          slug: formValues.slug?.trim() || undefined,
          email: formValues.email?.trim() || undefined,
        };
        await createCommittee(payload);
        addToast({ title: 'Komité opprettet', status: 'success' });
      } else if (selected) {
        const update: CommitteeUpdate = {
          name: formValues.name?.trim() || undefined,
          description: formValues.description?.trim() || undefined,
          hasOpenSpots: formValues.hasOpenSpots,
          status: formValues.status,
          slug: formValues.slug?.trim() || undefined,
          email: formValues.email?.trim() || undefined,
        };

        if (!isDeepEqual(update, initialFormValues)) {
          await updateCommittee(selected.id, update);
          addToast({ title: 'Komité oppdatert', status: 'success' });
        } else {
          setEditError('Minst et felt må endres');
          return;
        }
      }
      closeEdit();
      fetchCommittees();
    } catch (e: any) {
      if (e.statusCode === 409) {
        addToast({ title: 'Slug er allerede i bruk', status: 'error' });
      } else {
        addToast({ title: 'Noe gikk galt', status: 'error' });
      }
    }
  };

  const openDeleteColumn = (row: Committee) => {
    setSelectedToDelete(row);
    openDelete();
  };

  const adminDeleteCommittee = async () => {
    try {
      if (!selectedToDelete) return;
      await deleteCommittee(selectedToDelete.id);
      addToast({ title: 'Komité slettet', status: 'success' });
      fetchCommittees();
    } catch {
      addToast({ title: 'Kunne ikke slette komité', status: 'error' });
    }
    closeDelete();
  };

  const openMembersModal = async (row: Committee) => {
    setSelected(row);
    setMembersPage(1);
    setAddMemberEmail('');
    await fetchMembers(row.id, 1);
    openMembers();
  };

  const fetchMembers = async (id: string, page?: number) => {
    try {
      const res: PaginatedResponse<CommitteeMemberListItem> =
        await listCommitteeMembers(id, { page, limit: 50 });
      setMembers(res.items);
      setMembersTotal(res.total);
      setMembersPage(res.page);
    } catch {
      addToast({ title: 'Kunne ikke hente medlemmer', status: 'error' });
    }
  };

  const handleAddMember = async () => {
    if (!selected) return;
    try {
      const { id } = await getMemberByEmail(addMemberEmail.trim());
      await addCommitteeMember(selected.id, { userId: id });
      addToast({ title: 'Medlem lagt til', status: 'success' });
      await fetchMembers(selected.id, membersPage);
      setAddMemberEmail('');
    } catch (e: any) {
      if (e.statusCode === 404) {
        addToast({ title: 'Bruker ikke funnet', status: 'error' });
      } else if (e.statusCode === 409) {
        addToast({ title: 'Bruker allerede i komiteen', status: 'warning' });
      } else if (e.statusCode === 400) {
        addToast({
          title: 'Komiteen har ikke åpne plasser',
          status: 'warning',
        });
      } else {
        addToast({ title: 'Kunne ikke legge til medlem', status: 'error' });
      }
    }
  };

  const openRemoveMemberModal = (member: CommitteeMemberListItem) => {
    setMemberToRemove(member);
    openRemoveMember();
  };

  const confirmRemoveMember = async () => {
    if (!selected || !memberToRemove) return;
    try {
      await removeCommitteeMember(selected.id, memberToRemove.id);
      addToast({ title: 'Medlem fjernet', status: 'success' });
      await fetchMembers(selected.id, membersPage);
      closeRemoveMember();
    } catch (e: any) {
      if (e.statusCode === 404) {
        addToast({
          title: 'Ingen aktivt medlemskap funnet',
          status: 'warning',
        });
      } else {
        addToast({ title: 'Kunne ikke fjerne medlem', status: 'error' });
      }
      closeRemoveMember();
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  const columns: ColumnDefinitionType<Committee, keyof Committee>[] = [
    { cell: 'name', header: 'Navn', type: 'string' },
    { cell: 'slug', header: 'Slug', type: 'string' },
    { cell: 'email', header: 'E-post', type: 'string' },
    { cell: 'status', header: 'Status', type: 'string' },
    {
      cell: (row) => <>{row.hasOpenSpots ? 'Åpen' : 'Lukket'}</>,
      header: 'Plasser',
      type: 'string',
    },
    { cell: 'memberCount', header: 'Medlemmer (i år)', type: 'number' },
    {
      cell: (row) => (
        <Icon type="users" size={2} onClick={() => openMembersModal(row)} />
      ),
      header: 'Medlemmer',
    },
    {
      cell: (row) => (
        <Icon type="cog" size={2} onClick={() => openEditModal(row)} />
      ),
      header: 'Rediger',
    },
    {
      cell: (row) => (
        <Icon type="trash" size={2} onClick={() => openDeleteColumn(row)} />
      ),
      header: 'Slett',
    },
  ];

  const statusItems = useMemo(
    () => [
      { key: 'active', label: 'Aktiv', value: 'active' },
      { key: 'inactive', label: 'Inaktiv', value: 'inactive' },
    ],
    []
  );

  return (
    <div className={styles.form}>
      <div
        style={{
          marginBottom: '1rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <Button variant="primary" onClick={openCreateModal}>
          Ny komité
        </Button>
      </div>

      <Table columns={columns} data={committees} />

      {/* Delete confirmation modal */}
      <Modal
        title={`Er du sikker på at du vil slette ${selectedToDelete?.name}?`}
        isOpen={isOpenDelete}
        onClose={closeDelete}
        minWidth={45}>
        <ConfirmationBox
          onAccept={adminDeleteCommittee}
          onDecline={closeDelete}
        />
      </Modal>

      {/* Create / Edit modal */}
      <Modal
        title={isCreate ? 'Opprett komité' : `Rediger komité`}
        isOpen={isOpenEdit}
        onClose={closeEdit}
        minWidth={80}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
          }}>
          <TextField
            label="Navn"
            value={String(formValues.name ?? '')}
            onChange={(e) =>
              setFormValues((v) => ({ ...v, name: e.target.value }))
            }
          />
          <TextField
            label="Slug (valgfri)"
            value={String(formValues.slug ?? '')}
            onChange={(e) =>
              setFormValues((v) => ({ ...v, slug: e.target.value }))
            }
          />
          <TextField
            label="E-post"
            value={String(formValues.email ?? '')}
            onChange={(e) =>
              setFormValues((v) => ({ ...v, email: e.target.value }))
            }
          />
          <Textarea
            label="Beskrivelse"
            value={String(formValues.description ?? '')}
            onChange={(e) =>
              setFormValues((v) => ({ ...v, description: e.target.value }))
            }
          />
          <Select
            label="Status"
            name="status"
            items={statusItems}
            value={String(formValues.status ?? 'active')}
            onChange={(value) =>
              setFormValues((v) => ({ ...v, status: value as any }))
            }
          />
          <Select
            label="Åpne plasser"
            name="hasOpenSpots"
            items={[
              { key: 'true', label: 'Ja', value: 'true' },
              { key: 'false', label: 'Nei', value: 'false' },
            ]}
            value={String(!!formValues.hasOpenSpots)}
            onChange={(value) =>
              setFormValues((v) => ({ ...v, hasOpenSpots: value === 'true' }))
            }
          />
          {editError && (
            <p style={{ color: 'red', margin: '0.5rem 0' }}>{editError}</p>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              width: '100%',
            }}>
            <Button variant="secondary" onClick={closeEdit}>
              Avbryt
            </Button>
            <Button variant="primary" onClick={submitEdit}>
              {isCreate ? 'Opprett' : 'Lagre'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Members modal */}
      <Modal
        title={`Medlemmer i ${selected?.name ?? ''}`}
        isOpen={isOpenMembers}
        onClose={closeMembers}
        minWidth={80}>
        <div style={{ paddingTop: '12px', paddingBottom: '12px' }}>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-end',
              marginBottom: '1rem',
            }}>
            <TextField
              label="Legg til med e-post"
              value={addMemberEmail}
              onChange={(e) => setAddMemberEmail(e.target.value)}
            />
            <Button variant="primary" onClick={handleAddMember}>
              Legg til
            </Button>
          </div>

          <table className={'table'}>
            <thead>
              <tr>
                <th>Navn</th>
                <th>E-post</th>
                <th>Telefon</th>
                <th>Rolle</th>
                <th>Fjern</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.realName}</td>
                  <td>{m.email}</td>
                  <td>{m.phone ?? '-'}</td>
                  <td>{m.role}</td>
                  <td>
                    <Icon
                      type="trash"
                      onClick={() => openRemoveMemberModal(m)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '0.5rem' }}>
            <span>
              Viser {members.length} av {membersTotal}
            </span>
          </div>
        </div>
      </Modal>

      {/* Remove member confirmation modal */}
      <Modal
        title={`Fjern ${memberToRemove?.realName ?? 'medlem'} fra ${
          selected?.name ?? 'komiteen'
        }?`}
        isOpen={isOpenRemoveMember}
        onClose={closeRemoveMember}
        minWidth={45}>
        <ConfirmationBox
          onAccept={confirmRemoveMember}
          onDecline={closeRemoveMember}
        />
      </Modal>
    </div>
  );
};

export default CommitteeTable;

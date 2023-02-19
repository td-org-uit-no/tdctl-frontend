import React, { useEffect, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import { Participant } from 'models/apiModels';
import { Event } from 'models/apiModels';
import { useToast } from 'hooks/useToast';
import { deleteParticipant } from 'api';
import Modal from 'components/molecules/modal/Modal';
import Icon from 'components/atoms/icons/icon';
import TextField from 'components/atoms/textfield/Textfield';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import Button from 'components/atoms/button/Button';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import styles from './eventResponses.module.scss';
import useModal from 'hooks/useModal';

const EventResponses: React.FC<{
  event: Event;
  setFetchUpdateHook: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ event, setFetchUpdateHook }) => {
  const { addToast } = useToast();
  const [selectedParticipant, setSelected] = useState<
    Participant | undefined
  >();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { isOpen, onOpen, onClose } = useModal();
  const {
    isOpen: isOpenDeleteModal,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useModal();

  const openDeleteColumn = (email: string) => {
    const selected = participants?.find((mem) => {
      return mem.email === email;
    });

    setSelected(selected);
    openDeleteModal();
  };

  const adminDeleteMember = async () => {
    try {
      if (!selectedParticipant) {
        return;
      }

      await deleteParticipant(event.eid, selectedParticipant.id);
      // Notify parent component to update event as we just deleted a participant.
      // Makes event update and we will react by updating participating table thereafter
      setFetchUpdateHook(true);

      addToast({
        title: 'Success',
        status: 'success',
        description: `${selectedParticipant?.realName} fjernet fra ${event.title}`,
      });
    } catch (error) {
      switch (error.statusCode) {
        case 403:
          addToast({
            title: 'Error',
            status: 'error',
            description: `403 -  Not allowed`,
          });
          break;

        default:
          addToast({
            title: 'Error',
            status: 'error',
            description: `Unexpected error when removing ${selectedParticipant?.realName}`,
          });
      }
    }
    closeDeleteModal();
  };

  const columns: ColumnDefinitionType<Participant, keyof Participant>[] = [
    {
      cell: (cellValues) => {
        const { submitDate } = cellValues;
        if (
          event.maxParticipants &&
          participants.length >= event.maxParticipants
        ) {
          if (submitDate > participants[event.maxParticipants - 1].submitDate) {
            return (
              <div className={styles.tableCell}>
                <Icon type="circle-notch" color="yellow"></Icon>
              </div>
            );
          }
        }
        return (
          <div className={styles.tableCell}>
            <Icon type="check" color="green"></Icon>
          </div>
        );
      },
      header: 'Plass',
    },
    { cell: 'realName', header: 'Name', type: 'string' },
    { cell: 'email', header: 'Email', type: 'string' },
    { cell: 'phone', header: 'Phone', type: 'number' },
    { cell: 'classof', header: 'Class of', type: 'number' },
    { cell: 'role', header: 'Role', type: 'string' },
    {
      cell: (cellValues) => {
        const { food, dietaryRestrictions } = cellValues;
        return (
          // open on edit modal when API feature is created
          <div>
            {food === true ? (
              <Icon type="hamburger" color="limegreen"></Icon>
            ) : (
              <Icon type="ban" color="firebrick"></Icon>
            )}
            {dietaryRestrictions !== '' && food === true && (
              <Icon type="allergies" color="#fdd835 "></Icon>
            )}
          </div>
        );
      },
      header: 'Food',
    },
    {
      cell: (cellValues) => {
        const { email } = cellValues;
        return (
          <>
            <Icon
              type="trash"
              color="white"
              onClick={() => {
                openDeleteColumn(email);
              }}></Icon>
          </>
        );
      },
      header: 'Delete',
    },
  ];

  const toggleCuisine = () => {
    addToast({
      title: 'Toggle',
      status: 'info',
      description: 'Toggled cuisine',
    });
  };

  useEffect(() => {
    if (event.participants) {
      const p: Participant[] = event.participants?.sort((a, b) => {
        if (a.submitDate > b.submitDate) {
          return 1;
        }
        if (a.submitDate < b.submitDate) {
          return -1;
        }
        return 0;
      });
      setParticipants(p);
    }
  }, [event]);

  return (
    <div className={styles.contentWrapper}>
      {participants ? (
        <Table columns={columns} data={participants}></Table>
      ) : (
        <h3>No Participants yet</h3>
      )}

      {/* WAIT for API to support updating event participants */}
      <Modal
        minWidth={45}
        title="Endre deltager"
        isOpen={isOpen}
        onClose={onClose}>
        <form>
          <div>
            <h5>Event</h5>
            <h5>Name</h5>
            <div>
              <ToggleButton
                label="Cuisine"
                onChange={toggleCuisine}></ToggleButton>
            </div>
            <br />
            <TextField label="Allergies"></TextField>
            <Button version="primary">Update</Button>
          </div>
        </form>
      </Modal>
      <Modal
        title={`Remove ${selectedParticipant?.realName ?? ''}?`}
        isOpen={isOpenDeleteModal}
        onClose={closeDeleteModal}
        minWidth={45}>
        <ConfirmationBox
          onAccept={adminDeleteMember}
          onDecline={closeDeleteModal}></ConfirmationBox>
      </Modal>
    </div>
  );
};

export default EventResponses;

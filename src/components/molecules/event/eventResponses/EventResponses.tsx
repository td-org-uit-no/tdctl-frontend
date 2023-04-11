import React, { useEffect, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import { Participant, ParticipantsUpdate } from 'models/apiModels';
import { Event } from 'models/apiModels';
import { useToast } from 'hooks/useToast';
import { confirmEvent, deleteParticipant, reorderParticipants } from 'api';
import Modal from 'components/molecules/modal/Modal';
import Icon from 'components/atoms/icons/icon';
import TextField from 'components/atoms/textfield/Textfield';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';
import Button from 'components/atoms/button/Button';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import styles from './eventResponses.module.scss';
import useModal from 'hooks/useModal';

interface IBindingRegistrationButtons {
  onUpdate: () => void;
  onConfirm: () => void;
  bindingRegistration: boolean | undefined;
}

const BindingRegistrationButtons: React.FC<IBindingRegistrationButtons> = ({
  onUpdate,
  onConfirm,
  bindingRegistration,
}) => {
  if (bindingRegistration === undefined) {
    return null;
  }

  return (
    <div className={styles.submitWrapper}>
      <Button version="secondary" onClick={onUpdate}>
        Oppdatere liste
      </Button>
      <Button version={'primary'} onClick={onConfirm}>
        Send ut bekreftelse
      </Button>
    </div>
  );
};

const EventResponses: React.FC<{
  event: Event;
  setFetchUpdateHook: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ event, setFetchUpdateHook }) => {
  const { addToast } = useToast();
  const [selectedParticipant, setSelected] = useState<
    Participant | undefined
  >();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { isOpen, onClose } = useModal();
  const {
    isOpen: isOpenDeleteModal,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isOpenSubmitModal,
    onOpen: openSubmitModal,
    onClose: closeSubmitModal,
  } = useModal();

  const openDeleteColumn = (email: string) => {
    const selected = participants?.find((mem) => {
      return mem.email === email;
    });

    setSelected(selected);
    openDeleteModal();
  };

  const adminSubmitParticipants = async () => {
    try {
      await confirmEvent(event.eid);
      addToast({
        title: 'Bekreftelse sent',
        status: 'success',
        description: `Bekreftelses mail er sendt ut til alle som har plass`,
      });
      setFetchUpdateHook(true);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          const res = await error.getText();
          addToast({
            title: 'Error',
            status: 'error',
            description: `${res}`,
          });
          break;
        default:
          addToast({
            title: 'En uforutsett feil skjedde',
            status: 'error',
            description: 'Kunne ikke sende ut bekreftelse',
          });
      }
    }
    closeSubmitModal();
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
        title: 'Suksess',
        status: 'success',
        description: `${selectedParticipant?.realName} fjernet fra ${event.title}`,
      });
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          addToast({
            title: 'Feil',
            status: 'error',
            description: 'Brukeren er ikke meldt på arrangementet',
          });
          break;

        default:
          addToast({
            title: 'En uforutsett feil skjedde',
            status: 'error',
            description: `kunne ikke fjerne ${selectedParticipant?.realName}`,
          });
      }
    }
    closeDeleteModal();
  };

  const columns: ColumnDefinitionType<Participant, keyof Participant>[] = [
    { cell: 'realName', header: 'Name', type: 'string' },
    { cell: 'email', header: 'Email', type: 'string' },
    { cell: 'phone', header: 'Phone', type: 'number' },
    { cell: 'penalty', header: 'Prikk', type: 'number' },
    {
      cell: (cellValues) => {
        const { confirmed } = cellValues;
        return (
          <>
            <Icon
              type={confirmed ? 'check' : 'ban'}
              color={confirmed ? '#00ff00' : 'gray'}
            ></Icon>
          </>
        );
      },
      header: 'Bekreftet',
    },
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
              }}
            ></Icon>
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
      setParticipants(event.participants);
    }
  }, [event]);

  const updateList = async () => {
    const updateList = participants.map((p, idx) => {
      return { id: p.id, pos: idx } as ParticipantsUpdate;
    });

    try {
      await reorderParticipants(event.eid, { updateList: updateList });
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Påmeldings listen er oppdatert!"',
      });
    } catch (error) {
      let detail = await error.getText();
      if (error.statusCode === 400) {
        // forwards error from API
        // TODO: make message norwegian
        addToast({
          title: 'Ikke godkjent oppdatering',
          status: 'error',
          description: `${detail}`,
        });
      }
    }
  };

  // TODO: Create a state or something to toggle disabled on button

  return (
    <div className={styles.contentWrapper}>
      <BindingRegistrationButtons
        bindingRegistration={event.bindingRegistration}
        onUpdate={updateList}
        onConfirm={openSubmitModal}
      />
      {participants ? (
        <Table
          columns={columns}
          data={participants}
          setData={setParticipants}
          dragable={true}
          showIdx={true}
          sort={false}
          mark={event.maxParticipants}
        />
      ) : (
        <h3>Ingen deltakere foreløpig</h3>
      )}

      <Modal
        title="Bekreft plass for arrangement"
        isOpen={isOpenSubmitModal}
        onClose={closeSubmitModal}
      >
        <div>
          <h5>Ved å gå videre vil du</h5>
          <ul>
            <li>
              Sende ut påmelding på mail til alle deltakere som har plass.
            </li>
            <li>
              Deltakere vil ikke lenger kunne redigere sine preferanser til
              dette arrangementet.
            </li>
          </ul>
          <hr />
          <div className={styles.submitModalButtons}>
            <Button version={'secondary'} onClick={closeSubmitModal}>
              Avbryt
            </Button>
            <Button version={'primary'} onClick={adminSubmitParticipants}>
              Send
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        minWidth={45}
        title="Endre deltager"
        isOpen={isOpen}
        onClose={onClose}
      >
        <form>
          <div>
            <h5>Event</h5>
            <h5>Name</h5>
            <div>
              <ToggleButton
                label="Cuisine"
                onChange={toggleCuisine}
              ></ToggleButton>
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
        minWidth={45}
      >
        <ConfirmationBox
          onAccept={adminDeleteMember}
          onDecline={closeDeleteModal}
        ></ConfirmationBox>
      </Modal>
    </div>
  );
};

export default EventResponses;

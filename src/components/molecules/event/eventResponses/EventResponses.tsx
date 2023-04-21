import React, { useEffect, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import {
  Participant,
  ParticipantsUpdate,
  SetAttendancePayload,
} from 'models/apiModels';
import { Event } from 'models/apiModels';
import { useToast } from 'hooks/useToast';
import {
  confirmEvent,
  deleteParticipant,
  registerAbsence,
  reorderParticipants,
  updateAttendance,
} from 'api';
import Modal from 'components/molecules/modal/Modal';
import Icon from 'components/atoms/icons/icon';
import Button from 'components/atoms/button/Button';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import styles from './eventResponses.module.scss';
import useModal from 'hooks/useModal';
import EventRegistrationQR from '../eventRegistrationQR/EventRegistrationQR';

interface IBindingRegistrationButtons {
  onUpdate: () => void;
  onConfirm: () => void;
  onPenalize: () => void;
  bindingRegistration: boolean | undefined;
}

const BindingRegistrationButtons: React.FC<IBindingRegistrationButtons> = ({
  onUpdate,
  onConfirm,
  onPenalize,
  bindingRegistration,
}) => {
  if (bindingRegistration === undefined) {
    return null;
  }

  return (
    <div>
      <Button version="primary" onClick={onUpdate}>
        Oppdatere liste
      </Button>
      <Button version={'secondary'} onClick={onConfirm}>
        Send ut bekreftelse
      </Button>
      <Button version={'primary'} onClick={onPenalize}>
        Registrer fravær
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
  const {
    isOpen: isOpenAbsenceModal,
    onOpen: openAbsenceModal,
    onClose: closeAbsenceModal,
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

  const adminSetAttendance = async (email: string) => {
    /* Select user */
    const selected = participants?.find((mem) => {
      return mem.email === email;
    });

    try {
      if (!selected) {
        return;
      }

      /* Create payload for request */
      const payload: SetAttendancePayload = {
        member_id: selected.id,
        attendance: !selected.attended,
      };

      await updateAttendance(event.eid, payload);

      /* Notify to parent event data must be updated */
      setFetchUpdateHook(true);

      addToast({
        title: 'Suksess',
        status: 'success',
        description: `Oppdaterte oppmøte til ${selected?.realName}.`,
      });
    } catch (error) {
      addToast({
        title: 'Feilmelding',
        status: 'error',
        description: `Kunne ikke sette oppmøte til ${selected?.realName}.`,
      });
    }
  };

  const columns: ColumnDefinitionType<Participant, keyof Participant>[] = [
    { cell: 'realName', header: 'Navn', type: 'string' },
    { cell: 'email', header: 'Email', type: 'string' },
    { cell: 'phone', header: 'Tlf', type: 'number' },
    { cell: 'penalty', header: 'Prikk', type: 'number' },
    {
      cell: (cellValues) => {
        const { confirmed } = cellValues;
        return (
          <>
            <Icon
              type={confirmed ? 'check' : 'ban'}
              color={confirmed ? '#00ff00' : 'gray'}></Icon>
          </>
        );
      },
      header: 'Bekreftet',
    },
    {
      cell: (cellValues) => {
        const { attended, email } = cellValues;
        return (
          <>
            <Icon
              type={attended ? 'check' : 'ban'}
              color={attended ? '#00ff00' : 'gray'}
              onClick={() => {
                adminSetAttendance(email);
              }}
            />
          </>
        );
      },
      header: 'Oppmøte',
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
              <Icon type="ban" color="gray"></Icon>
            )}
            {dietaryRestrictions !== '' && food === true && (
              <Icon type="allergies" color="#fdd835 "></Icon>
            )}
          </div>
        );
      },
      header: 'Mat',
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
      header: 'Slett',
    },
  ];

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
        description: 'Påmeldings listen er oppdatert!',
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

  const penalizeAbsent = async () => {
    /* Give penalty to all absent members */
    try {
      await registerAbsence(event.eid);
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Fraværende medlemmer fikk prikk',
      });
      setFetchUpdateHook(true);
    } catch (error) {
      const errmsg = await error.getText();
      addToast({
        title: 'Feilmelding',
        status: 'error',
        description: `${errmsg}`,
      });
    }
    closeAbsenceModal();
  };

  // TODO: Create a state or something to toggle disabled on button

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.adminButtonsWrapper}>
        <BindingRegistrationButtons
          bindingRegistration={event.bindingRegistration}
          onUpdate={updateList}
          onConfirm={openSubmitModal}
          onPenalize={openAbsenceModal}
        />
        <EventRegistrationQR event={event} />
      </div>
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
        onClose={closeSubmitModal}>
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
        title="Registrer fravær på arrangement"
        isOpen={isOpenAbsenceModal}
        onClose={closeAbsenceModal}>
        <div>
          <h5>Sende inn fraværsliste?</h5>
          <p>Alle medlemmer som ikke har bekreftet oppmøte vil få en prikk</p>
          <div className={styles.submitModalButtons}>
            <Button version={'secondary'} onClick={closeAbsenceModal}>
              Avbryt
            </Button>
            <Button version={'primary'} onClick={penalizeAbsent}>
              Registrer
            </Button>
          </div>
        </div>
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

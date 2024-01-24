import React, { useEffect, useState } from 'react';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import {
  ConfirmMessagePayload,
  Participant,
  ParticipantsUpdate,
  SetAttendancePayload,
} from 'models/apiModels';
import { Event } from 'models/apiModels';
import { useToast } from 'hooks/useToast';
import {
  confirmEvent,
  deleteParticipant,
  getConfirmationMessage,
  registerAbsence,
  reorderParticipants,
  sendMail,
  updateAttendance,
} from 'api';
import Modal from 'components/molecules/modal/Modal';
import Icon from 'components/atoms/icons/icon';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import styles from './eventResponses.module.scss';
import useModal from 'hooks/useModal';
import EventRegistrationQR from '../eventRegistrationQR/EventRegistrationQR';
import Textarea from 'components/atoms/textarea/Textarea';
import TextField from 'components/atoms/textfield/Textfield';
import useForm from 'hooks/useForm';
import {
  emptyFieldsValidator,
  mailContentValidator,
  mailSubjectValidator,
} from 'utils/validators';
import ToggleButton from 'components/atoms/toggleButton/ToggleButton';

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
    <HStack>
      <Button variant="primary" onClick={onUpdate}>
        Oppdatere liste
      </Button>
      <Button variant={'secondary'} onClick={onConfirm}>
        Send ut bekreftelse
      </Button>
      <Button variant={'primary'} onClick={onPenalize}>
        Registrer fravær
      </Button>
    </HStack>
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
    isOpen: isOpenMailModal,
    onOpen: openMailModal,
    onClose: closeMailModal,
  } = useModal();
  const {
    isOpen: isOpenAbsenceModal,
    onOpen: openAbsenceModal,
    onClose: closeAbsenceModal,
  } = useModal();
  const [confirmMsg, setConfirmMsg] = useState<string | undefined>();

  /* Email form */
  const [confirmedOnly, setConfirmedOnly] = useState<boolean>(false);
  const [mailError, setMailError] = useState<string | undefined>(undefined);
  const validators = {
    subject: mailSubjectValidator,
    mail: mailContentValidator,
  };

  const submitMail = async () => {
    const emptyFields = emptyFieldsValidator({
      fields: fields,
      optFields: undefined,
    });

    emptyFields
      ? setMailError('Alle feltene må fylles ut')
      : setMailError(undefined);

    if (hasErrors || emptyFields) {
      return;
    }

    try {
      await sendMail(event.eid, {
        subject: fields['subject']?.value,
        msg: fields['mail']?.value,
        confirmedOnly: confirmedOnly,
      });
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Epost sendt ut',
      });
    } catch (error) {
      addToast({
        title: 'Kunne ikke sende ut epost',
        status: 'error',
        description: 'Kontroller epostfilteret',
      });
    }
    closeMailModal();
  };

  const { fields, onFieldChange, hasErrors, onSubmitEvent } = useForm({
    onSubmit: submitMail,
    validators: validators,
  });

  const calculateMailRecipients = () => {
    if (!event.participants) {
      return 0;
    }
    const recipients = event.participants.filter((p) => {
      if (confirmedOnly) {
        return p.confirmed === true;
      }
      return !p.confirmed;
    });

    return recipients.length;
  };

  useEffect(() => {
    const fetchConfirmMsg = async () => {
      try {
        const res = await getConfirmationMessage(event.eid);
        setConfirmMsg(res.message);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConfirmMsg();
  }, []);

  const onConfirmMsgChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setConfirmMsg(event.target.value);
  };

  const openDeleteColumn = (email: string) => {
    const selected = participants?.find((mem) => {
      return mem.email === email;
    });

    setSelected(selected);
    openDeleteModal();
  };

  const adminSubmitParticipants = async () => {
    try {
      const payload: ConfirmMessagePayload = { msg: confirmMsg };
      await confirmEvent(event.eid, payload);
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
      <HStack mb="1rem" justify="right" wrap="wrap">
        <BindingRegistrationButtons
          bindingRegistration={event.bindingRegistration}
          onUpdate={updateList}
          onConfirm={openSubmitModal}
          onPenalize={openAbsenceModal}
        />
        <Button variant={'secondary'} onClick={openMailModal}>
          Send epost
        </Button>
        <EventRegistrationQR event={event} />
      </HStack>
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
        <Flex direction={'column'} p={5}>
          <Text size={'lg'}>Ved å gå videre vil du</Text>
          <UnorderedList mb="1rem">
            <ListItem>
              Sende ut bekreftelse på mail til alle deltakere som har plass.
            </ListItem>
            <ListItem>
              Deltakere vil ikke lenger kunne redigere sine preferanser til
              dette arrangementet.
            </ListItem>
          </UnorderedList>
          <Accordion allowToggle mb="1rem">
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" fontStyle="italic">
                  Se og tilpass bekreftelsesmail
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Textarea
                  value={confirmMsg}
                  onChange={onConfirmMsgChange}
                  style={{ minHeight: '250px' }}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Flex direction="row" justifyContent="center" gap="1rem" mt="1rem">
            <Button variant="primary" onClick={closeSubmitModal}>
              Avbryt
            </Button>
            <Button variant="secondary" onClick={adminSubmitParticipants}>
              Send
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal
        title="Registrer fravær på arrangement"
        isOpen={isOpenAbsenceModal}
        onClose={closeAbsenceModal}>
        <div>
          <h5>Sende inn fraværsliste?</h5>
          <p>Alle medlemmer som ikke har bekreftet oppmøte vil få en prikk</p>
          <div className={styles.submitModalButtons}>
            <Button variant={'secondary'} onClick={closeAbsenceModal}>
              Avbryt
            </Button>
            <Button variant={'primary'} onClick={penalizeAbsent}>
              Registrer
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Send ut epost til deltakerne"
        isOpen={isOpenMailModal}
        onClose={() => {
          closeMailModal();
          /* Reset form */
          setMailError(undefined);
          fields['subject'].value = '';
          fields['mail'].value = '';
        }}>
        <Flex direction="column" gap="1rem" p="1rem">
          <form onSubmit={onSubmitEvent}>
            <Flex
              direction="column"
              gap="1rem"
              minW="600px"
              w="75vw"
              maxW="900px">
              <TextField
                name="subject"
                label="Emne"
                minWidth={20}
                onChange={onFieldChange}
                error={fields['subject'].error}
              />
              <Textarea
                name="mail"
                label="Innhold"
                onChange={onFieldChange}
                error={fields['mail'].error}
                resize={true}
              />
              <ToggleButton
                onChange={() => {
                  setConfirmedOnly(!confirmedOnly);
                }}
                initValue={confirmedOnly}
                label="Kun send til de med bekreftet plass"
              />
            </Flex>
          </form>

          <Flex direction="row" justifyContent="end" w="100%">
            {mailError && (
              <Text flexGrow={1} fontStyle="italic" color="red.td">
                {mailError}
              </Text>
            )}
            <Flex direction="column" justifyContent="end" mr={2}>
              <Text fontSize="xs" fontStyle="italic" color="slate.400" m={0}>
                Eposten vil bli sendt til {calculateMailRecipients()} studenter
              </Text>
            </Flex>
            <Button variant="secondary" onClick={submitMail}>
              Send
            </Button>
          </Flex>
        </Flex>
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

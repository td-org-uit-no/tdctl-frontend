import React, { useContext, useState } from 'react';
import styles from './validEvent.module.scss';
import { Event } from 'models/apiModels';
import {
  EditEvent,
  EventInfo,
} from 'components/molecules/event/eventBody/EventBody';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import EventHeader from 'components/molecules/event/eventHeader/EventHeader';
import { Button, Center, Flex } from '@chakra-ui/react';
import Icon from 'components/atoms/icons/icon';
import { useHistory } from 'react-router-dom';
import useTitle from 'hooks/useTitle';
import { useMobileScreen } from 'hooks/useMobileScreen';

export interface EventPageProps {
  eid: string;
  event: Event;
}

const ValidEventLayout: React.FC<{ event: Event }> = ({ event }) => {
  useTitle(event.title);
  const { role } = useContext(AuthenticateContext);
  const history = useHistory();

  return (
    <Flex
      flexDir="column"
      w="100%"
      borderRadius="lg"
      bg="#222136"
      textAlign="center">
      <EventHeader id={event.eid} className={styles.header} />
      <EventInfo event={event} role={role} />
      {role === Roles.admin && (
        <Flex w="100%" m="1%">
          <Icon
            type={'cog'}
            size={2}
            onClick={() => history.push(`${event.eid}/admin`)}></Icon>
        </Flex>
      )}
    </Flex>
  );
};
export default ValidEventLayout;

export const ValidEventEditLayout: React.FC<{ event: Event }> = ({ event }) => {
  const { role } = useContext(AuthenticateContext);
  const isMobile = useMobileScreen();
  const [edit, setEdit] = useState(false);

  const setEventEdit = () => {
    setEdit(!edit);
  };

  return (
    <Flex w="100%" flexDir={isMobile ? 'column' : 'row'}>
      <Center
        w="100%"
        pb="1rem"
        flexDir="column"
        bg="#222136"
        borderRadius="lg"
        textAlign="center">
        <EventHeader id={event.eid} className={styles.header} />
        {!edit ? (
          <EventInfo event={event} role={role} />
        ) : (
          <EditEvent event={event} setEdit={setEventEdit} />
        )}
        {role === Roles.admin && !edit && (
          <Center>
            <Button
              variant="primary"
              onClick={setEventEdit}
              className={styles.adminButtons}>
              Rediger
            </Button>
          </Center>
        )}
      </Center>
      <Center
        w={{ base: '100%', md: '12.5vw' }}
        dir="column"
        my={{ base: '1rem' }}></Center>
    </Flex>
  );
};

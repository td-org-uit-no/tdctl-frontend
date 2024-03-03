import React from 'react';
import { Event } from 'models/apiModels';
import EventHeader from '../../eventHeader/EventHeader';
import Icon from 'components/atoms/icons/icon';
import { transformDate } from 'utils/timeConverter';
import { Box, Center, Flex, HStack, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const VerticalView: React.FC<{ eventData: Event }> = ({ eventData }) => {
 return (
  <>
    <Center
      bg={'slate.600'}
      rounded={'xl'}
      shadow={'dark-lg'}
      textAlign={'center'}
      cursor={'pointer'}
      height={'100%'}
      width={'100%'}
      as={Link}
      to={`/event/${eventData.eid}`}
      >

      <Flex direction={'column'} justify={'space-evenly'} w={'80%'} h={'100%'}>
        <Heading size={'sm'} pt={'.5rem'} pb={0} m={0}>
          {eventData.title}
        </Heading>
        <Box h={'60%'} w={'100%'}>
          {eventData.eid !== undefined && <EventHeader id={eventData.eid} />}
        </Box>
        <Flex direction={'column'} textAlign={'left'} justify={'space-evenly'}>
          <HStack
            textAlign={'center'}
            alignItems={'center'}
            overflowWrap={'break-word'}>
            <Icon type={'calendar'} size={1.5} />
            <Text fontSize={'.75rem'} m={0}>
              {transformDate(new Date(eventData.date))}
            </Text>
          </HStack>
          <HStack
            textAlign={'center'}
            alignItems={'center'}
            overflowWrap={'break-word'}>
            <Icon type={'map'} size={1.5} />{' '}
            <Text fontSize={'.75rem'} m={0}>
              {eventData.address}
            </Text>
          </HStack>
        </Flex>
      </Flex>
    </Center>
  </>
  );
};

export default VerticalView;

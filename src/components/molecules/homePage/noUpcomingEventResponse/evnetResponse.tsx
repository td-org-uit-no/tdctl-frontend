import { Center, Flex, Heading, Text } from '@chakra-ui/react';
import Snowfall from 'react-snowfall';

const WinterResponse = () => {
  return (
    <Flex w="100%" height="100%" flexDir="column" textAlign="center">
      <Snowfall
        snowflakeCount={350}
        speed={[0.5, 1.5]}
        wind={[-0.5, 0.5]}
        radius={[0.5, 4.5]}
      />
      <Heading>Vi har tatt vinterferie❄️ </Heading>
      <Center>
        <Text>Ses neste semester👋</Text>
      </Center>
    </Flex>
  );
};

// TODO add more responses on for example Christmas, summer and so on
const NoUpcomingEvents = () => {
  const today = new Date();

  const isWinterBreak = (today: Date): boolean => {
    const year = today.getFullYear();
    // winter break
    // 0 index so winter break starts 01.12
    const winterBreakStart = new Date(year, 11, 1);
    const winterBreakEnd = new Date(year + 1, 0, 15);

    return today >= winterBreakStart && today <= winterBreakEnd;
  };

  if (isWinterBreak(today)) {
    return <WinterResponse />;
  }

  return (
    <Flex w="100%" height="100%" flexDir="column">
      <Heading>Ingen kommende arrangement 👀</Heading>
    </Flex>
  );
};

export default NoUpcomingEvents;

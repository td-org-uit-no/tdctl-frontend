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
      <Heading>Vi har tatt juleferie❄️ </Heading>
      <Center>
        <Text>Sees neste semester👋</Text>
      </Center>
    </Flex>
  );
};

// TODO add more responses on for example Christmas, summer and so on
const NoUpcomingEvents = () => {
  const today = new Date();

  const isWinterBreak = (today: Date): boolean => {
    const year = today.getFullYear();
    const isDecember = today.getMonth() === 11;

    // end date needs to be currentYear + 1 before new years and currentYear after
    // and start must do the same but with - 1
    let endYear = isDecember ? year + 1 : year;
    let startYear = isDecember ? year : year - 1;

    // 0 index so winter break starts 01.12
    const winterBreakStart = new Date(startYear, 11, 1);
    const winterBreakEnd = new Date(endYear, 0, 15);

    return today >= winterBreakStart && today <= winterBreakEnd;
  };

  if (isWinterBreak(today)) {
    return <WinterResponse />;
  }

  return (
    <Flex w="100%" height="100%" flexDir="column">
      <Heading>Ingen kommende arrangementer 👀</Heading>
    </Flex>
  );
};

export default NoUpcomingEvents;

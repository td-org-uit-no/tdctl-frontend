import React from 'react';
import UniqueVisitsCharts from 'components/molecules/charts/uniqueVisitChart/UniqueVisitChart';
import { Flex, Heading, Card, CardBody, CardHeader } from '@chakra-ui/react';
import VisitLastMonthChart from 'components/molecules/charts/pageVisitsLastMonthChart/VistsLastMonthChart';
import useTitle from 'hooks/useTitle';

const UniqueChartBox: React.FC = () => {
  return (
    <Card
      w="95%"
      alignSelf="center"
      variant={'outline'}
      colorScheme="blue"
      backgroundColor="unset">
      <CardHeader margin={0}>Unike brukere</CardHeader>
      <CardBody>
        <UniqueVisitsCharts />
      </CardBody>
    </Card>
  );
};

const PageVisitChartBox: React.FC = () => {
  return (
    <Card
      w="90%"
      mt={25}
      alignSelf="center"
      variant={'outline'}
      colorScheme="blue"
      backgroundColor="unset">
      <CardHeader margin={0}>Mest besøkte sider siste 30 dager</CardHeader>
      <CardBody>
        <VisitLastMonthChart />
      </CardBody>
    </Card>
  );
};

const StatsPage: React.FC = () => {
  useTitle('Statistikk');
  return (
    <Flex w="100vw" h="100%" flexDir="column" textAlign="center" mb={50}>
      <Heading mt={2.5}>Statistikk</Heading>
      <UniqueChartBox />
      <Flex w={{ base: '100%', md: '50%' }} h="50%" justifyContent={'center'}>
        <PageVisitChartBox />
      </Flex>
    </Flex>
  );
};

export default StatsPage;

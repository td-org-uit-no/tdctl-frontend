import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/homePage/header/HomeHeader';
import Footer from 'components/molecules/footer/Footer';
import Carousel from 'components/molecules/carousel/Carousel';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import { useMobileScreen } from 'hooks/useMobileScreen';
import NoUpcomingEvents from 'components/molecules/homePage/noUpcomingEventResponse/evnetResponse';
import { Flex, VStack, Heading, Text, Box, Center } from '@chakra-ui/react';
import Icon from 'components/atoms/icons/icon';

interface NavCardProps {
  header: string;
  linkTo: string;
  children?: React.ReactNode;
}

const NavCard: React.FC<NavCardProps> = ({ header, linkTo, children }) => {
  return (
    <Flex
      direction={'row'}
      justify={'space-between'}
      bg={'slate.700'}
      _hover={{ bg: 'slate.600' }}
      rounded={'lg'}
      shadow={'md'}
      cursor={'pointer'}
      w={'100%'}
      p={'1rem'}>
      <VStack align={'start'}>
        <Heading size={'md'} p={0} m={0}>
          {header}
        </Heading>
        <Text fontSize={'.75rem'} p={0} m={0}>
          {children}
        </Text>
      </VStack>
      <Icon type="arrow-right" size={2} />
    </Flex>
  );
};

const RootPage = () => {
  useTitle('Tromsøstudentenes-Dataforening');
  const { events } = useUpcomingEvents();
  const isMobile = useMobileScreen();

  return (
    <VStack>
      <HomeHeader />
      {/* <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify={'space-between'}
        width={{ base: '80vw', lg: '60vw' }}
        gap={{ base: '1rem', lg: '4rem' }}
        mt={'1rem'}>
        <NavCard header="Stillingsutlysninger" linkTo="test">
          Sjekk ut stillingsannonser her
        </NavCard>
        <NavCard header="Ny student" linkTo="test">
          Ofte stilte spørsmål og generell info
        </NavCard>
      </Flex> */}
      <Center w={{ base: '85vw', xl: '75vw' }}>
        <LoadingWrapper data={events} animation={true} startAfter={400}>
          {events && events.length ? (
            <Box w={'100%'}>
              <Carousel
                title="Arrangementer"
                dir={isMobile ? 'column' : 'row'}
                viewItems={isMobile ? 1 : 3}
                spacing={!isMobile}
                height={'45vh'}>
                {events.map((event) => (
                  <EventPreview
                    eventData={event}
                    orientation={'vertical'}
                    key={event.eid}
                  />
                ))}
              </Carousel>
            </Box>
          ) : (
            <NoUpcomingEvents />
          )}
        </LoadingWrapper>
      </Center>
      <Footer />
    </VStack>
  );
};

export default RootPage;

import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/homePage/header/HomeHeader';
import Footer from 'components/molecules/footer/Footer';
import Carousel from 'components/molecules/carousel/Carousel';
import EventPreview from 'components/molecules/event/eventPreview/EventPreview';
import useUpcomingEvents from 'hooks/useEvents';
import LoadingWrapper from 'components/atoms/loadingWrapper/LoadingWrapper';
import { useMobileScreen } from 'hooks/useMobileScreen';
import NoUpcomingEvents from 'components/molecules/homePage/noUpcomingEventResponse/evnetResponse';
import { VStack, Box, Center } from '@chakra-ui/react';

const RootPage = () => {
  useTitle('Tromsøstudentenes-Dataforening');
  const { events } = useUpcomingEvents();
  const isMobile = useMobileScreen();

  return (
    <VStack>
      <HomeHeader />
      <Center w={{ base: '85vw', xl: '75vw' }} mb={'1rem'}>
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

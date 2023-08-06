import {
  Box,
  Button,
  Heading,
  Text,
  Center,
  Flex,
  Spacer,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Link,
  Image,
} from '@chakra-ui/react';
import Footer from 'components/molecules/footer/Footer';
import useTitle from 'hooks/useTitle';
import { useHistory } from 'react-router-dom';
import { AuthenticateContext } from 'contexts/authProvider';
import { Link as ReactRouterLink } from 'react-router-dom';
import FAQ from './FAQ';
import About from '../aboutTD/About';
import faddere from 'assets/new-student/faddere.jpg';
import pils from 'assets/new-student/pils-crop.jpeg';
import { useContext } from 'react';

const FadderUka = () => {
  return (
    <Box width={{ base: '100%', xl: '950px' }}>
      <Heading mt=".5rem">Fadderuka med TD og DebutUKA</Heading>
      <Flex
        mb="2rem"
        justify="space-between"
        direction={{ base: 'column', lg: 'row' }}>
        <Text width={{ base: '100%', lg: '50%' }}>
          Fadderordningen ved UiT heter DebutUKA, og denne tilbyr et morsomt,
          spennende og inkluderende opplegg for å kickstarte studiestarten, for
          alle nye studenter på universitetet. Gjennom to uker er det lagt opp
          til mange forskjellige aktiviteter som omvisning på campus, konserter
          og den tradisjonelle{' '}
          <span style={{ fontStyle: 'italic' }}>Lysløypa.</span> DebutUKA varer
          i år fra 14. - 28. August. Fullstendig program finner du{' '}
          <Link href="https://debutuka.no/nb/program" isExternal>
            her.
          </Link>
        </Text>
        <Box width={{ base: '100%', lg: '45%' }}>
          <Image src={faddere} alt="Faddere for Informatikk" width="100%" />
        </Box>
      </Flex>
      <Box bg="#2b2c3d" borderRadius="lg" p={3}>
        <Text m={0}>
          Selv om fadderuka har et tett program og kan virke overveldende vil vi
          sterkt anbefale at du deltar så mye som mulig! Arrangementene gir deg
          en unik mulighet til å utforske byen, bygge vennskap og skape minner
          som kan vare livet ut. Du vil ikke angre!
        </Text>
      </Box>
      <Flex
        mt="2rem"
        justify="space-between"
        direction={{ base: 'column', lg: 'row' }}>
        <Box width={{ base: '100%', lg: '40%' }} mb={{ base: '1rem', lg: 0 }}>
          <Image
            src={pils}
            alt="Tappetårnet til TD på Tapp i aksjon"
            width="100%"
          />
        </Box>
        <Text width={{ base: '100%', lg: '50%' }}>
          I tillegg til programmet fra DebutUKA tilbyr vi i TD også et eget
          opplegg for nye informatikkstudenter. I år arrangeres blant annet
          TD-dagen, hvor du får en god introduksjon til din nye linjeforening,
          og TD-fest på pust med flytende badstu og forfriskninger servert av
          vårt eget bryggelag, TD på Tapp. Disse vil du ikke gå glipp av! Lag
          deg en bruker og sjekk ut{' '}
          <Link as={ReactRouterLink} to="/eventoverview">
            arrangementsoversikten
          </Link>{' '}
          for informasjon om hele programmet og påmelding.
        </Text>
      </Flex>
    </Box>
  );
};

const NewStudentsPage = () => {
  const history = useHistory();
  const { authenticated } = useContext(AuthenticateContext);
  useTitle('Ny student');

  const moveToRegisterPage = () => {
    history.push('/registrer');
  };

  return (
    <VStack>
      <Center pt="50px">
        <VStack>
          <Flex
            width={{ base: '95vw', md: '70vw' }}
            direction={{ base: 'column', md: 'row' }}
            maxW={970}>
            <Box
              width={{ base: '100%', md: '45%' }}
              maxW={{ base: '100%', md: '450px' }}>
              <Heading
                size="2xl"
                textDecoration="underline"
                textDecorationColor="red.td"
                mt={0}>
                Ny Student
              </Heading>
              <Text mt={3}>
                Velkommen til Informatikk ved UiT! Vi i TD ønsker å gi deg en
                strålende start på studiet, og inviterer deg i den anledning med
                på et eget opplegg ved studiestart som er i tillegg til det
                normale opplegget i fadderuka! På denne siden finner du mer
                informasjonom dette samt noen flere opplysninger som kan være
                nyttig for deg som ny student.
              </Text>
            </Box>
            <Spacer />
            {!authenticated && (
              <Flex
                direction="column"
                width={{ base: '100%', md: '45%' }}
                maxW={{ base: '100%', md: '450px' }}>
                <Box
                  height="fit-content"
                  bg="slate.600"
                  p={3}
                  borderRadius="lg">
                  <Heading size="lg" mt={3} mb={2}>
                    Psssst!
                  </Heading>
                  <Text>
                    Hvis du er ny student på Informatikk ved UiT bør du opprette
                    en bruker her hos oss i TD. Da får du muligheten til å melde
                    deg på alle våre spennende arrengementer.
                  </Text>
                  <Button variant="secondary" onClick={moveToRegisterPage}>
                    Registrer
                  </Button>
                </Box>
              </Flex>
            )}
          </Flex>
          <VStack w={{ base: '100vw', md: '70vw' }} maxW={970} mt={10}>
            <Tabs
              size="lg"
              variant="line"
              colorScheme="blue"
              width="100%"
              isFitted>
              <TabList>
                <Tab>Fadderuka</Tab>
                <Tab>Om TD</Tab>
                <Tab>FAQ</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <FadderUka />
                </TabPanel>
                <TabPanel>
                  <About />
                </TabPanel>
                <TabPanel>
                  <FAQ />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </VStack>
      </Center>
      <Footer />
    </VStack>
  );
};

export default NewStudentsPage;

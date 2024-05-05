import {
  Box,
  Center,
  Flex,
  Heading,
  VStack,
  Text,
  Spacer,
  Image,
  Card,
  CardBody,
  CardHeader,
  Button,
  Divider,
  Link,
} from '@chakra-ui/react';
import Footer from 'components/molecules/footer/Footer';
import useTitle from 'hooks/useTitle';
import tdbytesQR from 'assets/tdbytes-qr.png';
import tdbytesMap from 'assets/tdbytes-location.png';
import TextField from 'components/atoms/textfield/Textfield';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import useForm from 'hooks/useForm';
import { useToast } from 'hooks/useToast';
import { ProductSuggestionPayload } from 'models/apiModels';
import { addSuggestion } from 'api/kiosk';

const TDBytesPage = () => {
  useTitle('TD Bytes');
  const history = useHistory();
  const { authenticated, role } = useContext(AuthenticateContext);
  const { addToast } = useToast();

  const hasAuthorization = role === Roles.admin || role === Roles.kiosk_admin;

  const moveToLoginPage = () => {
    history.push('/login');
  };

  const onSubmit = async () => {
    try {
      if (!fields['suggestion']?.value) {
        addToast({
          title: 'Feilmelding',
          status: 'error',
          description: 'Forslag kan ikke være tomt',
        });
        return;
      }

      const payload = {
        product: fields['suggestion']?.value,
      } as ProductSuggestionPayload;

      await addSuggestion(payload);

      /* Clear input on success */
      fields['suggestion'].value = '';

      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Forslag ble sendt inn',
      });
    } catch (error) {
      addToast({
        title: 'Feilmelding',
        status: 'error',
        description: 'En ukjent feil skjedde',
      });
    }
  };

  const { fields, onFieldChange, onSubmitEvent } = useForm({
    onSubmit: onSubmit,
  });

  return (
    <VStack>
      <Center pt="50px">
        <VStack pb="1rem">
          <Flex
            width={{ base: '95vw', md: '70vw' }}
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'center', md: 'unset' }}
            maxW={970}>
            <Box
              width={{ base: '100%', md: '45%' }}
              maxW={{ base: '100%', md: '450px' }}>
              <Heading
                size="2xl"
                textDecoration="underline"
                textDecorationColor="red.td"
                mt={0}>
                TD Bytes
              </Heading>
              <Text mt={3}>
                Velkommen til TD bytes, TD sin kiosk på campus! Her selger vi
                diverse snacks, databrus og micro-mat til innkjøpspris. Sitter
                du og grinder med en oblig og trenger en boost, har glemt
                matpakka hjemme eller bare får lyst på en cola, stikk innom og
                sjekk den ut! Kiosken har selvbetjening med Vipps.
              </Text>
            </Box>
            <Spacer />
            <Card maxW="300px" background="slate.600">
              <CardBody>
                <Center>
                  <Image boxSize="200px" src={tdbytesQR} />
                </Center>
                <Text mt="1rem" mb="0">
                  Scann QR-koden for å sjekke ut prislistene våre på vipps!
                </Text>
              </CardBody>
            </Card>
          </Flex>
        </VStack>
      </Center>
      <Box w="100%" background="slate.600" py="2rem" mb="1rem">
        <Center>
          <Flex
            width={{ base: '95vw', md: '70vw' }}
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'center', md: 'unset' }}
            maxW={970}>
            <Image src={tdbytesMap} maxW="500px" />
            <Spacer />
            <Box maxW={{ base: '85vw', md: '45%' }} ml="1rem">
              <Heading size="md" mt={{ base: '1rem', md: '0px' }}>
                Kiosken ligger på TD-kontoret...
              </Heading>
              <Text>
                ...som du finner på A023 i IFI-kjelleren! I tillegg til kiosk
                finner du også en sofa å deise ned i og en TV å streame noe
                lættis på.
              </Text>
              <Text>
                Kontoret skal i utgangspunktet være åpent i skoletidene, men
                dersom du finner det låst har alle i TD-styret tilgang til å
                låse det opp. Finner du en av oss kan vi swipe deg inn!
              </Text>
            </Box>
          </Flex>
        </Center>
      </Box>
      <Center mb="2rem" w="100vw">
        <Card maxW={{ base: '95vw', md: 'md' }} background="slate.600">
          <CardHeader>
            <Heading size="lg" m={0}>
              Har du et forslag?
            </Heading>
          </CardHeader>
          <CardBody>
            <Text>
              Vi er alltid ute etter å ha ta inn varer som treffer flest mulig
              informatikkstudenter. Har du en ide til neste innkjøp, så fyr inn
              et forslag her!
            </Text>
            <Divider mb="1.5rem" />
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between">
              {authenticated ? (
                <>
                  <TextField
                    name={'suggestion'}
                    label={'Forslag'}
                    value={fields['suggestion']?.value ?? ''}
                    onChange={onFieldChange}
                  />
                  <Button
                    variant="secondary"
                    ml={{ base: '0px', md: '1rem' }}
                    mt=".5rem"
                    onClick={onSubmitEvent}>
                    Send inn
                  </Button>
                </>
              ) : (
                <>
                  <Text m={0}>Logg inn for å sende inn forslag</Text>
                  <Button
                    variant="secondary"
                    ml={{ base: '0px', md: '1rem' }}
                    onClick={moveToLoginPage}>
                    Logg inn
                  </Button>
                </>
              )}
            </Flex>
            {hasAuthorization && (
              <Box mt=".5rem">
                <Link
                  as={RouterLink}
                  variant="secondary"
                  to="/tdbytes/suggestions">
                  Gå til forslagsoversikt
                </Link>
              </Box>
            )}
          </CardBody>
        </Card>
      </Center>
      <Footer />
    </VStack>
  );
};

export default TDBytesPage;

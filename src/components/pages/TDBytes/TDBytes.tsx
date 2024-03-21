import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  VStack,
  Text,
  Spacer,
  Image,
} from '@chakra-ui/react';
import Footer from 'components/molecules/footer/Footer';
import useTitle from 'hooks/useTitle';
import tdbytesQR from 'assets/tdbytes-qr.png';

const TDBytesPage = () => {
  useTitle('TD Bytes');

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
                TD Bytes
              </Heading>
              <Text mt={3}>
                Velkommen til TD bytes, TD sin kiosk på campus!
              </Text>
            </Box>
            <Spacer />
            <Flex>
              <Box p={3} borderRadius="lg" borderColor="white">
                <Image boxSize="200px" src={tdbytesQR} />
                <Text>
                  Scann QR-koden for å sjekke ut prislistene våre på vipps!
                </Text>
              </Box>
            </Flex>
          </Flex>
        </VStack>
      </Center>
      <Footer />
    </VStack>
  );
};

export default TDBytesPage;

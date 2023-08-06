import useTitle from 'hooks/useTitle';
import Footer from 'components/molecules/footer/Footer';
import About from './About';
import { Center, Box, VStack } from '@chakra-ui/react';

const AboutPage = () => {
  useTitle('Om oss');
  return (
    <VStack>
      <Center>
        <Box width={{ base: '95vw', md: '70vw' }} mt="1rem" maxW={970}>
          <About />
        </Box>
      </Center>
      <Footer />
    </VStack>
  );
};

export default AboutPage;

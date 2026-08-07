import React from 'react';
import { Box, Center, Heading, VStack } from '@chakra-ui/react';
import useTitle from 'hooks/useTitle';
import Footer from 'components/molecules/footer/Footer';
import Committees from './Committees';

const KomitePage: React.FC = () => {
  useTitle('Komitéer');
  return (
    <VStack>
      <Center>
        <Box width={{ base: '95vw', md: '70vw' }} mt="1rem" maxW={970}>
          <Heading
            size="2xl"
            textDecoration="underline"
            textDecorationColor="red.td">
            Komitéer
          </Heading>
          <Box mt="1rem">
            <Committees />
          </Box>
        </Box>
      </Center>
      <Footer />
    </VStack>
  );
};

export default KomitePage;

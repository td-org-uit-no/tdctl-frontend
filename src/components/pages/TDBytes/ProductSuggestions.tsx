import {
  Center,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { getSuggestions } from 'api/kiosk';
import Footer from 'components/molecules/footer/Footer';
import useTitle from 'hooks/useTitle';
import { ProductSuggestion } from 'models/apiModels';
import { useEffect, useState } from 'react';
import { dateToFormString } from 'utils/date';

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState<
    ProductSuggestion[] | undefined
  >(undefined);
  useTitle('TD Bytes - Forslag');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const fetchedSuggestions = await getSuggestions();
        setSuggestions(fetchedSuggestions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <VStack>
      <Center py="2rem">
        <VStack
          width={{ base: '95vw', md: '70vw' }}
          alignItems={{ base: 'center', md: 'unset' }}
          maxW={970}>
          <Heading size="xl">Produktforslag til TD Bytes</Heading>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Dato</Th>
                  <Th>Forslag</Th>
                  <Th>Bruker</Th>
                </Tr>
              </Thead>
              <Tbody>
                {suggestions &&
                  suggestions.map((suggestion) => (
                    <Tr key={suggestion.timestamp.toString()}>
                      <Td>
                        {dateToFormString(new Date(suggestion.timestamp))}
                      </Td>
                      <Td>{suggestion.product}</Td>
                      <Td>{suggestion.username}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Center>
      <Footer />
    </VStack>
  );
};

export default SuggestionsPage;

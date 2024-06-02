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
import { deleteSuggestion, getSuggestions } from 'api/kiosk';
import Icon from 'components/atoms/icons/icon';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import Footer from 'components/molecules/footer/Footer';
import Modal from 'components/molecules/modal/Modal';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import useModal from 'hooks/useModal';
import useTitle from 'hooks/useTitle';
import { useToast } from 'hooks/useToast';
import { ProductSuggestion } from 'models/apiModels';
import { useContext, useEffect, useState } from 'react';
import { sortDate } from 'utils/sorting';
import { transformDate } from 'utils/timeConverter';

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState<
    ProductSuggestion[] | undefined
  >(undefined);
  const [selected, setSelected] = useState<ProductSuggestion | undefined>(
    undefined
  );
  const [errMsg, setErrMsg] = useState<string | undefined>(undefined);

  useTitle('TD Bytes - Forslag');
  const { role } = useContext(AuthenticateContext);
  const { addToast } = useToast();
  const {
    isOpen: isOpenDeleteModal,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useModal();

  const deleteSelected = async () => {
    try {
      if (!selected) {
        return;
      }
      await deleteSuggestion(selected.id);
      setSuggestions(suggestions?.filter((s) => s.id !== selected.id));
      addToast({
        title: 'Suksess',
        status: 'success',
        description: 'Forslaget ble slettet',
      });
    } catch (error) {
      if (error.statusCode === 404) {
        addToast({
          title: 'Feilmelding',
          status: 'error',
          description: 'Kunne ikke finne forslag i databasen',
        });
      } else {
        addToast({
          title: 'Feilmelding',
          status: 'error',
          description: 'En ukjent feil skjedde',
        });
      }
    }
    closeDeleteModal();
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const fetchedSuggestions = await getSuggestions();
        const sortedSuggestions = fetchedSuggestions.sort((a, b) => {
          /* Must correctly initialize date objects */
          const aDate = new Date(a.timestamp);
          const bDate = new Date(b.timestamp);
          return sortDate(bDate, aDate); // Sort from newest to oldest
        });
        setSuggestions(sortedSuggestions);
        setErrMsg(undefined);
      } catch (error) {
        if (error.statusCode === 404) {
          setErrMsg('Fant ingen forslag...');
        } else {
          setErrMsg('Noe gikk galt');
        }
      }
    };
    /* Only allow authorized memebers to view suggestions */
    if (role === Roles.admin || role === Roles.kiosk_admin) {
      fetchSuggestions();
    } else {
      setErrMsg('Du har ikke de nødvendige rettighetene');
    }
  }, [role]);

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
                  !errMsg &&
                  suggestions.map((suggestion) => (
                    <Tr key={suggestion.timestamp.toString()}>
                      <Td>{transformDate(new Date(suggestion.timestamp))}</Td>
                      <Td style={{whiteSpace:"normal", wordWrap:"break-word"}}> {suggestion.product} </Td>
                      <Td>{suggestion.username}</Td>
                      {role === Roles.admin && (
                        <Td maxW="100%">
                          <Icon
                            size={2}
                            type="trash"
                            onClick={() => {
                              setSelected(suggestion);
                              openDeleteModal();
                            }}
                          />
                        </Td>
                      )}
                    </Tr>
                  ))}
                {errMsg && (
                  <Tr>
                    <Td colSpan={3}>{errMsg}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Center>
      <Footer />
      <Modal
        title="Er du sikker på at du vil slette forslaget?"
        isOpen={isOpenDeleteModal}
        onClose={closeDeleteModal}
        minWidth={45}>
        <ConfirmationBox
          onAccept={deleteSelected}
          onDecline={closeDeleteModal}
        />
      </Modal>
    </VStack>
  );
};

export default SuggestionsPage;

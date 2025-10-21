import {
  Flex,
  Heading,
  Center,
  Text,
  Spinner,
  Box,
  Badge,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Committee } from 'models/apiModels';
import { listCommittees, applyToCommittee } from 'api/committee';
import Modal from 'components/molecules/modal/Modal';
import TextField from 'components/atoms/textfield/Textfield';
import Textarea from 'components/atoms/textarea/Textarea';
import { AuthenticateContext, Roles } from 'contexts/authProvider';
import { useToast } from 'hooks/useToast';
import { useContext } from 'react';

interface ICommitteProps {
  children?: React.ReactNode;
}

const Committe: React.FC<ICommitteProps> = ({ children }) => {
  return (
    <Flex
      direction="column"
      borderRadius="lg"
      overflow="hidden"
      flexGrow={1}
      w={{ base: '100%', lg: '40%' }}>
      {children}
    </Flex>
  );
};

const Committees: React.FC = () => {
  const [items, setItems] = useState<Committee[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(
    null
  );
  const [isApplyOpen, setApplyOpen] = useState(false);
  const [discord, setDiscord] = useState('');
  const [motivation, setMotivation] = useState('');
  const { authenticated, role } = useContext(AuthenticateContext);
  const { addToast } = useToast();
  const [applyError, setApplyError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await listCommittees({
          status: 'active',
          sort: 'name',
          limit: 100,
        });
        setItems(res.items);
      } catch (e) {
        setError('Kunne ikke laste inn komitéer');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text>{error}</Text>
      </Center>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Center>
        <Text>Ingen komitéer tilgjengelig</Text>
      </Center>
    );
  }

  return (
    <Flex wrap="wrap" justify="space-between" gap="1rem">
      {items.map((c) => (
        <Committe key={c.id}>
          {/* Header with title and badge */}
          <Box bg="gray.300" borderTopRadius="lg">
            <Box p="1rem" pb={c.hasOpenSpots ? '0.5rem' : '1rem'}>
              <Heading as="h3" size="lg" textAlign="center" color="blue.900">
                {c.name}
              </Heading>
            </Box>
            {c.hasOpenSpots && (
              <Box
                bg="green.500"
                color="white"
                textAlign="center"
                p="0.5rem"
                fontSize="sm"
                fontWeight="bold"
                letterSpacing="wide">
                ÅPEN FOR MEDLEMMER
              </Box>
            )}
          </Box>

          {/* Content section */}
          <Box
            bg="slate.600"
            p="1rem"
            pt={c.hasOpenSpots ? '1.5rem' : '1rem'}
            pb={c.hasOpenSpots ? '1rem' : '1.5rem'}
            flex="1"
            borderBottomRadius={!c.hasOpenSpots ? 'lg' : '0'}>
            <Text textAlign="center" color="white">
              {c.description || 'Ingen beskrivelse tilgjengelig.'}
            </Text>
          </Box>

          {/* Button section */}
          {c.hasOpenSpots && (
            <Box bg="slate.600" px="1rem" pb="1rem" borderBottomRadius="lg">
              <Button
                width="100%"
                size="sm"
                onClick={() => {
                  setSelectedCommittee(c);
                  setDiscord('');
                  setMotivation('');
                  setApplyError(null);
                  setApplyOpen(true);
                }}
                isDisabled={
                  !authenticated ||
                  !(role === Roles.member || role === Roles.admin)
                }>
                Søk om plass
              </Button>
            </Box>
          )}
        </Committe>
      ))}

      <Modal
        title={`Søk på ${selectedCommittee?.name ?? ''}`}
        isOpen={isApplyOpen}
        onClose={() => setApplyOpen(false)}
        minWidth={70}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
          }}>
          <TextField
            label="Discord brukernavn"
            placeholder="f.eks. navnetmitt#1234"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
          <Textarea
            label="Hvorfor vil du bli med?"
            placeholder="Skriv noen setninger om hvorfor du vil bli med i komiteen"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            resize
          />
          {applyError && (
            <Text color="red.300" fontSize="sm">
              {applyError}
            </Text>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
            }}>
            <Button variant="secondary" onClick={() => setApplyOpen(false)}>
              Avbryt
            </Button>
            <Button
              variant="primary"
              isLoading={isSubmitting}
              onClick={async () => {
                if (!selectedCommittee) return;
                setApplyError(null);
                const combined =
                  `Discord: ${discord}\nMessage: ${motivation}`.trim();
                if (combined.length > 2000) {
                  setApplyError('Meldingen er for lang (maks 2000 tegn).');
                  return;
                }
                setSubmitting(true);
                try {
                  await applyToCommittee(selectedCommittee.id, {
                    message: combined,
                  });
                  addToast({ title: 'Søknad sendt', status: 'success' });
                  setApplyOpen(false);
                } catch (e: any) {
                  switch (e.statusCode) {
                    case 400:
                      setApplyError(
                        'Komiteen tar ikke imot søknader nå eller melding mangler/for lang.'
                      );
                      break;
                    case 401:
                      setApplyError('Du må være innlogget for å søke.');
                      break;
                    case 404:
                      setApplyError('Fant ikke komiteen.');
                      break;
                    default:
                      setApplyError('Noe gikk galt. Prøv igjen senere.');
                  }
                } finally {
                  setSubmitting(false);
                }
              }}
              isDisabled={!discord || !motivation}>
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </Flex>
  );
};

export default Committees;

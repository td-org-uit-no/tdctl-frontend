import { Center, Heading, VStack } from '@chakra-ui/react';
import JobForm from 'components/molecules/forms/jobForm/JobForm';

const CreateJob = () => {
  return (
    <Center mt="2rem">
      <VStack>
        <Heading>Opprett Stillingsutlysning</Heading>
        <JobForm />
      </VStack>
    </Center>
  );
};

export default CreateJob;

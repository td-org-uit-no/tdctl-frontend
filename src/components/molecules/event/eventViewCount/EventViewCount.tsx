import { Center, Heading, Text } from '@chakra-ui/react';
import { getPageVisit } from 'api';
import Icon from 'components/atoms/icons/icon';
import { useEffect, useState } from 'react';

const EventViewCount: React.FC<{ page: string }> = ({ page }) => {
  const [views, setViews] = useState<number | undefined>();

  const fetchPageVisist = async () => {
    const response = await getPageVisit(page);
    setViews(response.visits);
  };

  useEffect(() => {
    fetchPageVisist();
  }, []);

  return (
    <Center
      w="100%"
      height="20%"
      borderRadius="lg"
      border="1px"
      borderColor="#fffff"
      textAlign="center"
      flexDir="column">
      <Heading size="sm" m=".5rem">
        Antall besøk
      </Heading>
      <Center dir="column" textAlign="center">
        <Icon size={2} type="eye" />
        <Text p={0} m={0} ml=".5rem">
          {views ?? 'N/A'}
        </Text>
      </Center>
    </Center>
  );
};

export default EventViewCount;

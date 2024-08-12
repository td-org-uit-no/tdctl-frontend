import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import FooterLogos from './footerLogos/FooterLogos';
import { Link, Text, Box, Heading, Flex } from '@chakra-ui/react';

interface FooterListProps {
  header: string;
  children?: React.ReactNode;
}

const FooterList: React.FC<FooterListProps> = ({ header, children }) => {
  return (
    <Flex direction="column" textAlign="left" justify="flex-start">
      <Heading as="h4" size="md" color="slate.500" mt={0}>
        {' '}
        {header}{' '}
      </Heading>
      {children}
    </Flex>
  );
};

interface FooterItemProps {
  label: string;
  path: string;
  header?: string;
  isExternal?: boolean;
}

const FooterItem: React.FC<FooterItemProps> = ({
  label,
  path,
  header,
  isExternal,
}) => {
  return (
    <Box>
      {header !== undefined && <Text m={0}>{header}</Text>}
      <Text fontSize="0.75rem" mb=".5rem">
        {isExternal ? (
          <Link href={path} isExternal variant="secondary">
            {label}
          </Link>
        ) : (
          <Link as={ReactRouterLink} to={path} variant="secondary">
            {label}
          </Link>
        )}
      </Text>
    </Box>
  );
};

const Footer: React.FC = () => {
  // uses margin auto, needs parent page to have minHeight=100vh if content is not over 100vh
  return (
    <Flex
      my="0rem"
      w="100%"
      direction={{ base: 'column', lg: 'row' }}
      mt="auto"
      bgColor="slate.900"
      style={{ paddingBottom: '1rem', paddingTop: '2rem' }}>
      <Flex justify="space-evenly" width={{ base: '100%', lg: '60%' }}>
        <FooterList header={'Ressurser'}>
          <FooterItem label={'Om TD'} path={'/about-us'} />
          <FooterItem
            label={'TD kalender'}
            path={
              'https://calendar.google.com/calendar/u/1?cid=Y19mNDQ4Y2I1MDU0ODIwZGQyMDE0Yjk1NTkzNWZlZDZmMTA1YTdkNzBlZGEwM2NhNDAzMDc2ODMzNmI5N2Y1NjlmQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'
            }
            isExternal
          />
          <FooterItem label={'For nye studenter'} path={'/new-student'} />
          <FooterItem label={'Stillingsutlysninger'} path={'/jobs'} />
          <FooterItem
            label={'Bidra til utviklingen av nettsiden!'}
            path={
              'https://github.com/td-org-uit-no/tdctl-frontend/wiki/Getting-started'
            }
            isExternal
          />
        </FooterList>
        <FooterList header={`Kontakt`}>
          <FooterItem
            header={'Leder'}
            label={'leder@td-uit.no'}
            path={'mailto:leder@td-uit.no'}
            isExternal
          />
          <FooterItem
            header={'Økonomiansvarlig'}
            label={'okonomi@td-uit.no'}
            path={'mailto:okonomi@td-uit.no'}
            isExternal
          />
          <FooterItem
            header={'Post'}
            label={'post@td-uit.no'}
            path={'mailto:post@td-uit.no'}
            isExternal
          />
        </FooterList>
      </Flex>
      <FooterLogos />
    </Flex>
  );
};

export default Footer;

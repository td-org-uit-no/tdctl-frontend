import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import hsp from 'assets/bekk-logo.svg';
import FooterLogos from './footerLogos/FooterLogos';
import {
  VStack,
  Image,
  Link,
  Text,
  Show,
  Divider,
  Center,
  Box,
  Heading,
  Flex,
} from '@chakra-ui/react';

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

const SponsorBanner = () => {
  return (
    <Link
      href="https://www.bekk.no/"
      isExternal
      _hover={{ textDecoration: 'none' }}
      pt={{ base: '1.5rem', md: 0 }}>
      <VStack>
        <Image
          src={hsp}
          alt="BEKK logo"
          height={{ base: '100px', md: '150px' }}
        />
        <Text size="xs" mb={0} mt=".5rem" textColor="slate.500">
          Hovedsamarbeidspartner
        </Text>
      </VStack>
    </Link>
  );
};

const Footer: React.FC = () => {
  // uses margin auto, needs parent page to have minHeight=100vh if content is not over 100vh
  return (
    <Flex
      my="2rem"
      w="100%"
      direction={{ base: 'column', lg: 'row' }}
      mt="auto">
      <Flex justify="space-evenly" width={{ base: '100%', lg: '60%' }}>
        <FooterList header={'Ressurser'}>
          <FooterItem label={'Om TD'} path={'/about-us'} />
          <FooterItem label={'For nye studenter'} path={'/new-student'} />
          <FooterItem label={'Stillingsutlysninger'} path={'/jobs'} />
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
      <Show below="lg">
        <Center>
          <Divider my=".5rem" width="80vw" />
        </Center>
      </Show>
      <SponsorBanner />
      <Show above="lg">
        <FooterLogos />
      </Show>
    </Flex>
  );
};

export default Footer;

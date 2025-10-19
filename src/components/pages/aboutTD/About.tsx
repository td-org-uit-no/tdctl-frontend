import {
  Box,
  Heading,
  Text,
  Center,
  Flex,
  Image,
  Link,
} from '@chakra-ui/react';
import logo from 'assets/td-full-logo.png';

interface IBoardPost {
  position: string;
  members: string[];
  mail: string[];
}

const TDBoardPost: React.FC<IBoardPost> = ({ position, members, mail }) => {
  // adds bar between members if members are multiple names
  const stringRepr = members.reduce(
    (text, value, i, array) =>
      text + (i <= array.length - 1 ? ' | ' : '') + value
  );
  return (
    <Center
      borderRadius="lg"
      bg="slate.600"
      flexGrow={1}
      p=".5rem"
      w={{ base: '100%', lg: '40%' }}>
      <Flex direction="column" justify="center" textAlign="center">
        <Heading as="h5" size={{ base: 'sm', lg: 'md' }} m={0}>
          {position}
        </Heading>
        <Flex textAlign="center" justify="center">
          <Text m="0">{stringRepr}</Text>
        </Flex>
        {mail.map((m, i) => (
          <Link
            href={`mailto:${mail}`}
            key={i}
            color="blue.400"
            mb={i === mail.length - 1 ? '.5rem' : '0rem'}>
            {m}
          </Link>
        ))}
      </Flex>
    </Center>
  );
};

const TDBoardContactInfo: React.FC = () => {
  return (
    <Flex wrap="wrap" justify="space-between" gap="1rem">
      <TDBoardPost
        position="Leder"
        members={['Aslak Vik Sørvik']}
        mail={['leder@td-uit.no']}
      />
      <TDBoardPost
        position="Nestleder"
        members={['Keyvan Sadeghi']}
        mail={['nestleder@td-uit.no']}
      />
      <TDBoardPost
        position="Arrangementsansvarlig"
        members={['Ging Enoksen', 'Marie Stenhaug']}
        mail={['arrangement@td-uit.no']}
      />
      <TDBoardPost
        position="Kommunikasjonsansvarlig"
        members={['Sera Elstad', 'Eline De Vito']}
        mail={['bedriftskommunikasjon@td-uit.no']}
      />
      <TDBoardPost
        position="Nettsideansvarlig"
        members={['Ole Tytlandsvik']}
        mail={['nettside-ansvarlig@td-uit.no']}
      />
      <TDBoardPost
        position="Teknisk ansvarlig"
        members={['Jørgen Molde Bårli']}
        mail={['teknisk@td-uit.no']}
      />
      <TDBoardPost
        position="Økonomisk ansvarlig"
        members={['Marius Møller-Hansen']}
        mail={['økonomi@td-uit.no']}
      />
      <TDBoardPost
        position="Fagansvarlig"
        members={['Eindride Kjersheim']}
        mail={['fagkomite@td-uit.no']}
      />
    </Flex>
  );
};

const About = () => {
  return (
    <>
      <Image src={logo} alt="Tromsøstudentenes Dataforening" />
      <Heading size="lg">Hvem er TD?</Heading>
      <Text>
        Tromsøstudentenes Dataforening er linjeforeningen for alle
        informatikkstudenter ved UiT. Vi består av både bachelor- og
        masterstudenter spredd over fire spesialiseringer: Datamaskinsystemer,
        Cybersikkerhet, Helseteknologi og Kunstig Intelligens.
      </Text>
      <Heading size="lg">Hva gjør TD?</Heading>
      <Text>
        TD jobber for å gjøre studietiden til våre studenter best mulig. Gjennom
        å tilby faglige og sosiale arrangementer bidrar TD til å bygge
        nettverket og miljøet blant studentene ved Informatikkstudiet. Vi pleier
        blant annet å arrangere UiTHack og en årlig helgetur til et skianlegg,
        samt julebord og diverse temafester.
      </Text>
      <Text>
        I tillegg til det sosiale miljøet på studiet jobber TD også med å sette
        studentene i kontakt med næringslivet. Gjennom blant annet
        bedriftspresentasjoner gir vi studentene anledning til å utforske
        mulighetene de har etter endt studie og bli kjent med bedrifter i
        fagfeltet.
      </Text>
      <Box>
        <Center>
          <Heading
            size="2xl"
            textDecoration="underline"
            textDecorationColor="red.td">
            TD-Styret
          </Heading>
        </Center>
        <TDBoardContactInfo />
      </Box>
    </>
  );
};

export default About;

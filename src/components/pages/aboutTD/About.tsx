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

interface ICommitte {
  name: string;
  children?: React.ReactNode;
}

const Committe: React.FC<ICommitte> = ({ name, children }) => {
  // committee description is passed as children
  return (
    <Center
      borderRadius="lg"
      bg="slate.600"
      flexGrow={1}
      p=".5rem"
      w={{ base: '100%', lg: '40%' }}>
      <Flex direction="column" justify="center" textAlign="center">
        <Heading as="h3" size="lg">
          {name}
        </Heading>
        {children}
      </Flex>
    </Center>
  );
};

const TDcommittees: React.FC = () => {
  return (
    <Flex wrap="wrap" justify="space-between" gap="1rem">
      <Committe name="Arrangementskomité">
        <p>
          {' '}
          Arrangementskomiteen jobber med å planlegge og gjennomføre
          forskjellige arrangementer, alt fra fester og skiturer til
          musikkbingo. Er dette noe som høres spennende ut ta kontakt med oss på{' '}
          <Link href="mailto:arrangementsansvarlig@td-uit.no" color="blue.400">
            mail.
          </Link>
        </p>
      </Committe>

      <Committe name="Bedriftskomité">
        <p>
          Bedriftskomiteen jobber med å kontakte bedrifter og sette opp
          bedriftsarrangementer i regi av TD. Har du lyst til å høre mer om
          dette ta kontakt med{' '}
          <Link href="mailto:bedriftskommunikasjon@td-uit.no" color="blue.400">
            kommunikasjonsansvarlig.
          </Link>
        </p>
      </Committe>
      <Committe name="Nettsidekomité">
        <p>
          {' '}
          Lyst til å lære frontend og backend utvikling eller bare gira på å
          legge til noen features? Ta{' '}
          <Link href="mailto:nettside-ansvarlig@td-uit.no" color="blue.400">
            kontakt
          </Link>{' '}
          eller sjekk ut githuben vår for{' '}
          <Link
            href="https://github.com/td-org-uit-no/tdctl-frontend"
            color="blue.400">
            frontend
          </Link>{' '}
          og{' '}
          <Link
            href="https://github.com/td-org-uit-no/tdctl-api"
            color="blue.400">
            backend.{' '}
          </Link>
        </p>
      </Committe>
      <Committe name="TD på tapp">
        <p>
          {' '}
          TD på tapp er TD sin ølbryggingskomité. Her brygges det øl til
          forskjellige anledninger. Er du interessert i ølbrygging eller har
          lyst til å bli med? send oss en{' '}
          <Link href="mailto:studentkommunikasjon@td-uit.no" color="blue.400">
            mail.
          </Link>
        </p>
      </Committe>
      <Committe name="UiT Hack">
        <p>
          TD arrangerer årlig sin egen CTF kalt{' '}
          <Link href="https://uithack.no/" color="blue.400">
            UiTHack
          </Link>{' '}
          og vi trenger folk til å være med på å lage forskjellige oppgaver. Det
          kreves ingen forkunnskaper for å bidra med en artig oppgave! Er du
          interessert i hacking og CTF, eller bare er nysgjerrig, ta kontakt med{' '}
          <Link href="mailto:studentkommunikasjon@td-uit.no" color="blue.400">
            teknisk ansvarlig.
          </Link>
        </p>
      </Committe>
      <Committe name="Fagkomité">
        <p>
          {' '}
          Fagkomiteen jobber med faglige arrangementer. Du kan være med å
          arrangere IoTD for å lære mer om elektronikk og mikrokontrollere,
          3D-printing osv. eller bli med å arrangere faglige workshops,
          TD-talks, programmeringseventer og annen faglig aktivitet du ønsker å
          bidra til. Er dette noe som høres spennende ut? Ta kontakt med{' '}
          <Link href="mailto:fagkomite@td-uit.no" color="blue.400">
            fagansvarlig.
          </Link>
        </p>
      </Committe>
    </Flex>
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
        <Center>
          <Heading
            size="2xl"
            textDecoration="underline"
            textDecorationColor="red.td">
            Komitéer
          </Heading>
        </Center>
        <TDcommittees />
      </Box>
    </>
  );
};

export default About;

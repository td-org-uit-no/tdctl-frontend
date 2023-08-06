import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Box,
  Text,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

interface IFAQItem {
  Q: string;
  children?: React.ReactNode;
}

const FAQItem: React.FC<IFAQItem> = ({ Q, children }) => {
  return (
    <AccordionItem>
      <AccordionButton>
        <Box as="span" flex={1} textAlign="left" fontWeight="bold">
          {Q}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>{children}</AccordionPanel>
    </AccordionItem>
  );
};

const FAQ = () => {
  return (
    <>
      <Heading size="lg" mt={0} mb="1rem">
        TD
      </Heading>
      <Accordion allowMultiple>
        <FAQItem Q="Hvorfor bør jeg melde meg inn i TD?">
          Når du registrerer deg på denne nettsiden melder du deg inn i TD og
          får tilgang til alle våre spennende arrangementer gjennom semesteret,
          og ikke minst i fadderuka! Deltar du på våre arrangementer blir du en
          del av det gode miljøet på informatikkstudiet. Å melde seg inn i TD
          koster ingenting.
        </FAQItem>
        <FAQItem Q="Hva arrangerer TD?">
          I løpet av et studieår arrangerer TD en rekke forskjellige
          arrangementer som strekker seg fra faglige kurs og hackathon til
          temafester og helgeturer til skianlegg. TD har også arrangert
          ukentlige sammenkomster med lav terskel i form av blant annet fotball
          på TSE, kaffe & kos og IoTD avhengig av interesse. Se kommende
          arrangementer på{' '}
          <Link as={ReactRouterLink} to="/eventoverview">
            arrangementsoversikten.
          </Link>
        </FAQItem>
        <FAQItem Q="Hva er en bedriftspresentasjon?">
          TD arrangerer bedriftspresentasjoner ukentlig i store deler av
          semesteret i samarbeid med en rekke bedrifter. Disse er en måte for
          deg å bli kjent med de forskjellige bedriftene i fagfeltet på og
          utforske jobbmuligheter. Ofte blir man påspandert mat og forfiskninger
          utover kvelden.
        </FAQItem>
        <FAQItem Q="Hvordan kan jeg bidra i TD?">
          <Text>
            TD styres fullt og helt av frivillige informatikkstudenter, og hvem
            som helst kan bidra til vår virksomhet. I årsmøtet i Mars er man
            velkommen til å stille til de ulike styrevervene eller stemme på
            andre. Vi har også en rekke komitéer som man fritt kan delta i og
            som driver med alt fra utvikling av denne nettsiden til ølbrygging
            og planlegging av ulike arrangementer. Vi vil mer enn gjerne ha deg
            med!
          </Text>
          <Text>
            I tillegg til komitéene våre er vi i TD også åpne for
            interessegrupper som kan organiseres uavhengig av selve TD-styret.
            Har du en god idé til et tilbud som kan engasjere dine medstudenter
            kan TD stille med midler og eventuelt utstyr.
          </Text>
        </FAQItem>
        <FAQItem Q="Hvordan kan jeg kontakte TD?">
          TD-styret kan kontaktes på epost eller via{' '}
          <Link href="https://discord.gg/f7BFBVdqnh" isExternal>
            discord
          </Link>
          . For generelle henvendelser på epost kan du bruke{' '}
          <Link href="mailto:post@td-uit.no">post@td-uit.no</Link>, og for å
          kontakte leder bruker du{' '}
          <Link href="mailto:leder@td-uit.no">leder@td-uit.no</Link>.
          Fullstendig liste over styremedlemmer og kontaktinformasjon finner du
          på siden{' '}
          <Link as={ReactRouterLink} to="/about-us">
            Om TD.
          </Link>
        </FAQItem>
      </Accordion>
      <Heading size="lg" my="1rem">
        Informatikkstudiet
      </Heading>
      <Accordion allowMultiple>
        <FAQItem Q="Hva er en kollokvietime?">
          Kollokvietimene ved informatikk er en faglig gruppetime i regi av UiT
          hvor man kan stille spørsmål, få hjelp fra hjelpelærer og jobbe med
          faget sammen med medstudentene dine. Hjelpelærerene er i hovedsak
          studenter ved informatikk som har vært gjennom faget før. Spesielt det
          første året anbefaler vi sterkt å møte opp på så mange kollokvier som
          mulig både for å få god hjelp og henge med i faget, men også for å
          lettere komme deg inn i et godt arbeidsmiljø på kullet ditt.
        </FAQItem>
        <FAQItem Q="Hvilke pensumbøker trenger jeg?">
          <Text>
            Pensumlistene for hvert enkelt fag er som regel å finne på
            canvas-siden til det enkelte faget. Er man usikker på hvilket opplag
            eller versjon man trenger kan de ansatte på akademika hjelpe til,
            man kan spørre fadder og man kan selvsagt også spørre hjelpelærer
            eller foreleser.
          </Text>
          <Text>
            Det er ikke alltid at man har behov for alle bøkene som står i
            pensumlisten, og dette varierer fra person til person og fra kurs
            til kurs. Likevel anbefaler vi som hovedregel at du skaffer deg
            bøkene dersom du er i tvil i starten. Husk at du ofte kan få kjøpt
            dem brukt til en rimelig pris.
          </Text>
        </FAQItem>
        <FAQItem Q="Hvor får jeg kjøpt pensumbøkene?">
          Pensumbøker er å få tak i på mange forskjellige bokhandler, men
          akademika har størst utvalg på dette området og kan skaffe pensum til
          alle kurs ved UiT. De har en fysisk butikk i kjelleren av
          Universitetsbiblioteket midt på campus. Ofte kan man kjøpe bøker til
          en rimelig penge fra andre studenter som er ferdig med kurset du skal
          ta. På vår{' '}
          <Link href="https://discord.gg/f7BFBVdqnh" isExternal>
            discord-server
          </Link>{' '}
          fins en kanal som er myntet på kjøp og salg av pensum. Ellers kan man
          også prøve seg på finn.no, eller på sosiale medier.
        </FAQItem>
        <FAQItem Q="Hvor er det lurt å arbeide med studiet?">
          Du står selvsagt fritt til å jobbe med studiet akkurat hvor det passer
          deg, men vi vil likevel komme med en oppfordring til å møte opp på
          campus, gjerne i IFI-kjelleren. Er du på UiT blir du raskt kjent med
          bygget og ikke minst dine medstudenter. Å finne seg noen å jobbe med
          ser vi på som veldig viktig da det kan gjøre en stor forskjell for
          hvor godt du mestrer studiet.
        </FAQItem>
        <FAQItem Q="Hvilken type PC må jeg ha for å studere Informatikk?">
          Det er ingen spesielle krav til PC på studiet. Det er mange studenter
          som bruker både Windows, MacOS og Linux som operativsystem, og alle
          disse går stort sett fint å bruke; hjelpelærerene har god erfaring med
          alle tre. Mange som starter med Windows velger å dual-boote med linux
          etter hvert (og her er det mye å lære!), men for de fleste kan det
          være lurt å prioritere selve studiet i starten. IFI har også en god
          del lab-PCer på de ulike informatikklabene som er tilgjengelig for
          alle informatikkstudenter.
        </FAQItem>
        <FAQItem Q="Hvordan finner jeg fram på campus?">
          Å orientere seg på campus kan være en utfordring i starten, og
          forelesninger kan bli arrangert på en rekke forskjellige bygg. Derfor
          kan det være lurt å laste ned appen Mazemap som gir et praktisk og
          komplett kart av alle rom i alle bygg på campus.
        </FAQItem>
        <FAQItem Q="Er det mulig å bytte mellom bachelor og integrert master etter hvert?">
          Ja, både fra bachelor til integrert master og omvendt er det mulig å
          bytte etter hvert. Det er verdt å merke seg at for å bytte fra
          bachelor til integrert master er det enkelte kurs som er valgfrie for
          bachelorstudenter som er obligatoriske for å kunne bytte. Har du
          planer om dette bør du derfor velge Kalkulus første semester.
        </FAQItem>
      </Accordion>
      <Heading size="lg" my="1rem">
        Studentlivet
      </Heading>
      <Accordion allowMultiple>
        <FAQItem Q="Hvor finner jeg et sted å bo?">
          <Text>
            Du har mange valg når det kommer til bolig. Mange leier hos
            Samskipnaden, som eier mange komplekser med både kollektiver og
            hybler som er myntet på studenter.{' '}
            <Link href="https://samskipnaden.no/studentboliger" isExternal>
              Her
            </Link>{' '}
            kan du søke om studentbolig hos Samskipnaden. Det er også mange som
            leier privat, og da kan det ofte være lurt å gå sammen flere i en
            leilighet med flere rom for å få en rimelig pris og beliggenhet.
            Mange utleiere på{' '}
            <Link href="https://hybel.no" isExternal>
              hybel.no
            </Link>
            ,{' '}
            <Link href="https://finn.no" isExternal>
              finn.no
            </Link>{' '}
            og{' '}
            <Link href="https://facebook.com" isExternal>
              facebook
            </Link>{' '}
            leier ut enkeltrom i bofelleskap om du ikke kjenner noen å flytte
            inn med. På vår{' '}
            <Link href="https://discord.gg/f7BFBVdqnh" isExternal>
              discord-server
            </Link>{' '}
            kan du også alltids prøve å komme i kontakt med medstudenter som
            også er på utkikk etter bolig.
          </Text>
          <Text>
            Når det kommer til beliggenhet kan det være kjekt å vite at
            Kvaløysletta og Tromsdalen på henholdsvis Kvaløya og fastlandet er
            fine alternativer til selve Tromsøya da det er gode bussforbindelser
            til UiT og sentrum.
          </Text>
        </FAQItem>
        <FAQItem Q="Hva er DRIV?">
          DRIV er et utested i Tromsø sentrum som er drevet av
          Studentsamskipnaden og som stort sett baserer seg på frivillige
          studenter for å tilby arrangementer som ukentlig Quiz og diverse
          konserter. I løpet av et semester dukker det opp mange artige
          arrangementer som er verdt å få med seg på{' '}
          <Link href="https://driv.no/" isExternal>
            nettsiden deres.
          </Link>{' '}
          Blant annet pleier Fri Flyt Film Tour å arrangeres på DRIV på høsten
          for de som er interessert i ski.
        </FAQItem>
        <FAQItem Q="Finnes det et idrettslag for studenter i Tromsø?">
          Ja, TSI er idrettslaget for alle studenter ved UiT. Det finnes grupper
          for de fleste idrettene du kan tenke deg, og dersom den ikke allerede
          fins har du deres velsignelse til å starte opp en gruppe. Sjekk ut{' '}
          <Link href="https://tsidrett.no/" isExternal>
            nettsiden deres her.
          </Link>
        </FAQItem>
        <FAQItem Q="Hva er Rakettnatt?">
          Rakettnatt er en musikkfestival som pleier å gå av stabelen i Tromsø
          sentrum i slutten av August. Festivalen varer en helg og stiller med
          både små og store navn hva angår artister. Hvis du høres dette høres
          spennende ut kan det være lurt å sikre seg en billett på{' '}
          <Link href="https://www.rakettnatt.no/" isExternal>
            rakettnatt.no
          </Link>{' '}
          så fort som mulig.
        </FAQItem>
      </Accordion>
    </>
  );
};

export default FAQ;

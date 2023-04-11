import './aboutTD.scss';
import logo from 'assets/td-full-logo.png';
import useTitle from 'hooks/useTitle';
import Footer from 'components/molecules/footer/Footer';

interface IBoardPost {
  position:
    | 'Leder'
    | 'Nest leder'
    | 'Arrangementsansvarlig'
    | 'Kommunikasjonsansvarlig'
    | 'Nettsideansvarlig'
    | 'Tekniskansvarlig'
    | 'Økonomiskansvarlig';
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
    <div className="post">
      <p>{position}</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          justifyContent: 'center',
        }}>
        <p> {stringRepr} </p>
      </div>
      {mail.map((m, i) => (
        <a
          href={`mailto:${mail}`}
          key={i}
          style={{ marginBottom: i === mail.length - 1 ? '.5rem' : '0rem' }}>
          {m}
        </a>
      ))}
    </div>
  );
};

interface ICommitte {
  name:
    | 'Arrangementkomite'
    | 'Bedriftskomite'
    | 'Nettsidekomite'
    | 'TD på tapp'
    | 'UiT Hack';
}

const Committe: React.FC<ICommitte> = ({ name, children }) => {
  // committee description is passed as children
  return (
    <div className="committee">
      <h4> {name} </h4>
      {children}
    </div>
  );
};

const TDcommittees: React.FC = () => {
  return (
    <div className="committeeWrapper">
      <Committe name="Arrangementkomite">
        <p>
          {' '}
          Arrangementskomiteen jobber med å lage forskjellige arrangementer, alt
          fra fester og skiturer til musikkbingo. Er dette noe som høres
          spennende ut ta kontakt med oss på{' '}
          <a href="mailto:arrangementsansvarlig@td-uit.no">mail</a>
        </p>
      </Committe>

      <Committe name="Bedriftskomite">
        <p>
          Bedriftskomiteen jobber med å kontakte bedrifter og sette opp
          bedriftsarrangementer i regi av TD. Lyst til å høre mer om dette ta
          kontakt med{' '}
          <a href="mailto:bedriftskommunikasjon@td-uit.no">
            bedriftskommunikasjons ansvarlig
          </a>
        </p>
      </Committe>
      <Committe name="Nettsidekomite">
        <p>
          {' '}
          Lyst til å lære frontend og backend utvikling eller bare har lyst til
          å legge til noen features. Ta{' '}
          <a href="mailto:nettside-ansvarlig@td-uit.no">kontakt</a> eller sjekk
          ut githuben vår for{' '}
          <a href="https://github.com/td-org-uit-no/tdctl-frontend">frontend</a>{' '}
          og <a href="https://github.com/td-org-uit-no/tdctl-api">backend </a>
        </p>
      </Committe>
      <Committe name="TD på tapp">
        <p>
          {' '}
          TD på tapp er TD sin ølbryggings komite. Her brygges det øl til
          forskjellige anledninger. Er du interessert i ølbrygging eller har
          lyst til å bli med? send oss en{' '}
          <a href="mailto:studentkommunikasjon@td-uit.no">mail</a>
        </p>
      </Committe>
      <Committe name="UiT Hack">
        <p>
          TD arrangerer årlig sin egen CTF kalt{' '}
          <a href="https://uithack.no/">UiTHack</a> og vi trenger folk til å
          være med på å lage forskjellige oppgaver. Er du interessert i hacking
          og CTF ta kontakt med{' '}
          <a href="mailto:studentkommunikasjon@td-uit.no">teknisk</a>
        </p>
      </Committe>
    </div>
  );
};

const TDBoardContactInfo: React.FC = () => {
  return (
    <div className="styret">
      <TDBoardPost
        position="Leder"
        members={['Fredrik Mørstad']}
        mail={['leder@td-uit.no']}
      />
      <TDBoardPost
        position="Nest leder"
        members={['Joachim Thomassen']}
        mail={['nestleder@td-uit.no']}
      />
      <TDBoardPost
        position="Arrangementsansvarlig"
        members={['Elias Riise', 'Iris Amundsen']}
        mail={['arrangementsansvarlig@td-uit.no']}
      />
      <TDBoardPost
        position="Kommunikasjonsansvarlig"
        members={['Dorthe Dybwad', 'Hauk Storjord']}
        mail={[
          'studentkommunikasjon@td-uit.no',
          'bedriftskommunikasjon@td-uit.no',
        ]}
      />
      <TDBoardPost
        position="Nettsideansvarlig"
        members={['Vetle Woie']}
        mail={['nettside-ansvarlig@td-uit.no']}
      />
      <TDBoardPost
        position="Tekniskansvarlig"
        members={['Finn Olav Sagen', 'Marius Ingebrigtsen']}
        mail={['teknisk@td-uit.no']}
      />
      <TDBoardPost
        position="Økonomiskansvarlig"
        members={['Ragnhild Grape']}
        mail={['økonomi@td-uit.no']}
      />
    </div>
  );
};

const AboutTD: React.FC = () => {
  useTitle('Om oss');
  return (
    <div className="aboutUsContainer">
      <img src={logo} alt="" />
      <div className="aboutSection">
        <div className="infoSection">
          <h2> Om oss </h2>
          <div className="textSection">
            Hei og velkommen til infosiden til TD. Her kan du finne litt
            informasjon om TD samt hvordan du kan nå oss!{' '}
            <div>
              <h4>Hvem er TD?</h4>
              <p>
                Tromsøstudentenes dataforening er linjeforeningen for alle
                informatikk studenter på UiT. Vi består av både bachelor og
                masterstudenter spredt over 4 spesialiserings linjer:{' '}
                <i>
                  datamaskinsystemer, cybersikkerhet, helseteknologi og Kunstig
                  intelligens{' '}
                </i>
              </p>
            </div>
            <div>
              <h4>Hva gjør TD?</h4>
              <p>
                TD jobber for å gjøre studietiden til våre studenter best mulig.
                Dette gjør vi gjennom arrangere faglige og sosiale arrangement
                for å bygge sosiale nettverk på tvers av kull og linjer.
                Samtidig jobber TD med å være et bindeledd mellom våre medlemmer
                og næringslivet.
              </p>
            </div>
          </div>
          <div className="organization">
            <h2> TD som organisasjon </h2>
            <h3> TD styret</h3>
            <TDBoardContactInfo />
            <h3> Komiteer </h3>
            <TDcommittees />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutTD;

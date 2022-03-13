import React from 'react';
import styles from './aboutPage.module.scss';
import logo from 'assets/td-logo.png';


const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutpage}>
        <h3>Tromsøstudentenes Dataforening</h3>
        <h4>Hvem er vi?</h4>
        <p>Vi er linjeforeningen for alle som studerer informatikk på UiT. </p>
        <p>Tromsøstudentenes Dataforening - TD er bygget på en visjon om å bedre miljøet til studentene innenfor informatikk her i Nordens Paris.</p> 
        <p>Linjeforeningen holder jevnlig arrangementer for å skape en positiv sosial og faglig atmosfære. 
          Vårt formål er å styrke det sosiale samholdet og bidra til økt faglig kunnskap i et felt i stadig utvikling. 
          TD er bindeleddet mellom deg som student og næringslivet, der vi bringer dere sammen gjennom bedriftspresentasjoner og workshoper. 
          Tromsøstudentenes Dataforening ønsker alle nye informatikk studenter velkommen!  
        </p>
    </div>
  );
};

export default AboutPage;
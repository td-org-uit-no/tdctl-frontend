import React from 'react';
import styles from './footer.module.scss';
import { Link } from 'react-router-dom';
import FooterLogos from './footerLogos/FooterLogos';

interface FooterListProps {
  header: string;
}

const FooterList: React.FC<FooterListProps> = ({ header, children }) => {
  return (
    <div className={styles.footerListContainer}>
      <div className={styles.listWrapper}>
        <h5> {header} </h5>
        {children}
      </div>
    </div>
  );
};

interface FooterItemProps {
  label: string;
  path: string;
  header?: string;
}

const FooterItem: React.FC<FooterItemProps> = ({ label, path, header }) => {
  return (
    <div className={styles.footerItemContainer}>
      {header !== undefined && <p>{header}</p>}
      <li className={styles.footerItem}>
        <Link to={path}>{label}</Link>
      </li>
    </div>
  );
};

// TODO add relevant paths
const Footer: React.FC = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerWrapper}>
        <FooterList header={'Om oss'}>
          <FooterItem label={'Om TD'} path={'/about-us'} />
          <FooterItem label={'Kontakt oss'} path={''} />
          <FooterItem label={'For nye studenter'} path={''} />
        </FooterList>
        <FooterList header={'Ressurser'}>
          <FooterItem label={'For bedrifter'} path={''} />
          <FooterItem label={'Stillingsutlysninger'} path={'/jobs'} />
        </FooterList>
        <FooterList header={`Kontaktinformasjon`}>
          <FooterItem header={'Leder'} label={'leder@td-uit.no'} path={''} />
          <FooterItem
            header={'Økonimiansvarlig'}
            label={'okonomi@td-uit.no'}
            path={''}
          />
          <FooterItem header={'Post'} label={'Post@td-uit.no'} path={''} />
        </FooterList>
      </div>
      <FooterLogos />
    </div>
  );
};

export default Footer;

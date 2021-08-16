import styles from './footerLogos.module.scss';
import { FaFacebook } from 'react-icons/fa';
import { AiFillGithub } from 'react-icons/ai';
import { Icon } from '@iconify/react';

const FooterLogos = () => {
  return (
    <div className={styles.logosContainer}>
      <div className={styles.logosWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.logoItem}>
            <Icon
              icon="akar-icons:instagram-fill"
              width={'2.5em'}
              height={'2.5em'}
              color={"#F8D2CC"}
            />
          </div>
          <div className={styles.logoItem}>
            <AiFillGithub size={'2.5em'} color={'#F8D2CC'} />
          </div>
          <div className={styles.logoItem}>
            <Icon
              icon="simple-icons:discord"
              width={'2.5em'}
              height={'2.5em'}
              color={"#F8D2CC"}
            />
          </div>
          <div className={styles.logoItem}>
            <FaFacebook size={'2.5em'} color={'#F8D2CC'} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FooterLogos;

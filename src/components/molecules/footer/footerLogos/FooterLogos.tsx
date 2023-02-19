import styles from './footerLogos.module.scss';
import { FaFacebook } from 'react-icons/fa';
import { AiFillGithub } from 'react-icons/ai';
import { Icon } from '@iconify/react';
import Modal from 'components/molecules/modal/Modal';
import discordInvite from 'assets/IFI-discord-invite.png';
import useModal from 'hooks/useModal';

const FooterLogos = () => {
  const { isOpen, onOpen, onClose } = useModal();
  return (
    <div className={styles.logosContainer}>
      <div className={styles.logosWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.logoItem}>
            <Icon
              icon="akar-icons:instagram-fill"
              href="https::/google.com"
              onClick={() => {
                window.open('https://www.instagram.com/td.uit/', '_blank');
              }}
              width={'2.5em'}
              height={'2.5em'}
              color={'#F8D2CC'}
            />
          </div>
          <div className={styles.logoItem}>
            <AiFillGithub
              size={'2.5em'}
              color={'#F8D2CC'}
              onClick={() => {
                window.open('https://github.com/td-org-uit-no', '_blank');
              }}
            />
          </div>
          <div className={styles.logoItem}>
            <Icon
              icon="simple-icons:discord"
              width={'2.5em'}
              height={'2.5em'}
              color={'#F8D2CC'}
              onClick={onOpen}
            />
            <Modal
              title="Invitasjon til vår discord"
              isOpen={isOpen}
              onClose={onClose}
              minWidth={45}>
              <div>
                <img src={discordInvite} alt="Link to discord" />
              </div>
            </Modal>
          </div>
          <div className={styles.logoItem}>
            <FaFacebook
              size={'2.5em'}
              color={'#F8D2CC'}
              onClick={() => {
                window.open(
                  'https://www.facebook.com/tromsodataforening',
                  '_blank'
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FooterLogos;

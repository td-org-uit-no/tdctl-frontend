import useTitle from 'hooks/useTitle';
import HomeHeader from 'components/molecules/HomePage/Header/HomeHeader';
import Footer from 'components/molecules/Footer/Footer';
import styles from './homePage.module.scss';

const RootPage = () => {
  useTitle('Tromsøstudentenes-Dataforening');

  return (
    <div className={styles.root} >
      <HomeHeader />
      <Footer />
    </div>
  );
};

export default RootPage;

import AppContainer from '../components/common/AppContainer';
import '../assets/scss/styles.scss';

// eslint-disable-next-line react/prop-types
export default function App({ Component, pageProps }) {
  return (
    <AppContainer>
      <Component {...pageProps} />
    </AppContainer>
  );
}

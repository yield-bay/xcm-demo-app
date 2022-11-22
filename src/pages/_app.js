import React, { useEffect } from 'react';
import App from 'next/app';
import PropTypes from 'prop-types';
import 'moment/locale/zh-tw';

import Layout from '../components/Layout';
import { GlobalProvider } from '../context/GlobalContext';
import nexti18N from '../../i18n';
import config from '../config';

import '../assets/fonts/fontawesome-5/webfonts/fa-brands-400.ttf';
import '../assets/fonts/fontawesome-5/webfonts/fa-regular-400.ttf';
import '../assets/fonts/fontawesome-5/webfonts/fa-solid-900.ttf';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '../scss/styles.scss';

const { appWithTranslation } = nexti18N;

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <Layout pageContext={{}}>
        <Component {...pageProps} />
      </Layout>
    </GlobalProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

MyApp.getInitialProps = async (appContext) => ({ ...await App.getInitialProps(appContext) });

export default appWithTranslation(MyApp);

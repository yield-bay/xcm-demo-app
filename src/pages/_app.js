import React from 'react';
import App from 'next/app';
import PropTypes from 'prop-types';
import 'moment/locale/zh-tw';
import {
  ConfigProvider,
} from 'antd';
import localFont from '@next/font/local';
import Layout from '../components/Layout';
import { GlobalProvider } from '../context/GlobalContext';
import nexti18N from '../../i18n';
import '../scss/styles.scss';

const myFont = localFont({
  src: [
    {
      path: '../assets/fonts/GT_Walsheim_Pro/GTWalsheimPro-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/GT_Walsheim_Pro/GTWalsheimPro-Regular.ttf',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../assets/fonts/GT_Walsheim_Pro/GTWalsheimPro-Bold.ttf',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../assets/fonts/GT_Walsheim_Pro/GTWalsheimPro-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
});

const { appWithTranslation } = nexti18N;

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'rgb(122, 234, 215)',
            colorTextBase: 'white',
            colorBgBase: 'black',
            radiusBase: 3,
            colorBorder: 'grey',
            // colorPrimaryActive: 'transparent',
            colorBorderSecondary: 'grey',
          },
        }}
      >
        <Layout pageContext={{}} className={myFont.className}>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </GlobalProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

MyApp.getInitialProps = async (appContext) => ({ ...await App.getInitialProps(appContext) });

export default appWithTranslation(MyApp);

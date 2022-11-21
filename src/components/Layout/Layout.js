import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import AOS from 'aos';
import _, { get, merge } from 'lodash';
import { useRouter } from 'next/router';

import config from '../../config';
// import Header from '../Header';
// import Footer from '../Oak/Footer';

import GlobalContext, { SCREEN_WIDTH_MODE } from '../../context/GlobalContext';

import GlobalStyle from '../../utils/globalStyle';

// the full theme object
import { theme as baseTheme } from '../../utils';

const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 9999999999;
  opacity: 1;
  visibility: visible;
  transition: all 1s ease-out 0.5s;
  &.inActive {
    opacity: 0;
    visibility: hidden;
  }
`;

const SiteWrapper = styled.div`
  position: relative;
  overflow: hidden !important;
  background-color: ${(props) => (props.isDark ? '#1F1F24' : '#FCFCFC')};
`;

// options for different color modes
const modes = { light: 'light', dark: 'dark' };

// merge the color mode with the base theme
// to create a new theme object
const getTheme = (mode) => merge({}, baseTheme, {
  colors: get(baseTheme.colors.modes, mode, baseTheme.colors),
});

const screenWidthModes = [
  {
    mode: SCREEN_WIDTH_MODE.XS,
    min: 0,
  },
  {
    mode: SCREEN_WIDTH_MODE.SM,
    min: 576,
  },
  {
    mode: SCREEN_WIDTH_MODE.MD,
    min: 768,
  },
  {
    mode: SCREEN_WIDTH_MODE.LG,
    min: 992,
  },
  {
    mode: SCREEN_WIDTH_MODE.XL,
    min: 1200,
  },
  {
    mode: SCREEN_WIDTH_MODE.XXL,
    min: 1400,
  },
];

function Layout({ children }) {
  const gContext = useContext(GlobalContext);
  const { setIsMobile, setScreenWidthMode } = gContext;

  const [visibleLoader, setVisibleLoader] = useState(true);

  const router = useRouter();
  const pathname = router && router.pathname;

  const redirectUrl = config?.routingConfig[pathname]?.redirectUrl;
  const isRedirect = !_.isEmpty(redirectUrl);

  useEffect(() => {
    AOS.init({ once: true });
    setVisibleLoader(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 620);
      const foundScreen = _.findLast(screenWidthModes, (mode) => window.innerWidth >= mode.min);
      setScreenWidthMode(foundScreen.mode);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
  }, [setIsMobile, setScreenWidthMode]);

  // Navbar style based on scroll
  const eleRef = useRef();

  useEffect(() => {
    window.addEventListener(
      'popstate',
      () => {
        // The popstate event is fired each time when the current history entry changes.
        gContext.closeOffCanvas();
      },
      false,
    );
    window.addEventListener(
      'pushState',
      () => {
        // The pushstate event is fired each time when the current history entry changes.
        gContext.closeOffCanvas();
      },
      false,
    );
  }, [gContext]);

  const headers = (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab. svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      { isRedirect && (<meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />) }
    </Head>
  );

  return (
    <ThemeProvider
      theme={
        gContext.themeDark ? getTheme(modes.dark) : getTheme(modes.light)
      }
    >
      <div data-theme-mode-panel-active data-theme={gContext.themeDark ? 'dark' : 'light'}>
        <GlobalStyle />
        {headers}
        { !isRedirect && (
          <>
            <Loader id="loading" className={visibleLoader ? '' : 'inActive'} />
            <SiteWrapper isDark={gContext.themeDark} ref={eleRef}>
              {children}
            </SiteWrapper>
          </>
        ) }

      </div>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import GlobalContext from '../../context/GlobalContext';
import config from '../../config';
import pngLogo from '../../assets/image/logo.png';
import pngLogoTuring from '../../assets/image/logo-turing.png';

const { routingConfig } = config;

const headerConfigDefault = {
  theme: 'light',
  variant: 'primary',
  align: 'left',
  isFluid: false,
  button: 'cta', // trial, cart, cta, account, null
  buttonText: 'Get started free', // trial, cart, cta, account, null
};

/**
 * Get the page view title from config based on the URL path
 * @param {string} path The URL patch such as "/", or "/team"
 */
const getPageTileFromPath = (path) => {
  const defaultValue = routingConfig['/'] && routingConfig['/'].title;

  return (routingConfig[path] && routingConfig[path].title) || defaultValue;
};
/**
 * Get the logo used in <meta> for SEO based on the URL path
 * @param {string} path The URL patch such as "/", or "/team"
 */
const getSEOLogoFromPath = (path) => {
  let value = pngLogo;

  if (_.startsWith(path, '/turing')) {
    value = pngLogoTuring;
  }

  return value;
};

/**
 * Return the isDark boolean configured in src/config.js based on the current page URL
 * If isDark is true, the entire webpage will have a dark background; otherwise white background
 * @param {*} path
 * @returns
 */
const isDarkThemeFromPath = (path) => {
  const defaultValue = routingConfig['/'] && routingConfig['/'].isDark;

  const result = routingConfig[path] && routingConfig[path].isDark;
  if (_.isUndefined(result)) {
    return defaultValue;
  }

  return result;
};

function PageWrapper({
  children,
  headerConfig,
}) {
  const {
    setHeader, setThemeDark, setShowScrolling, setShowReveal,
  } = useContext(GlobalContext);

  const router = useRouter();
  const pathname = router && router.pathname;
  const pageViewTitle = getPageTileFromPath(pathname);
  const ogLogo = getSEOLogoFromPath(pathname);

  // Determine whether to use dark or light background based on the routing config from src/config.js
  const isDark = isDarkThemeFromPath(pathname);

  useScrollPosition(({ currPos }) => setShowScrolling(currPos.y < 0));

  useEffect(() => {
    setShowReveal(!isDark);
    return () => setShowReveal(false);
  }, [setShowReveal, isDark]);

  useEffect(() => {
    if (isDark) {
      setHeader({
        ...headerConfigDefault,
        ...headerConfig,
        theme: 'dark',
      });
    } else {
      setHeader({ ...headerConfigDefault, ...headerConfig, theme: 'light' });
    }
    setThemeDark(isDark);
  }, [setHeader, setThemeDark, headerConfig, isDark]);

  return (
    <>
      <Head>
        <title>{pageViewTitle}</title>
        <meta property="og:title" content={pageViewTitle} key={pathname} />
        <meta property="og:description" content="The Web 3.0 Hub for Automated DeFi and Payments" />
        <meta property="og:image" content={ogLogo} />
      </Head>
      {children}
    </>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  headerConfig: PropTypes.shape({}),
};

PageWrapper.defaultProps = {
  children: undefined,
  headerConfig: undefined,
};

export default PageWrapper;

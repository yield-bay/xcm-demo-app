const path = require('path');
const NextI18Next = require('next-i18next').default;

const { getLanguageFromCookie, setLanguageToCookie } = require('./src/utils/cookieHelper');

const DEFAULT_LANGUAGE = 'en';

const getBrowserLanguage = () => {
  if (typeof navigator !== 'undefined') {
    return navigator.language;
  }
  return null;
};

/**
 * Detect language
 * First take the language from the cookie, if not, take the browser language.
 * @returns
 */
const detectLanguage = () => {
  const browserLanguage = getBrowserLanguage();
  // The program will use the custom `language` value in the cookie instead of `next-i18next` value set in the cookie by next-i18next.
  // Because this value will be cleared after refreshing the web page in the production environment.
  const cookieLanguage = getLanguageFromCookie();
  return cookieLanguage || browserLanguage || DEFAULT_LANGUAGE;
};

// Customize a language detector to fix the problem that the next-i18next language cannot get the language after `next export`.
const customLanguageDetector = {
  name: 'custom-language-detector',
  lookup: detectLanguage,
};

const next18N = new NextI18Next({
  defaultLanguage: DEFAULT_LANGUAGE,
  debug: false,
  otherLanguages: ['zh-CN', 'es'],
  localePath: path.resolve('./public/static/locales'),
  fallbackLng: 'en',
  customDetectors: [customLanguageDetector],
  detection: {
    order: ['custom-language-detector'],
  },
});

/**
 * Set language
 * Please do not use i18n.changeLanguage directly.
 * @param {*} language
 */
const setLanguage = async (language) => {
  await next18N.i18n.changeLanguage(language);
  setLanguageToCookie(next18N.i18n.language);
};

next18N.setLanguage = setLanguage;

module.exports = next18N;

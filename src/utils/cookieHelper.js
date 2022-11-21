const LANG_KEY = 'language';

export const setCookie = (key, value) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${key}=${value};SameSite=Strict`;
  }
};

export const getCookie = (key) => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
    if (match) return match[2];
  }
  return null;
};

export const setLanguageToCookie = (value) => setCookie(LANG_KEY, value);

export const getLanguageFromCookie = () => getCookie(LANG_KEY);

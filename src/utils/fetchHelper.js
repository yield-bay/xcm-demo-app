/* eslint-disable import/prefer-default-export */
import FetchError from './errors/FetchError';

const fetchUrl = async (url, ...args) => {
  try {
    const response = await fetch(url, ...args);
    if (!response.ok) {
      throw new Error();
    }
    return response;
  } catch (error) {
    throw new FetchError(url);
  }
};

export {
  fetchUrl,
};

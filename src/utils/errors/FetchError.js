class FetchError extends Error {
  constructor(url) {
    super(`FetchError, url: ${url}`);
    this.name = 'FetchError';
    this.url = url;
  }
}

export default FetchError;

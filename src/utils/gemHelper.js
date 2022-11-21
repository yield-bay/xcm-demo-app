import appConfig from '../config';

const { src } = appConfig.gem;

class GemHelper {
  constructor() {
    this.isInitialized = false;
  }

  initialize() {
    if (!this.isInitialized) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
      this.isInitialized = true;
    }
  }
}

export default new GemHelper();

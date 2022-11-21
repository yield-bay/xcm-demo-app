import { stringToHex } from '@polkadot/util';
import { logDebug } from './log';

class PolkadotExtensionHelper {
  constructor() {
    this.initialized = false;
    this.api = null;
    this.extension = null;
  }

  initialize = async () => {
    if (this.initialized) {
      return;
    }
    this.extension = await import('@polkadot/extension-dapp');
    this.extension.web3Enable('oak-website');
    logDebug('polkadotExtensionHelper is initialized!');
    this.initialized = true;
  };

  getExtension = () => {
    if (!this.initialized) {
      throw Error('polkadotExtensionHelper has not been initialized yet.');
    }
    return this.extension;
  };

  sign = async (message, address) => {
    const { web3FromAddress } = this.getExtension();
    const injector = await web3FromAddress(address);
    const signRaw = injector?.signer?.signRaw;
    const { signature } = await signRaw({
      address,
      data: stringToHex(message),
      type: 'bytes',
    });
    return signature;
  };
}

export default new PolkadotExtensionHelper();

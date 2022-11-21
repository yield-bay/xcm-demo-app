import { WsProvider, ApiPromise, Keyring } from '@polkadot/api';
import BN from 'bn.js';
import { BN_HUNDRED } from '@polkadot/util';

import config from '../config';
import { logDebug } from './log';

const {
  crowdloan: {
    bifrost: {
      endpoint, parachainId, explorer,
    },
  },
  dotCrowdloan: {
    bifrost: {
      endpoint: dotEndpoint,
      parachainId: dotParachainId,
      explorer: dotExplorer,
    }
  }
} = config;

class BifrostHelper {
  constructor(bifrostEndpoint = endpoint, bifrostExplorer = explorer, bifrostParachainId = parachainId) {
    this.initialized = false;
    this.api = null;
    this.extension = null;
    this.relayHelper = null;
    this.parachainId = bifrostParachainId;
    this.explorer = bifrostExplorer;
    this.endpoint = bifrostEndpoint
  }

  initialize = async () => {
    if (this.initialized) {
      return;
    }
    const wsProvider = new WsProvider(this.endpoint);
    this.api = await ApiPromise.create({ provider: wsProvider });
    logDebug('BifrostHelper is initialized!');
    this.initialized = true;
  };

  getApi = () => {
    if (!this.initialized) {
      throw Error('BifrostHelper has not been initialized yet.');
    }

    return this.api;
  };

  getAddress = (otherFormatAddress) => {
    const keyring = new Keyring();
    const pubKey = keyring.decodeAddress(otherFormatAddress);
    const bifrostAddress = keyring.encodeAddress(pubKey, this.getSS58Prefix());
    return bifrostAddress;
  };

  getExistentialDeposit = () => this.getApi().consts.balances.existentialDeposit;

  /**
   * Get explorer url
   * Polkadot apps cannot query the extrinsic hash, but subscan can.
   * Returns the extrinsic hash url if NEXT_PUBLIC_BIFROST_SUBSCAN is set, otherwise returns the block hash url.
   * @param {object} {blockHash, extrinsicHash}
   * @returns url
   */
  getExplorerUrl = ({ blockHash, extrinsicHash }) => (process.env.NEXT_PUBLIC_BIFROST_SUBSCAN ? this.getExtrinsicUrl(extrinsicHash) : this.getBlockUrl(blockHash));

  getBlockUrl = (hash) => {
    const { baseUrl, query } = this.explorer;
    return baseUrl + query + hash;
  };

  getExtrinsicUrl = (hash) => {
    const { baseUrl, extrinsicQuery } = this.explorer;
    return baseUrl + extrinsicQuery + hash;
  };

  getChainName = () => this.chainName;

  getSS58Prefix = () => this.getApi().registry.chainSS58;

  getParachainId = () => this.parachainId;

  makeContributeExtrinsic = (fundAmount) => this.getApi().tx.salp.contribute(this.parachainId, fundAmount);

  /**
   * Get exchanged Xtoken fee for contribution
   * If the user has enough BNC, only BNC is consumed. If the user does not have BNC, they need to exchange Xtoken as a handling fee.
   * Refers to: https://github.com/bifrost-finance/bifrost/blob/d7bc68509d4b59d7a794f6267f9f135fafded320/pallets/flexible-fee/src/lib.rs#L188
   * @param {*} contributionAmount, contribution Amount with Plank(u128).
   * @returns fee
   */
  getExchangedXtokenFeeForContribution = async (extrinsic, address) => {
    const { data: { free: bncBalance } } = await this.getApi().query.system.account(address);
    const existentialDeposit = this.getExistentialDeposit();

    // Refer to the code of polkadot.js apps
    // https://github.com/polkadot-js/apps/blob/ce879db4e5024c87ae00520d0e0f50e78c6ed88d/packages/page-accounts/src/modals/Transfer.tsx#L68
    const { partialFee } = await extrinsic.paymentInfo(address);
    const adjFee = partialFee.muln(110).div(BN_HUNDRED);

    // Keep account alive.
    const nativeFee = adjFee.add(existentialDeposit);

    // If BNC is enough, use BNC.
    if (bncBalance.gte(nativeFee)) {
      return new BN(0);
    }

    // If bncBalance is greater than existentialDeposit, just exchange adjFee.
    const exchangeBNC = bncBalance.gte(existentialDeposit) ? adjFee : nativeFee;

    // https://github.com/bifrost-finance/bifrost/blob/e0142e611c03fc0a3a2cd26f477342959160a922/pallets/flexible-fee/src/fee_dealer.rs#L81
    // Exchange rate, BNC -> KSM
    const [feeCurrencyBase, nativeCurrencyBase] = this.getApi().consts.flexibleFee.altFeeCurrencyExchangeRate;
    // Extra contribution fee
    const { contributionFee } = this.getApi().consts.xcmInterface;
    const exchangedFee = exchangeBNC.mul(feeCurrencyBase).div(nativeCurrencyBase).add(contributionFee);
    return exchangedFee;
  };
}

export const ksmBifrostHelper = new BifrostHelper();
export const dotBifrostHelper = new BifrostHelper(dotEndpoint, dotExplorer, dotParachainId);

import _ from 'lodash';
import { WsProvider, ApiPromise, Keyring } from '@polkadot/api';
import { hexToU8a, isHex, BN_HUNDRED } from '@polkadot/util';

import BN from 'bn.js';
import config from '../config';
import { formatNumberStrThousands, formatNumberThousands } from './helperFn';
import { logDebug } from './log';

const {
  crowdloan: {
    endpoint: defaultEndpoint,
    parachainId,
    chainName,
    minRewardContribution,
    ss58Prefix,
  },
  dotCrowdloan: {
    endpoint: dotEndpoint,
    parachainId: dotParaId,
    chainName: dotChainName,
    minRewardContribution: dotMinRewardContribution,
    ss58Prefix: dotss58Prefix,
  },
  explorer,
  dotExplorer,
} = config;

const { decodeAddress, encodeAddress } = new Keyring();

/**
 * Get extrinsic fee
 * @param {*} contributionAmount, contribution Amount with Plank(u128).
 * @returns fee
 */
export const getExtrinsicFee = async (extrinsic, address) => {
  // Refer to the code of polkadot.js apps
  // https://github.com/polkadot-js/apps/blob/ce879db4e5024c87ae00520d0e0f50e78c6ed88d/packages/page-accounts/src/modals/Transfer.tsx#L68
  const { partialFee } = await extrinsic.paymentInfo(address);
  const adjFee = partialFee.muln(110).div(BN_HUNDRED);
  return adjFee;
};

class PolkadotHelper {
  constructor(
    endpoint = defaultEndpoint,
    paraID = parachainId,
    relayName = chainName,
    subscan = explorer,
    minContribution = minRewardContribution,
    defaultss58Prefix = ss58Prefix,
    tokenUnit = 'KSM'
  ) {
    this.initialized = false;
    this.api = null;
    this.extension = null;
    this.endpoint = endpoint;
    this.parachainId = paraID;
    this.chainName = relayName;
    this.explorer = subscan;
    this.minContribution = minContribution;
    this.ss58Prefix = defaultss58Prefix;
    this.tokenUnit = tokenUnit;
  }

  initialize = async () => {
    if (this.initialized) {
      return;
    }
    const wsProvider = new WsProvider(this.endpoint);
    this.api = await ApiPromise.create({ provider: wsProvider });
    logDebug('PolkadotHelper is initialized!');
    this.initialized = true;
  };

  getApi = () => {
    if (!this.initialized) {
      throw Error('PolkadotHelper has not been initialized yet.');
    }

    return this.api;
  };

  /**
   * Get explorer url
   * Polkadot apps cannot query the extrinsic hash, but subscan can.
   * Returns the extrinsic hash url if NEXT_PUBLIC_RELAYCHAIN_SUBSCAN is set, otherwise returns the block hash url.
   * @param {object} {blockHash, extrinsicHash}
   * @returns url
   */
  getExplorerUrl = ({ blockHash, extrinsicHash }) => (process.env.NEXT_PUBLIC_DOT_RELAYCHAIN_SUBSCAN ? this.getExtrinsicUrl(extrinsicHash) : this.getBlockUrl(blockHash));

  getAmountText = (number) => {
    const amount = _.isNumber(number) && !_.isNaN(number) ? number : 0;
    return `${formatNumberThousands(Number(this.planckToUnit(amount).toFixed(4)) / 1)} ${this.getUnit()}`;
  };

  getUnitText = (value, precision = 4, unit = null) => {
    const number = _.isNumber(value) && !_.isNaN(value) ? value : 0;
    return `${formatNumberThousands(Number(number.toFixed(precision)) / 1)} ${unit || this.getUnit()}`;
  };

  getMinContribution = () => this.getApi().consts.crowdloan.minContribution.toNumber();

  getMinRewardContribution = () => this.unitToPlanck(this.minContribution);

  getBlockUrl = (hash) => {
    const { baseUrl, query } = this.explorer;
    return hash ? baseUrl + query + hash : null;
  };

  getExtrinsicUrl = (hash) => {
    const { baseUrl, extrinsicQuery } = this.explorer;
    return baseUrl + extrinsicQuery + hash;
  };

  getParachainId = () => this.parachainId;

  getChainName = () => this.chainName;

  getDecimals = () => (this.initialized ? this.getApi().registry.chainDecimals[0] : 10);

  getUnit = () => (this.initialized ? this.getApi().registry.chainTokens[0] : this.tokenUnit);

  /**
   * Get ss58 prefix
   * If the API is initialized, the ss58 on the API is read by default.
   * If it is not initialized, the ss58 is read from config.js.
   * @returns ss58 prefix
   */
  getSS58Prefix = () => (this.initialized ? this.getApi().registry.chainSS58 : this.ss58Prefix);

  getExistentialDeposit = () => this.getApi().consts.balances.existentialDeposit;

  planckToUnit = (planck) => planck / (10 ** this.getDecimals());

  unitToPlanck = (unit) => unit * (10 ** this.getDecimals());

  makeReserveTransferAssetsExtrinsic = (dest, beneficiary, assets, feeAssetItem) => this.getApi().tx.xcmPallet.reserveTransferAssets(dest, beneficiary, assets, feeAssetItem);

  makeStandardContributeExtrinsic = (planck) => this.getApi().tx.crowdloan.contribute(this.parachainId, planck, null);

  unitToPlanckBN = (unit) => {
    const plancks = new BN(10).pow(new BN(this.getDecimals()));
    const num = Number(unit);
    const int = Math.floor(num);
    const intBN = new BN(int).mul(plancks);
    const decimalBN = new BN(this.unitToPlanck(num - int));
    return intBN.add(decimalBN);
  };

  /**
   * planck To Unit
   * @param {*} planck
   * @returns [integer, mod]
   */
  planckToUnitBN = (planck) => {
    const plancks = new BN(10).pow(new BN(this.getDecimals()));
    const int = new BN(planck).div(plancks);
    const mod = new BN(planck).mod(plancks);
    return [int, mod];
  };

  planckToUnitStr = (planck, fixed = this.getDecimals()) => {
    const [int, mod] = this.planckToUnitBN(planck);
    const decimal = mod.toNumber() / (10 ** this.getDecimals());
    let decimalStr = (Number(decimal.toFixed(fixed)) / 1).toString();
    decimalStr = decimalStr.substring(2, decimalStr.length);
    return _.isEmpty(decimalStr) ? int.toString() : `${int}.${decimalStr}`;
  };

  planckToFormatedUnitStr = (planck, fixed = this.getDecimals()) => {
    const str = this.planckToUnitStr(planck, fixed);
    return `${formatNumberStrThousands(str)} ${this.getUnit()}`;
  };

  getRemainingCrowdloanCapacity = async () => {
    try {
      const fundInfo = await this.getApi().query.crowdloan.funds(this.parachainId);
      const { cap, raised } = fundInfo.value;
      return cap.sub(raised);
    } catch (error) {
      logDebug('getRemainingCrowdloanCapacity, error: ', error);
      throw new Error('Failed to get crowdloan capacity.');
    }
  };

  isValidAddress = (address) => {
    // Refer to: https://polkadot.js.org/docs/util-crypto/examples/validate-address/
    try {
      let walletAddress = address;
      if (isHex(address)) {
        walletAddress = hexToU8a(address);
      }
      if (decodeAddress(walletAddress) && encodeAddress(walletAddress, this.getSS58Prefix())) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  getRelayWalletAddress = (address) => encodeAddress(address, this.getSS58Prefix());

  getContributionCap = async () => {
    const crowdloanInfo = await this.getApi().query.crowdloan.funds(this.parachainId);
    return this.planckToUnit(_.get(crowdloanInfo.toJSON(), 'cap') * 0.1);
  };
}

export const ksmHelper = new PolkadotHelper();
export const dotHelper = new PolkadotHelper(
  dotEndpoint,
  dotParaId,
  dotChainName,
  dotExplorer,
  dotMinRewardContribution,
  dotss58Prefix,
  'DOT'
);

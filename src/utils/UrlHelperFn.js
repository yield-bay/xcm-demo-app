import _ from 'lodash';
import config from '../config';
import { CONTRIBUTE_TYPE } from '../sections/crowdloan/contribution/ContributionHelper';
import { dotBifrostHelper, ksmBifrostHelper } from './bifrostHelper';
import { dotHelper, ksmHelper } from './polkadotHelper';

const { crowdloan: { parallel }, explorer, dotExplorer } = config;

export const getParallelExtrinsicUrl = (extrinsicHash) => {
  const { explorer: { baseUrl, extrinsicQuery } } = parallel;
  return `${baseUrl}${extrinsicQuery}${extrinsicHash}`;
};

export const getDotParallelExtrinsicUrl = (extrinsicHash) => {
  // TODO: extrinsic hash is not passed in and appended to this result, so we need to figure out what this function is trying to do.
  const { explorer: { baseUrl, extrinsicQuery } } = parallel;

  return `${baseUrl}${extrinsicQuery}${extrinsicHash}`;
};

export const getAccountUrl = (walletAddress) => {
  const { baseUrl, accountQuery } = explorer;
  return process.env.NEXT_PUBLIC_RELAYCHAIN_SUBSCAN ? `${baseUrl}${accountQuery}${walletAddress}` : null;
};

export const getOakAccountUrl = (walletAddress) => {
  const { baseUrl, accountQuery } = explorer;
  return process.env.NEXT_PUBLIC_DOT_RELAYCHAIN_SUBSCAN ? `${baseUrl}${accountQuery}${walletAddress}` : null;
};

export const getExtrinsicUrl = ({ contributionType, blockHash, extrinsicHash }) => {
  switch (_.upperCase(contributionType)) {
    case CONTRIBUTE_TYPE.STANDARD:
      return ksmHelper.getExplorerUrl({ blockHash, extrinsicHash });
    case CONTRIBUTE_TYPE.BIFROST:
      return ksmBifrostHelper.getExplorerUrl({ blockHash, extrinsicHash });
    case CONTRIBUTE_TYPE.PARALLEL:
      return getParallelExtrinsicUrl(extrinsicHash);
    default:
      return null;
  }
};

export const getDotExtrinsicUrl = ({ contributionType, blockHash, extrinsicHash }) => {
  switch (_.upperCase(contributionType)) {
    case CONTRIBUTE_TYPE.STANDARD:
      return dotHelper.getExplorerUrl({ blockHash, extrinsicHash });
    case CONTRIBUTE_TYPE.BIFROST:
      return dotBifrostHelper.getExplorerUrl({ blockHash, extrinsicHash });
    case CONTRIBUTE_TYPE.PARALLEL:
      return getDotParallelExtrinsicUrl(extrinsicHash);
    default:
      return null;
  }
};

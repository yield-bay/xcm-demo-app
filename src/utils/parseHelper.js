import _ from 'lodash';
import Parse from 'parse';
import { CONTRIBUTE_TYPE, EXTRINSIC_STATUS } from '../sections/crowdloan/contribution/ContributionHelper';

const ParseUser = Parse.Object.extend('User');
const ParseStandardContribution = Parse.Object.extend('Contribution');
const ParseBifrostContribution = Parse.Object.extend('BifrostContribution');
const ParseKSMTransfer = Parse.Object.extend('KSMTransfer');

const processParseError = (parseError, cloudFunc) => {
  const newParseError = parseError;
  newParseError.name = 'ParseError';
  newParseError.cloudFunc = cloudFunc;
  newParseError.description = `ParseError, cloudFunc: ${cloudFunc}, ${newParseError.message}`;
};

const parseCloudRun = async (cloudFunc, params) => {
  try {
    const result = await Parse.Cloud.run(cloudFunc, params);
    return result;
  } catch (error) {
    processParseError(error, cloudFunc);
    throw error;
  }
};

export const parseUserLogin = async (username, password, params) => {
  try {
    const user = await Parse.User.logIn(username, password, params);
    return user;
  } catch (error) {
    processParseError(error, 'logIn');
    throw error;
  }
};

export const parseUserSignup = async (user) => {
  try {
    await user.signUp();
  } catch (error) {
    processParseError(error, 'signUp');
    throw error;
  }
};

const parseQueryFirst = async (query) => {
  try {
    const result = await query.first();
    return result;
  } catch (error) {
    error.name = 'ParseError';
    processParseError(error, `queryFirst.${query.className}`);
    throw error;
  }
};

export const fetchSigninMessage = async (username) => parseCloudRun('getSigninMessage', { username });

export const signupForNewsletter = async (email) => parseCloudRun('signupForNewsletter', { email });

export const fetchUserInfoByEmail = async (email) => parseCloudRun('getUserInfoByEmail', { email });

export const approveTerms = async () => parseCloudRun('approveTerms');

export const standardContribute = async(params) => parseCloudRun('contribute', params);

export const bifrostContribute = async(params) => parseCloudRun('bifrostContribute', params);

export const checkReferralCode = async(params) => parseCloudRun('isReferralCodeValid', params);

export const fetchUserEstimates = async(params) => parseCloudRun('getUserEstimates', params);

export const fetchTopReconciledReferrals = async(params) => parseCloudRun('getTopReconciledReferrals', params);

export const fetchTopReferrals = async(params) => parseCloudRun('getTopReferrals', params);

export const fetchTopReconciledContributors = async(params) => parseCloudRun('getTopReconciledContributors', params);

export const fetchTopContributors = async(params) => parseCloudRun('getTopContributors', params);

export const fetchReconciledGlobalStatus = async (params) => parseCloudRun('getReconciledGlobalStatus', params);

export const fetchGlobalStatus = async (params) => parseCloudRun('getGlobalStatus', params);

export const fetchReconciledUserStatus = async (params) => parseCloudRun('getReconciledUserStatus', params);

export const fetchUserStatus = async (params) => parseCloudRun('getUserStatus', params);

export const fetchPromotionalMilestones = async (params) => parseCloudRun('getPromotionalMilestones', params);

export const sendKSMtoBifrost = async (params) => parseCloudRun('sendKSMtoBifrost', params);

export const getInvalidError = (invalid) => {
  if (!invalid) {
    return null;
  }
  return { name: 'Invalid extrinsic', message: invalid };
};

export const getDispathError = (parseDispatchError) => {
  if (!parseDispatchError) {
    return null;
  }
  const newParseDispatchError = _.isString(parseDispatchError) ? JSON.parse(parseDispatchError) : parseDispatchError;
  const { docs: [message], name } = newParseDispatchError;
  return { name, message };
};

export const getUser = (parseUser) => {
  if (!parseUser) {
    return null;
  }
  return {
    username: parseUser.get('username'),
    email: parseUser.get('email') || parseUser.get('username'),
    emailVerified: !_.isBoolean(parseUser.get('emailVerified')) || parseUser.get('emailVerified'),
  };
};

export const fetchUserByAddress = async (address) => {
  const query = new Parse.Query(ParseUser);
  query.equalTo('walletAddress', address);
  const userObj = await parseQueryFirst(query);
  const user = getUser(userObj);
  return user;
};

export const fetchUserByEmail = async (email) => {
  const query = new Parse.Query(ParseUser);
  query.equalTo('email', email);
  const userObj = await parseQueryFirst(query);
  const user = getUser(userObj);
  return user;
};

export const getContribution = (parseContribution) => {
  if (!parseContribution) {
    return null;
  }

  const status = parseContribution.get('status');
  let error = null;
  if (status === EXTRINSIC_STATUS.INVALID) {
    error = getInvalidError(parseContribution.get('invalid'));
  } else if (status === EXTRINSIC_STATUS.FINALIZED_WITH_ERROR) {
    error = getDispathError(parseContribution.get('dispatchError'));
  }

  return {
    amount: parseContribution.get('amount'),
    finalizedAt: parseContribution.get('finalized_at'),
    extrinsicHash: parseContribution.get('tx_hash'),
    blockHash: status === 'finalized' ? parseContribution.get('in_block') : parseContribution.get('finalized'),
    baseReward: parseContribution.get('base_reward') || 0,
    referralReward: parseContribution.get('referral') || 0,
    stage1Bonus: parseContribution.get('stage1') || 0,
    stage2Bonus: parseContribution.get('stage2') || 0,
    milestoneReward: parseContribution.get('milestoneReward') || 0,
    status,
    creator: parseContribution.get('creator'),
    error,
  };
};

export const getXTokenTransfer = (parseXTokenTransfer) => {
  if (!parseXTokenTransfer) {
    return null;
  }

  const status = parseXTokenTransfer.get('status');

  let error = null;
  if (status === EXTRINSIC_STATUS.INVALID) {
    error = getInvalidError(parseXTokenTransfer.get('invalid'));
  } else if (status === EXTRINSIC_STATUS.FINALIZED_WITH_ERROR) {
    error = getDispathError(parseXTokenTransfer.get('dispatchError'));
  }

  return {
    finalizedAt: parseXTokenTransfer.get('finalized_at'),
    extrinsicHash: parseXTokenTransfer.get('tx_hash'),
    blockHash: status === EXTRINSIC_STATUS.FINALIZED ? parseXTokenTransfer.get('in_block') : parseXTokenTransfer.get('finalized'),
    status,
    creator: parseXTokenTransfer.get('creator'),
    error,
  };
};

export const fetchContributionByExtrinsicHash = async (extrinsicHash, type) => {
  const ParseContribution = type === CONTRIBUTE_TYPE.STANDARD ? ParseStandardContribution : ParseBifrostContribution;
  const query = new Parse.Query(ParseContribution);
  query.equalTo('tx_hash', extrinsicHash);
  const contributionObj = await parseQueryFirst(query);
  const contribution = getContribution(contributionObj);
  return contribution;
};

export const fetchXTokenTransfer = async (extrinsicHash) => {
  const query = new Parse.Query(ParseKSMTransfer);
  query.equalTo('tx_hash', extrinsicHash);
  const transObj = await parseQueryFirst(query);
  return getXTokenTransfer(transObj);
};

import { numberToFixed, shortenAmount } from './helperFn';
import { oakParachainHelper } from './parachainHelper';
import { dotHelper } from './polkadotHelper';

export const formatAmountByScreen = (amountUnit = 0, isMobileMode = false) => {
  if (!isMobileMode) {
    return `${numberToFixed(amountUnit, 4)} ${dotHelper.getUnit()}`;
  }
  return shortenAmount(amountUnit, 2);
};

export const formatRewardByScreen = (rewardUnit = 0, isMobileMode = false) => {
  if (!isMobileMode) {
    return `${numberToFixed(rewardUnit, 2)} ${oakParachainHelper.getUnit()}`;
  }
  return shortenAmount(rewardUnit, 2);
};

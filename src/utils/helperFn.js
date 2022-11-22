import _ from 'lodash';
import { notification } from 'antd';

import nexti18N from '../../i18n';

const { i18n } = nexti18N;

export const titleCase = (str) => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i += 0) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};

/**
 * Formatting number string with thousand separator.
 * @param  {number} num e.g. 1000000.65
 * @return {string}   "1,000,000.65"
 */
export function formatNumberStrThousands(numStr) {
  if (_.isEmpty(numStr)) {
    return numStr;
  }

  const parts = numStr.split('.');

  const decimalStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const period = _.isUndefined(parts[1]) ? '' : '.';
  const floatStr = _.isUndefined(parts[1]) ? '' : parts[1];

  return `${decimalStr}${period}${floatStr}`;
}

/**
 * Formatting number with thousand separator.
 * @param  {number} num e.g. 1000000.65
 * @return {string}   "1,000,000.65"
 */
export function formatNumberThousands(num) {
  if (_.isUndefined(num)) {
    return num;
  }

  const numStr = num.toString();
  return formatNumberStrThousands(numStr);
}

/**
 * Open notification
 * @param {string} message
 * @param {string} description
 */
export const openNotification = (message, description) => notification.open({ message, description, top: 100 });
export const openNetworkErrorNotification = () => openNotification(
  i18n.t('notifications.network-error.message'),
  i18n.t('notifications.network-error.description'),
);

export const scrollToAnchor = (anchorName) => {
  const anchorElement = document.getElementById(anchorName);
  if (anchorElement) {
    anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
};

/**
 * Limit decimal places
 * @param {*} number
 * @returns
 */
export const numberToFixed = (number, precision = 4) => Number(number.toFixed(precision)) / 1;

export const getUrlSearchParams = (urlObject) => Object.fromEntries(urlObject.searchParams);
export const getUrlSearchParam = (urlObject, key) => getUrlSearchParams(urlObject)[key];

export const getPageUrl = () => {
  const url = new URL(window?.location?.href);
  return url.origin + url.pathname;
};

export const handleEnterKeyPressed = async (event, handleFunc, options) => {
  if (event.key === 'Enter') {
    handleFunc([...options]);
  }
};
export const numberFloor = (num, precision) => {
  const numStr = num.toString();
  const dotIndex = numStr.indexOf('.');
  const flooredNumberStr = dotIndex !== -1 ? numStr.substring(0, precision + dotIndex + 1) : numStr;
  return (Number(flooredNumberStr) / 1);
};

export const shortenAddress = (address, option = { omitStr: '...', preLength: 4, subLength: 4 }) => {
  const { omitStr, preLength, subLength } = option;
  if (_.isEmpty(address) || address.length < preLength + subLength) {
    return address;
  }
  return `${address.substring(0, preLength)}${omitStr}${address.substring(address.length - subLength, address.length)}`;
};

export const shortenAmount = (amount, precision) => (amount < 1000 ? numberToFixed(amount, precision) : `${formatNumberStrThousands(numberFloor(amount / 1000, 1))} K`);

export const makeTimeoutPromise = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

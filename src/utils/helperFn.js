import _ from 'lodash';
import { notification } from 'antd';
import moment from 'moment';

import Parse from 'parse';
import nexti18N from '../../i18n';
import config from '../config';

export const CROWDLOAN_STATE = {
  PRELAUNCH: 'PRELAUNCH',
  LAUNCH: 'LAUNCH',
  ENDED: 'ENDED',
};

export const CROWDLOAN_TYPE = {
  KSM: 'KSM',
  DOT: 'DOT',
};

const { crowdloan: { beginTime: ksmBeginTime, endTime: ksmEndTime, wagmiPassword }, dotCrowdloan: { beginTime: dotBeginTime, endTime: dotEndTime } } = config;

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

export const isWagmiMode = (crowdloanType) => {
  let isWagmiPage = false;
  if (typeof window === 'undefined') {
    return false;
  }

  const url = new URL(window?.location?.href);
  if (crowdloanType === CROWDLOAN_TYPE.KSM) {
    isWagmiPage = url?.pathname === '/turing/wagmi' || url?.pathname === '/turing/wagmi/';
  } else {
    isWagmiPage = url?.pathname.startsWith('/oak/wagmi/');
  }

  return crowdloanType === CROWDLOAN_TYPE.KSM
    ? isWagmiPage && getUrlSearchParam(url, 'password') === wagmiPassword
    : isWagmiPage;
};

export const calculateCrowdloanState = (crowdloanBeginTime, crowdloanEndTime) => {
  if (moment().isBefore(moment(crowdloanBeginTime))) {
    return CROWDLOAN_STATE.PRELAUNCH;
  }
  if (moment().isBefore(moment(crowdloanEndTime))) {
    return CROWDLOAN_STATE.LAUNCH;
  }
  return CROWDLOAN_STATE.ENDED;
};

export const getCrowdloanState = () => (isWagmiMode(CROWDLOAN_TYPE.KSM) ? CROWDLOAN_STATE.LAUNCH : calculateCrowdloanState(ksmBeginTime, ksmEndTime));

export const getDotCrowdloanState = () => calculateCrowdloanState(dotBeginTime, dotEndTime);

export const getCountdown = (crowdloanType = CROWDLOAN_TYPE.KSM) => {
  const beginTime = crowdloanType === CROWDLOAN_TYPE.KSM ? ksmBeginTime : dotBeginTime;
  const endTime = crowdloanType === CROWDLOAN_TYPE.KSM ? ksmEndTime : dotEndTime;
  const currentState = crowdloanType === CROWDLOAN_TYPE.KSM ? getCrowdloanState() : getDotCrowdloanState();

  let countdown = moment.duration(0);
  if (currentState === CROWDLOAN_STATE.PRELAUNCH) {
    countdown = moment.duration(moment(beginTime).diff(moment()));
  } else if (currentState === CROWDLOAN_STATE.LAUNCH) {
    countdown = moment.duration(moment(endTime).diff(moment()));
  }

  return {
    days: Math.floor(countdown.asDays()),
    hours: countdown.hours(),
    minutes: countdown.minutes(),
    seconds: countdown.seconds(),
  };
};

export const handleEnterKeyPressed = async (event, handleFunc, options) => {
  if (event.key === 'Enter') {
    handleFunc([...options]);
  }
};

export const resendEmail = async (email) => {
  try {
    await Parse.User.requestEmailVerification(email);
    openNotification(
      i18n.t('common:join.notifications.email-resent.message'),
      i18n.t('common:join.notifications.email-resent.description'),
    );
  } catch (error) {
    if (error.code === Parse.Error.EMAIL_NOT_FOUND) {
      openNotification(
        i18n.t('common:join.notifications.email-not-found.message'),
        i18n.t('common:join.notifications.email-not-found.description'),
      );
      return;
    }
    // We can't clearly know through the error information whether the failure is because the email has been verified.
    if (error.code === -1) {
      openNotification(
        i18n.t('common:join.notifications.email-verified.message'),
        i18n.t('common:join.notifications.email-verified.description'),
      );
      return;
    }
    openNetworkErrorNotification();
  }
};

export const downloadData = (data, fileName, fileType) => {
  // Create a blob with the data we want to download as a file
  const blob = new Blob([data], { type: fileType });
  // Create an anchor element and dispatch a click event on it
  // to trigger a download
  const anchorElement = document.createElement('a');
  anchorElement.download = fileName;
  anchorElement.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  anchorElement.dispatchEvent(clickEvt);
  anchorElement.remove();
};

export const generateCsvData = (headers, data) => {
  const headerRow = headers.join(',');
  const dataRows = data.reduce((acc, row) => {
    const rowData = _.map(row, (item) => `"${item}"`);
    acc.push(rowData.join(','));
    return acc;
  }, []);
  return [headerRow, ...dataRows].join('\n');
};

export const exportToCsv = (headers, data, fileName) => {
  const csvData = generateCsvData(headers, data);
  downloadData(csvData, fileName, 'text/csv');
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

/* eslint-disable no-console */
import util from 'util';
import moment from 'moment';

import config from '../config';
import FetchError from './errors/FetchError';

const { env } = config;

const LOG_LEVEL = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
};

const logLevel = env === 'development' ? LOG_LEVEL.INFO : LOG_LEVEL.ERROR;

// %s - method name
// %s - message
const LOG_DEBUG_FORMAT = '[%s] %s %s'; // e.g. [Time] MethodName() Message

function formatMessage(args) {
  const time = moment().format('HH:mm:ss');
  const methodname = args[0];

  let messageStr;
  if (args.length === 2) {
    if (typeof args[1] === 'object') {
      messageStr = JSON.stringify(args[1]);
    } else {
      // eslint-disable-next-line prefer-destructuring
      messageStr = args[1];
    }
  } else if (args.length > 2) {
    const messageArgs = Array.prototype.slice.call(args, 1);
    messageStr = util.format(...messageArgs);
  }

  return util.format(LOG_DEBUG_FORMAT, time, methodname, messageStr);
}

function formatError(error) {
  return error.code ? `ErrorCode: ${error.code}, ${error.stack}` : error.stack;
}

export function logDebug(...args) {
  if (logLevel < LOG_LEVEL.INFO) {
    return;
  }
  console.log(formatMessage(args));
}

export function logWarn(...args) {
  if (logLevel < LOG_LEVEL.WARN) {
    return;
  }
  console.warn(formatMessage(args));
}

export function logError(...args) {
  if (logLevel < LOG_LEVEL.ERROR) {
    return;
  }

  const formattedArgs = args;
  if (formattedArgs[1] instanceof Error) {
    formattedArgs[1] = formatError(formattedArgs[1]);
  }
  if (formattedArgs[2] instanceof Error) {
    formattedArgs[2] = formatError(formattedArgs[2]);
  }

  console.error(formatMessage(formattedArgs));
}

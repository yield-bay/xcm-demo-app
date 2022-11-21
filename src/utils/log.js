/* eslint-disable no-console */
import Parse from 'parse';
import util from 'util';
import moment from 'moment';
import * as Sentry from '@sentry/nextjs';

import config from '../config';
import FetchError from './errors/FetchError';

/**
 * The log tool refers to webapp-parse-backend:
 * https://github.com/OAK-Foundation/webapp-parse-backend/blob/9c4bd3c5d7f9ee8b6d10feac9fdd11a904356695/src/components/utils/utils.js#L192
 */
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

function captureException(error) {
  if (env === 'development') {
    return;
  }

  const level = Sentry.Severity.Info;

  if (error instanceof FetchError) {
    Sentry.captureException(error, { tags: { 'fetch.url': error.url, level } });
  } else if (error instanceof Parse.Error) {
    Sentry.captureException(error, { tags: { 'parse.func': error.cloudFunc, level } });
  } else {
    Sentry.captureException(error, { level });
  }
}

export function logError(...args) {
  if (logLevel < LOG_LEVEL.ERROR) {
    return;
  }

  const formattedArgs = args;
  if (formattedArgs[1] instanceof Error) {
    captureException(formattedArgs[1]);
    formattedArgs[1] = formatError(formattedArgs[1]);
  }
  if (formattedArgs[2] instanceof Error) {
    captureException(formattedArgs[2]);
    formattedArgs[2] = formatError(formattedArgs[2]);
  }

  console.error(formatMessage(formattedArgs));
}

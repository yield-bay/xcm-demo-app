import _ from 'lodash';
import config from '../config';
import { formatNumberThousands } from './helperFn';

const {
  crowdloan: { paraToken, paraDecimals, parachainId },
  dotCrowdloan: { paraToken: dotParaToken, paraDecimals: dotParaDecimals, parachainId: dotParachainId }
} = config;

class ParachainHelper {
  constructor(chainId = parachainId, chainToken = paraToken, decimals = paraDecimals) {
    this.parachainId = chainId;
    this.token = chainToken;
    this.decimals = decimals;
  }

  getAmountText = (number) => {
    const amount = _.isNumber(number) && !_.isNaN(number) ? number : 0;
    return this.getUnitText(this.planckToUnit(amount));
  };

  getUnitText = (value, precision = 2, unit = null) => {
    const number = _.isNumber(value) && !_.isNaN(value) ? value : 0;
    return `${formatNumberThousands(Number(number.toFixed(precision)) / 1)} ${unit || this.getUnit()}`;
  };

  getParachainId = () => this.parachainId;

  getUnit = () => this.token;

  getDecimals = () => this.decimals;

  planckToUnit = (planck) => planck / (10 ** this.getDecimals());

  unitToPlanck = (unit) => unit * (10 ** this.getDecimals());
}

export const turParachainHelper = new ParachainHelper();
export const oakParachainHelper = new ParachainHelper(dotParachainId, dotParaToken, dotParaDecimals);

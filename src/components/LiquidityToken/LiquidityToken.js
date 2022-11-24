import React, { useEffect, useContext } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Image,
} from 'antd';

import imgMgx from '../../assets/image/mgx.svg';
import imgTur from '../../assets/image/tur.png';
import imgKsm from '../../assets/image/ksm.svg';

function LiquidityToken({ firstTokenSymbol, secondTokenSymbol }) {
  const getImageBySymbol = (symbol) => {
    const imageMgx = <Image src={imgMgx} alt={`${symbol} Token Icon`} width={24} height={24} />;
    const imageTur = <Image src={imgTur} alt={`${symbol} Token Icon`} width={24} height={24} />;
    const imageKsm = <Image src={imgKsm} alt={`${symbol} Token Icon`} width={24} height={24} />;

    switch (symbol) {
      case 'TUR':
        return imageTur;
      case 'KSM':
        return imageKsm;
      case 'MGX':
      default:
        return imageMgx;
    }
  };

  return (
    <div>
      {getImageBySymbol(firstTokenSymbol)}
      {getImageBySymbol(secondTokenSymbol)}
      <div className="inline-block margin-left-12">
        {firstTokenSymbol}
&nbsp;/&nbsp;
        {secondTokenSymbol}
      </div>
    </div>
  );
}

LiquidityToken.propTypes = {
  firstTokenSymbol: PropTypes.string.isRequired,
  secondTokenSymbol: PropTypes.string.isRequired,
};

LiquidityToken.defaultProps = {
};

export default LiquidityToken;

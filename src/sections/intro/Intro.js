import React, { useContext } from 'react';
import {
  Row, Col, Button, Image,
} from 'antd';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import nexti18N from '../../../i18n';
import config from '../../config';
import GlobalContext from '../../context/GlobalContext';
import imgMgx from '../../assets/image/mgx.svg';
import imgTur from '../../assets/image/tur.png';

const { withTranslation } = nexti18N;

const Container = styled.div`
  align-items: center;
  padding-top: 10%;
`;

const PromotedBox = styled.div`
    width: 480px;
    margin-bottom: 8px;
    padding: 16px;
    background-color: rgba(255, 215, 2, 0.17);
    border-radius: 4px;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
`;

const SwapBox = styled.div`
    width: 448px;
    padding: 32px;
    background-color: rgba(255, 255, 255, 0.04);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.25);
    border-radius: 4px;
    position: relative;
    display: flex;
    flex-direction: column;
`;

function Intro({ t }) {
  const gContext = useContext(GlobalContext);
  const { isMobile } = gContext;

  const tokenRow = (
    <div className="border width-100 margin-bottom-12">
      <div className="flex flex-right">
        <div className="flex-grow-10">Token</div>
        <div className="flex-grow-1">Balance: 0</div>
        <div className="flex-grow-1">MAX</div>
      </div>
      <div className="flex flex-right">
        <div className="flex-grow-1"><Image className="" src={imgMgx} alt="MGX Token Icon" width={24} height={24} /></div>
        <div className="flex-grow-10">MGX</div>
        <div className="flex-grow-1">0.0</div>
      </div>
    </div>
  );

  return (
    <Container>
      <Row justify="center">
        <Col>
          <PromotedBox>
            Promoted pools
            <Button>Select a Pool</Button>
          </PromotedBox>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <SwapBox>
            <Row>
              <div className="flex margin-bottom-24">
                <div>Swap</div>
                <div>Pool</div>
              </div>
              <div className="flex-break" />
              <div className="flex flex-column width-100">
                {tokenRow}
                <div className="margin-bottom-12">+</div>
                {tokenRow}
              </div>
              <div className="flex flex-right width-100 margin-bottom-12">
                <div className="flex-grow-10">Fee</div>
                <div className="flex-grow-1">0 MGX</div>
              </div>
              <div className="flex flex-right width-100 margin-bottom-24">
                <div className="flex-grow-10">Expected Share of Pool</div>
                <div className="flex-grow-1">n/a</div>
              </div>
              <div className="flex flex-right width-100 margin-bottom-24">
                <div className="flex-grow-10">Est. 30 days rewards</div>
                <div className="flex-grow-1">
                  <div color="textOnPremiumSurface" fontSize="14" fontWeight="600" className="inline-block margin-right-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <div className="inline-block">0 MGX</div>
                </div>
              </div>
              <div className=" margin-bottom-24">
                On top of rewards, you will earn fees from trades proportional to your share of the pool. The fee is variable and depends on the amount of the trade.
              </div>
              <div className="flex width-100">
                <Button style={{ margin: '0 auto' }}>ENTER AN AMOUNT</Button>
              </div>
            </Row>
          </SwapBox>
        </Col>
      </Row>
    </Container>
  );
}

Intro.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['home-v2'])(Intro);

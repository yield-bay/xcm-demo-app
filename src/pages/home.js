import {
  Image, Button,
} from 'antd';
import React, { useContext, useState } from 'react';
import { borderRight } from 'styled-system';

import styled from 'styled-components';
import Intro from '../sections/intro';

import imgPolkadot from '../assets/image/polkadot.svg';
import imgMgx from '../assets/image/mgx.svg';
import imgTur from '../assets/image/tur.png';
import imgXlogo from '../assets/image/x-logo.svg';

const Container = styled.div`
  padding: 2rem 0;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 24px 18px;
`;

const Col = styled.div`
`;

function HomeV2() {
  // const {} = useContext(GlobalContext);

  return (
    <div className="layout">
      <div className="sider">
        <Container>
          <Row>
            <Image src={imgXlogo} alt="Mangata App Logo" />
          </Row>
          <div className="flex" style={{ padding: '0 18px' }}>
            <div className="flex-grow-1" width="24" overflow="hidden">
              <Image src={imgPolkadot} width={24} alt="Wallet Logo" />
            </div>
            <div className="flex-grow-10">
              <div color="textPrimary" fontWeight="400" fontSize="14" letterSpacing="0.4" data-testid="connect-accountName" className="sc-dkzDqf cjllyR">TUR-MGX Bootstrap</div>
              <div color="textSecondary" fontWeight="400" fontSize="14" letterSpacing="0.4" data-testid="connect-accountAddress" className="sc-dkzDqf gqqtbp">5FgWx...km7bF</div>
            </div>
            <div className="flex-grow-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
          <Row className="border-bottom">
            <Button className="flex-grow-1" style={{ marginRight: 12 }}>DEPOSIT</Button>
            <Button className="flex-grow-1">WITHDRAW</Button>
          </Row>
          <Row className="border-bottom">
            <div style={{ marginBottom: 18 }}>
              <div className="text-grey">PROVIDED LIQUIDITY</div>
            </div>
            <div className="flex-break" />
            <div className="flex" style={{ width: '100%' }}>
              <div className="flex-grow-10" color="textPrimary" fontSize="14" fontWeight="400" letterSpacing="0.5">
                <div className="flex">
                  <div>
                    <Image className="" src={imgMgx} alt="MGX Token Icon" width={24} height={24} />
                    <Image className="" src={imgTur} alt="TUR Token Icon" width={24} height={24} />
                  </div>
                  <div>MGX&nbsp;/&nbsp;TUR</div>
                </div>
              </div>
              <div className="flex-grow-1">
                <div color="textOnPremiumSurface" fontSize="14" fontWeight="600" className="inline-block margin-right-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                </div>
                <div color="currentColor" className="inline-block">39909.5 MGX</div>
              </div>
              <div className="flex-grow-1  flex-right">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </div>
          </Row>
          <Row>
            <div style={{ marginBottom: 18 }}>
              <div className="text-grey  margin-bottom-24">YOUR TOKENS</div>
            </div>
            <div className="flex-break" />
            <div className="width-100">
              <div className="flex margin-bottom-24 width-100">
                <div className="margin-right-12 flex-grow-1"><Image className="" src={imgMgx} alt="MGX Token Icon" width={24} height={24} /></div>
                <div className="flex-grow-10" style={{ lineHeight: '24px' }}>MGX</div>
                <div className="flex-grow-1" style={{ lineHeight: '24px' }}>7,917.96</div>
              </div>
              <div className="flex width-100">
                <div className="margin-right-12 flex-grow-1"><Image className="" src={imgTur} alt="TUR Token Icon" width={24} height={24} /></div>
                <div className="flex-grow-10" style={{ lineHeight: '24px' }}>TUR</div>
                <div className="flex-grow-1" style={{ lineHeight: '24px' }}>7,917.96</div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
      <div className="flex-grow-2">
        <Intro />
      </div>
    </div>
  );
}

HomeV2.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home-v2', 'header', 'footer'],
});

export default HomeV2;

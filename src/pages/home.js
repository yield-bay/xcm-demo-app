import {
  Image,Button,
} from 'antd';
import React, { useContext, useState } from 'react';
import { borderRight } from 'styled-system';

import Intro from '../sections/intro';

import imgPolkadot from '../assets/image/polkadot.svg';
import imgMgx from '../assets/image/mgx.svg';
import imgTur from '../assets/image/tur.png';
import imgXlogo from '../assets/image/x-logo.svg';
import styled from 'styled-components';

const Row = styled.div`
  height: 40px;
`;

const Col = styled.div`
`;

function HomeV2() {
  // const {} = useContext(GlobalContext);

  return (
    <div className="layout">
      <div className="sider">
        <div className="container">
          <Row>
            <div>
              <Image src={imgXlogo} alt="Mangata App Logo" />
            </div>
          </Row>
          <Row>
            <Col>
              <div cursor="pointer" className="">
                <div className="">
                  <div className="" width="24" overflow="hidden">
                    <Image src={imgPolkadot} width={24} alt="Wallet Logo" />
                  </div>
                  <div className="">
                    <div color="textPrimary" fontWeight="400" fontSize="14" letterSpacing="0.4" data-testid="connect-accountName" className="sc-dkzDqf cjllyR">TUR-MGX Bootstrap</div>
                    <div color="textSecondary" fontWeight="400" fontSize="14" letterSpacing="0.4" data-testid="connect-accountAddress" className="sc-dkzDqf gqqtbp">5FgWx...km7bF</div>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Col>
            <Col>
              <Button type="default" size="medium ">DEPOSIT</Button>
              <Button>WITHDRAW</Button>
            </Col>
            <Col>
              <div transform="" className="">
                <div>
                  <div data-testid="poolsOverview-title" className="">
                    <div color="textSecondary" fontSize="12" fontWeight="500" letterSpacing="1" className="">Provided Liquidity</div>
                  </div>
                  <div className="">
                    <div className="" data-testid="poolsOverview-item-MGX-TUR">
                      <div color="textPrimary" className="" fontSize="14" fontWeight="400" letterSpacing="0.5">
                        <Image className="" src={imgMgx} alt="MGX Token Icon" width={24} height={24} />
                        <Image className="" src={imgTur} alt="TUR Token Icon" width={24} height={24} />
                        <div>MGX</div>
                        <div>&nbsp;/&nbsp;TUR</div>
                      </div>
                      <div className="">
                        <div className="">
                          <div color="textOnPremiumSurface" fontSize="14" fontWeight="600" className="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            <div color="currentColor" className="">39909.5 MGX</div>
                          </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}><polyline points="9 18 15 12 9 6" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </Col>
            <Col />
          </Row>
        </div>
      </div>
      <div className="main">
        <Intro />
      </div>
    </div>
  );
}

HomeV2.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home-v2', 'header', 'footer'],
});

export default HomeV2;

import {
  Image, Row, Col, Layout, Button,
} from 'antd';
import React, { useContext, useState } from 'react';
import { borderRight } from 'styled-system';

import Intro from '../sections/intro';

import imgPolkadot from '../assets/image/polkadot.svg';
import imgMgx from '../assets/image/mgx.svg';
import imgTur from '../assets/image/tur.png';
import imgXlogo from '../assets/image/x-logo.svg';

const {
  Header, Footer, Sider, Content,
} = Layout;

function HomeV2() {
  // const {} = useContext(GlobalContext);

  return (
    <Layout style={{ display: 'flex' }}>
      <Sider width={400} style={{ height: '100vh', borderRight: '1px solid rgba(255, 255, 255, 0.25)' }}>
        <div>
          <Row>
            <div>
              <Image width={200} src={imgXlogo} alt="Mangata App Logo" />
            </div>
          </Row>
          <Row>
            <Col>
              <div cursor="pointer" className="sc-gsnTZi hJAMQl sc-dwLEzm gdHBSr">
                <div className="sc-gsnTZi bJbPxp">
                  <div className="sc-gsnTZi jqVgwG" width="24" overflow="hidden">
                    <Image src={imgPolkadot} width={24} alt="Wallet Logo" />
                  </div>
                  <div className="sc-gsnTZi bTYbGS">
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
              <Button type="default" size="medium">DEPOSIT</Button>
              <Button>WITHDRAW</Button>
            </Col>
            <Col>
              <div transform="" className="sc-gsnTZi lnIuOl">
                <div>
                  <div data-testid="poolsOverview-title" className="sc-gsnTZi iexNga">
                    <div color="textSecondary" fontSize="12" fontWeight="500" letterSpacing="1" className="sc-dkzDqf KWLiM">Provided Liquidity</div>
                  </div>
                  <div className="sc-gsnTZi jdVisV">
                    <div className="sc-gsnTZi cJBABS sc-hlnMnd iFwkUz" data-testid="poolsOverview-item-MGX-TUR">
                      <div color="textPrimary" className="sc-dkzDqf hEAim" fontSize="14" fontWeight="400" letterSpacing="0.5">
                        <Image className="sc-iNWwEs eBfbrU" src={imgMgx} alt="MGX Token Icon" width={24} height={24} />
                        <Image className="sc-iNWwEs eBfbrU" src={imgTur} alt="TUR Token Icon" width={24} height={24} />
                        <div>MGX</div>
                        <div>&nbsp;/&nbsp;TUR</div>
                      </div>
                      <div className="sc-gsnTZi FSNPK">
                        <div className="sc-gsnTZi dHNESB">
                          <div color="textOnPremiumSurface" fontSize="14" fontWeight="600" className="sc-dkzDqf dMJZpM">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 2, display: 'block' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            <div color="currentColor" className="sc-dkzDqf drUaqx">39909.5 MGX</div>
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
      </Sider>
      <Layout>
        <Intro />
      </Layout>
    </Layout>
  );
}

HomeV2.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home-v2', 'header', 'footer'],
});

export default HomeV2;

import React, { useContext } from 'react';
import { Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import nexti18N from '../../../i18n';
import Container from '../../components/Container/Container';
import config from '../../config';
import GlobalContext from '../../context/GlobalContext';

const { withTranslation } = nexti18N;

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
    width: 480px;
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

  return (
    <>
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
              Swap  Pool
              <div>
                <p>
                  On top of rewards, you will earn fees from trades proportional to your share of the pool. The fee is variable and depends on the amount of the trade.
                </p>
              </div>
            </Row>
          </SwapBox>
        </Col>
      </Row>
    </>
  );
}

Intro.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['home-v2'])(Intro);

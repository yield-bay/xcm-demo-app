/* eslint-disable max-len */
import {
  Col, Row, Checkbox, Button,
} from 'antd';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import OAKTerms from '../OAKTerms';
import { device } from '../../utils';
import { useCrowdloanContext } from '../../context/CrowdloanContext';
import { TERMS_STATE } from '../../sections/crowdloan/contribution/ContributionHelper';

const ModalStyled = styled(Modal)`
  &.modal {
    z-index: 10050;
  }
  .modal-dialog {
    width: 100vw;
    height: 100vh;
    max-width: initial;
    max-height: initial;
    margin: 0;
  }
  .modal-content {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0.75);
  }
  .modal-body {
    padding: 0;
  }
`;

const CloseWrapper = styled.div`
  cursor: pointer;
  top: 2rem;
  position: absolute;
  height: 1.5rem;
  width: 1.5rem;
  align-items: center;
  display: inline-flex;
  justify-content: center;
  z-index: 10;
  color: #000;

  right: 1rem;
  
  @media ${device.md} {
    right: 2rem;
  }
`;

const ModalContainer = styled.div`
  width: 900px;
  max-width: 95%;
  height: 90vh;
  background-color: #FFF;
  border-radius: 18px;
  position:relative;
  padding: 4rem 1rem 1rem;

  p {
    font-size: 1rem;
  }

  @media ${device.md} {
    padding: 6rem 4rem 2rem;
  }
`;
const ScrollablePanel = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 8rem);
  
  overflow-y: auto;
  overflow-x: hidden; // Hide horizontal scrollbar
  margin-bottom: 1rem;
  text-align: left;

  @media ${device.md} {
    text-align: justify;
    margin-bottom: 2rem;
    max-height: calc(100% - 10rem);
  }
`;

function CloseButton({ onClick }) {
  return (
    <CloseWrapper onClick={onClick}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        css={`
        fill: currentcolor;
        vertical-align: middle;
        height: 2rem;
        width: 2rem;
      `}
      >
        <path
          d="M9.82 12L0 2.18 2.18 0 12 9.82 21.82 0 24 2.18 14.18 12 24 21.82 21.82 24 12 14.18 2.18 24 0 21.82z"
          fill="currentColor"
        />
      </svg>
    </CloseWrapper>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

function ModalTerms() {
  const [isShow, setIsShow] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [isBottomReached, setBottomReached] = useState(false);
  const { termsState, setTermsState } = useCrowdloanContext();

  useEffect(() => {
    setIsShow(termsState === TERMS_STATE.SHOW);
  }, [termsState]);

  function onCheckboxChanged(e) {
    setChecked(e.target.checked);
  }

  /**
   * Set isBottomReached to true when the ScrollPanel content is scrolled to the bottom
   * @param {*} e scroll panel events
   */
  function handleScroll(e) {
    const buffer = 5; // 5 px to bottom; sometimes the left of the below equation is not reached equal to the right
    const bottom = e.target.scrollHeight - e.target.scrollTop - buffer <= e.target.clientHeight;

    if (bottom) {
      setBottomReached(true);
    }
  }

  const onClicked = () => setTermsState(TERMS_STATE.APPROVED);

  return (
    <ModalStyled className="email-verified-dialog" size="lg" centered show={isShow}>
      <Modal.Body className="position-relative d-flex justify-content-center align-items-center">
        <ModalContainer onClick={(event) => event.stopPropagation()}>
          <CloseButton onClick={() => setIsShow(false)} />
          {/* <p style={{ marginBottom: '2rem' }}>Please read below terms and scroll to the bottom for the agreement checkbox.</p> */}
          <ScrollablePanel onScroll={(e) => handleScroll(e)}>
            <OAKTerms />
          </ScrollablePanel>
          <Row gutter={[0, 24]}>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Checkbox style={{ fontSize: '1rem' }} disabled={!isBottomReached} onChange={(e) => onCheckboxChanged(e)}>I have read and agree to the terms and conditions.</Checkbox>
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button className="ow-summit-button" type="primary" size="large" style={{ display: 'inline-block' }} disabled={!isChecked} onClick={onClicked}>
                I agree
              </Button>
            </Col>
          </Row>
        </ModalContainer>
      </Modal.Body>
    </ModalStyled>
  );
}

export default ModalTerms;

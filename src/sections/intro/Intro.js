import React, { useContext, useState } from 'react';
import _ from 'lodash';
import {
  Row, Col, Button, Image, Tabs, Form, Input, Select, Switch, Slider, Modal, Steps, message, Spin,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import BN from 'bn.js';

import PropTypes from 'prop-types';

import styled from 'styled-components';
import nexti18N from '../../../i18n';
import GlobalContext from '../../context/GlobalContext';
import turingHelper from '../../utils/turingHelper';
import mangataHelper from '../../utils/mangataHelper';
import { env, tokenConfig } from '../../utils/constants';
import { delay, formatNumberThousands } from '../../utils/utils';
import LiquidityToken from '../../components/LiquidityToken';

import imgMgx from '../../assets/image/mgx.svg';
// import imgTur from '../../assets/image/tur.png';
// import imgKsm from '../../assets/image/ksm.svg';

const { TURING_ENDPOINT, MANGATA_ENDPOINT, MANGATA_PARA_ID } = env;
const { MGR: { decimal: MGR_DECIMAL }, TUR: { decimal: TUR_DECIMAL } } = tokenConfig;

const { Option } = Select;

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

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 12,
  },
};

function Intro({ t }) {
  const gContext = useContext(GlobalContext);
  const { alice } = gContext;
  // const { isModalVisible, setIsModalVisible } = gContext;
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [step1Confirm, setStep1Confirm] = useState(false);
  const [step2Confirm, setStep2Confirm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [compoundTxHash, setCompoundTxHash] = useState(null);
  const [liquidityIncrement, setLiquidityIncrement] = useState(new BN(0));

  const [compoundFrequency, setCompoundFrequency] = useState(new BN(0));

  const [compoundPercentage, setCompoundPercentage] = useState(new BN(0));
  const [autoCompoundEnabled, setAutoCompoundEnabled] = useState(new BN(0));

  const listenEvents = async (api) => new Promise((resolve) => {
    const listenSystemEvents = async () => {
      const unsub = await api.query.system.events((events) => {
        let foundEvent = false;
        // Loop through the Vec<EventRecord>
        events.forEach((record) => {
          // Extract the phase, event and the event types
          const { event, phase } = record;
          const { section, method, typeDef: types } = event;

          // console.log('section.method: ', `${section}.${method}`);
          if (section === 'proxy' && method === 'ProxyExecuted') {
            foundEvent = true;
            // Show what we are busy with
            console.log(`\t${section}:${method}:: (phase=${phase.toString()})`);
            // console.log(`\t\t${event.meta.documentation.toString()}`);

            // Loop through each of the parameters, displaying the type and data
            event.data.forEach((data, index) => {
              console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
            });
          }
        });

        if (foundEvent) {
          unsub();
          resolve();
        }
      });
    };

    listenSystemEvents().catch(console.error);
  });

  const onRequestAutoCompound = async () => {
    setLoading(true);
    console.log('Initializing APIs of both chains ...');

    await turingHelper.initialize(TURING_ENDPOINT);
    await mangataHelper.initialize(MANGATA_ENDPOINT);

    const mangataAddress = alice.assets[1].address;
    const turingAddress = alice.assets[2].address;

    const { reserved: oldLiquidityBalance } = await mangataHelper.getBalance('MGR-TUR', mangataAddress);

    const lquidityToken = 'MGR-TUR';
    console.log(`Checking how much reward available in ${lquidityToken} pool ...`);
    const rewardAmount = await mangataHelper.calculateRewardsAmount(mangataAddress, lquidityToken);
    console.log(`Claimable reward in ${lquidityToken}: `, rewardAmount);

    const liquidityBalance = await mangataHelper.getBalance('MGR-TUR', mangataAddress);
    // const free = liquidityBalance.free.div(new BN('1000000000000000000'));
    const reserved = liquidityBalance.reserved.div(new BN('1000000000000000000'));

    console.log(`Before auto-compound, Alice’s reserved "MGR-TUR": ${formatNumberThousands(reserved.toNumber())} ...`);

    console.log('\nStart to schedule an auto-compound call via XCM ...');
    const liquidityTokenId = mangataHelper.getTokenIdBySymbol('MGR-TUR');
    const proxyExtrinsic = mangataHelper.api.tx.xyk.compoundRewards(liquidityTokenId, 100);
    const mangataProxyCall = await mangataHelper.createProxyCall(mangataAddress, proxyExtrinsic);
    const encodedMangataProxyCall = mangataProxyCall.method.toHex(mangataProxyCall);
    const mangataProxyCallFees = await mangataProxyCall.paymentInfo(mangataAddress);

    console.log('encodedMangataProxyCall: ', encodedMangataProxyCall);
    console.log('mangataProxyCallFees: ', mangataProxyCallFees.toHuman());

    console.log('\n1. Create the call for scheduleXcmpTask ');
    const providedId = `xcmp_automation_test_${(Math.random() + 1).toString(36).substring(7)}`;
    const xcmpCall = turingHelper.api.tx.automationTime.scheduleXcmpTask(
      providedId,
      { Fixed: { executionTimes: [0] } },
      MANGATA_PARA_ID,
      0,
      encodedMangataProxyCall,
      mangataProxyCallFees.weight,
    );

    console.log('xcmpCall: ', xcmpCall);

    console.log('\n2. Estimating XCM fees ...');
    const xcmFrees = await turingHelper.getXcmFees(turingAddress, xcmpCall);
    console.log('xcmFrees:', xcmFrees.toHuman());

    // Get a TaskId from Turing rpc
    const taskId = await turingHelper.api.rpc.automationTime.generateTaskId(turingAddress, providedId);
    console.log('TaskId:', taskId.toHuman());

    console.log('\n3. Sign and send scheduleXcmpTask call ...');
    const txHash = await turingHelper.sendXcmExtrinsic(xcmpCall, alice.keyring, taskId);

    console.log('\nWaiting 20 seconds before reading new chain states ...');

    // TODO: how do we know the task happens? Could we stream reading events on Mangata side?
    // console.log(`\n4. waiting for XCM events on Mangata side ...`);

    await listenEvents(mangataHelper.api);
    await delay(20000);

    const { reserved: newLiquidityBalance } = await mangataHelper.getBalance('MGR-TUR', mangataAddress);

    console.log('oldLiquidityBalance:', oldLiquidityBalance.toString());
    console.log('newLiquidityBalance:', newLiquidityBalance.toString());

    const increment = newLiquidityBalance.sub(oldLiquidityBalance).div(new BN(MGR_DECIMAL));
    setLiquidityIncrement(increment);
    setCompoundTxHash(txHash);
    setLoading(false);
    setStep2Confirm(true);
  };

  const tokenRow = (
    <div className="border width-100 margin-bottom-12 padding-top-12 padding-bottom-12">
      <div className="flex flex-right margin-left-12">
        <div className="flex-grow-10 text-grey margin-bottom-12">Token</div>
        <div className="flex-grow-1  text-grey ">Balance: 0</div>
        <div className="flex-grow-1">MAX</div>
      </div>
      <div className="flex flex-right margin-left-12">
        <div className="flex-grow-1"><Image src={imgMgx} alt="MGX Token Icon" width={24} height={24} /></div>
        <div className="flex-grow-10">MGX</div>
        <div className="flex-grow-1">0.0</div>
      </div>
    </div>
  );

  const onChange = (key) => {
    console.log(key);
  };

  const onStepChange = (value) => {
    console.log('onStepChange:', value);
    setCurrent(value);
  };

  const next = () => {
    const nextValue = _.min([current + 1, 1]);
    console.log('current', current);
    console.log('nextValue', nextValue);
    setCurrent(nextValue);
  };

  const poolContent = (
    <Row>
      <div className="flex flex-column width-100">
        {tokenRow}
        <div className="margin-bottom-12 margin-left-12">+</div>
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
  );

  const formRef = React.createRef();

  const onTokenSelectChange = (value) => {
    switch (value) {
      case 'select-mgx-tur':
        formRef.current.setFieldsValue({
          note: 'Hi, man!',
        });
        return;
      case 'select-tur-ksm':
        formRef.current.setFieldsValue({
          note: 'Hi, lady!',
        });
        return;
      case 'select-mgx-ksm':
        formRef.current.setFieldsValue({
          note: 'Hi there!',
        });
        break;
      default:
    }
  };

  const getCompoundPercentage = (sliderValue) => {
    if (sliderValue < 33) {
      return 25;
    } if (sliderValue < 66) {
      return 50;
    } if (sliderValue < 99) {
      return 75;
    }
    return 100;
  };

  const getCompoundFrequency = (sliderValue) => {
    if (sliderValue < 33) {
      return 7;
    } if (sliderValue < 66) {
      return 5;
    } if (sliderValue < 99) {
      return 3;
    }
    return 1;
  };

  const onFinish = (values) => {
    console.log(values);
    const { sliderFrequency, sliderPercentage, autoCompoundSwitch } = values;
    const compoundFrequencyValue = getCompoundFrequency(sliderFrequency);
    const compoundPercentageValue = getCompoundPercentage(sliderPercentage);

    setCompoundFrequency(compoundFrequencyValue);
    setCompoundPercentage(compoundPercentageValue);
    setAutoCompoundEnabled(autoCompoundSwitch);

    setCurrent(0);
    setStep1Confirm(false);
    setStep2Confirm(false);
    setOpen(true);
  };

  const onStep1ConfirmClicked = () => {
    setStep1Confirm(true);
  };

  const onStep2ConfirmClicked = () => {
    // console.log('onStep2ConfirmClicked');
    // setStep2Confirm(true);
    onRequestAutoCompound();
  };

  const onModalCancelClicked = () => {
    console.log('onModalCancelClicked');
    setOpen(false);
  };

  const steps = [
    {
      title: 'Step 1',
      status: 'process',
      description: 'One-time Wallet Setup',
      disabled: true,
      content: step1Confirm ? (
        <>
          <Row className="modal-row">
            <Col span={24}>Transaction Hash: </Col>
          </Row>
          <Row justify="center" gutter={24}>
            <Col span={6}><Button type="primary" onClick={() => next()} style={{ width: '100%' }}>Next</Button></Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="modal-row">
            <Col span={24} className="modal-row-title">One-time setup - getting your wallets ready</Col>
            <Col span={24}>Create and config a proxy wallet</Col>
            <Col span={24}>Swap MGX for TUR if there’s not any</Col>
            <Col span={24}>Withdraw TUR to Turing Network</Col>
          </Row>
          <Row justify="center" gutter={24}>
            <Col span={6}><Button type="primary" onClick={onStep1ConfirmClicked} style={{ width: '100%' }}>Confirm</Button></Col>
            <Col span={6}><Button type="default" onClick={onModalCancelClicked} style={{ width: '100%' }}>Cancel</Button></Col>
          </Row>
        </>
      ),
    },
    {
      title: 'Step 2',
      status: 'wait',
      description: 'Register compound task',
      disabled: true,
      content: step2Confirm ? (
        <>
          <Row className="modal-row">
            <Col span={24}>Transaction Hash: </Col>
            <Col span={24}>{compoundTxHash}</Col>
            <Col span={24}>{`Lquidity Token Increment: ${formatNumberThousands(liquidityIncrement.toNumber())} MGR-TUR`}</Col>
          </Row>
          <Row justify="center" gutter={24}>
            <Col span={6}><Button type="primary" onClick={onModalCancelClicked} style={{ width: '100%' }}>Complete</Button></Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="modal-row">
            <Col span={24} className="modal-row-title">Setting up your compound task</Col>
            <Col span={24}>Composing task registration on Turing Network</Col>
            <Col span={24}>{`Frequency: ${compoundFrequency} Day`}</Col>
            <Col span={24}>{`Percertage: ${compoundPercentage}%`}</Col>
            <Col span={24}>Expiration: good till cancel</Col>
          </Row>
          <Row justify="center" gutter={24}>
            <Col span={6}><Button type="primary" onClick={onStep2ConfirmClicked} style={{ width: '100%' }}>Confirm</Button></Col>
            <Col span={6}><Button type="default" onClick={onModalCancelClicked} style={{ width: '100%' }}>Cancel</Button></Col>
          </Row>
        </>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    status: item.status,
    description: item.description,
    disabled: item.disabled,
    content: item.content,
  }));

  const compoundContent = (
    <Row>
      <Form
        {...layout}
        layout="vertical"
        ref={formRef}
        name="control-ref"
        onFinish={onFinish}
        style={{ width: '80%', margin: '24px auto' }}
        initialValues={{
          select: 'select-mgx-tur', sliderPercentage: 0, sliderFrequency: 0, autoCompoundSwitch: false,
        }}
      >
        <Form.Item
          name="select"
          label="Select a Liquidity Pool"
          tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            onChange={onTokenSelectChange}
            allowClear
          >
            <Option value="select-mgx-tur">
              <LiquidityToken firstTokenSymbol="MGX" secondTokenSymbol="TUR" />
            </Option>
            <Option value="select-tur-ksm">
              <LiquidityToken firstTokenSymbol="TUR" secondTokenSymbol="KSM" />
            </Option>
            <Option value="select-mgx-ksm">
              <LiquidityToken firstTokenSymbol="MGX" secondTokenSymbol="KSM" />
            </Option>
          </Select>
        </Form.Item>
        <Form.Item name="sliderFrequency" label="Frequency" tooltip="This is a required field">
          <Slider
            step={33}
            marks={{
              0: 'Every 7 day',
              33: 'Every 5 day',
              66: 'Every 3 day',
              100: 'Every day',
            }}
          />
        </Form.Item>
        <Form.Item
          name="sliderPercentage"
          label="Percentage of Claimed Reward"
          tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}

        >
          <Slider
            step={33}
            marks={{
              0: '25%',
              33: '50%',
              66: '75%',
              100: '100%',
            }}
          />
        </Form.Item>
        <Form.Item
          label="Auto-compound"
          name="autoCompoundSwitch"
          valuePropName="checked"
          tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
        >
          <Switch />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="default" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Modal
        centered
        open={open}
        onCancel={onModalCancelClicked}
        closable={isLoading}
        footer={null}
        width={800}
        className="steps-modal"
      >
        <Steps
          type="navigation"
          size="small"
          current={current}
          className="site-navigation-steps"
          onChange={onStepChange}
          items={items}
        />
        <div className="steps-content">{steps[current].content}</div>
        {isLoading && (
          <div className="loading-layer">
            <Spin size="large" />
          </div>
        )}
      </Modal>
    </Row>
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
            <Tabs
              defaultActiveKey="3"
              onChange={onChange}
              items={[
                {
                  label: 'SWAP',
                  key: '1',
                  children: poolContent,
                },
                {
                  label: 'POOL',
                  key: '2',
                  children: poolContent,
                },
                {
                  label: 'COMPOUND',
                  key: '3',
                  children: compoundContent,
                },
              ]}
            />

            {/*  */}
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

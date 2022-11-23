import React, {
  useCallback, useMemo, useState, useEffect,
} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import turingHelper from "../utils/turingHelper";
import mangataHelper from "../utils/mangataHelper";
import Account from "../utils/account";

const GlobalContext = React.createContext();

export const SCREEN_WIDTH_MODE = {
  XS: 0,
  SM: 1,
  MD: 2,
  LG: 3,
  XL: 4,
  XXL: 5,
};

export function GlobalProvider({ children }) {
  const [showScrolling, setShowScrolling] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidthMode, setScreenWidthMode] = useState(SCREEN_WIDTH_MODE.LG);

  const [header, setHeader] = useState({
    theme: 'light',
    variant: 'primary',
    align: 'left',
    isFluid: false,
    button: 'cta', // cta, account, null
  });

  const [alice, setAlice] = useState(async () => {
    await cryptoWaitReady();

    console.log('Initializing APIs of both chains ...');
    await turingHelper.initialize();
    await mangataHelper.initialize();

    console.log('Reading token and balance of Alice and Bob accounts ...');
    const account = new Account('Alice');
    await account.init();
    account.print();
    const mangataAddress = alice.assets[1].address;
    const turingAddress = alice.assets[2].address;

    return mangataAddress;
  });

  const toggleModal = useCallback(() => setIsModalVisible(!isModalVisible), [isModalVisible]);

  const value = useMemo(() => ({
    isModalVisible,
    toggleModal,
    header,
    setHeader,
    showScrolling,
    setShowScrolling,
    showReveal,
    setShowReveal,
    isMobile,
    setIsMobile,
    screenWidthMode,
    setScreenWidthMode,
  }), [
    isModalVisible, toggleModal,
    header, setHeader, showScrolling, setShowScrolling, showReveal, setShowReveal,
    isMobile, setIsMobile, screenWidthMode, setScreenWidthMode,
  ]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

GlobalProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string]).isRequired,
};

export default GlobalContext;

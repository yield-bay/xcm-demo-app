import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getDotCrowdloanState } from '../utils/helperFn';
import { CONTRIBUTE_TYPE, TERMS_STATE } from '../sections/crowdloan/contribution/ContributionHelper';

export const VIEW_STATE = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  CONTRIBUTE: 'CONTRIBUTE',
};

const CrowdloanContext = React.createContext();

export function CrowdloanContextProvider({ children, initialState }) {
  const initialCrowdloanState = initialState || getDotCrowdloanState();

  const [balance, setBalance] = useState(null);
  const [xTokenBalance, setXTokenBalance] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewState, setViewState] = useState(VIEW_STATE.SIGNUP);
  const [selectWalletDialogVisible, setSelectWalletDialogVisible] = useState(false);
  const [milestone, setMilestone] = useState([]);
  const [promotionalMilestones, setPromotionalMilestones] = useState([]);
  const [isShowXTokenBalance, setIsShowXTokenBalance] = useState(false);
  const [crowdloanState, setCrowdloanState] = useState(initialCrowdloanState);
  const [walletVisible, setWalletVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [contributeType, setContributeType] = useState(CONTRIBUTE_TYPE.STANDARD);
  const [termsState, setTermsState] = useState(TERMS_STATE.HIDDEN);

  const value = useMemo(() => ({
    wallet,
    setWallet,
    wallets,
    setWallets,
    balance,
    setBalance,
    xTokenBalance,
    setXTokenBalance,
    viewState,
    setViewState,
    isLoading,
    setIsLoading,
    selectWalletDialogVisible,
    setSelectWalletDialogVisible,
    milestone,
    setMilestone,
    promotionalMilestones,
    setPromotionalMilestones,
    isShowXTokenBalance,
    setIsShowXTokenBalance,
    crowdloanState,
    setCrowdloanState,
    walletVisible,
    setWalletVisible,
    user,
    setUser,
    contributeType,
    setContributeType,
    termsState,
    setTermsState,
  }), [
    wallet, setWallet, wallets, setWallets, balance, setBalance, xTokenBalance, setXTokenBalance, viewState, setViewState,
    isLoading, setIsLoading, selectWalletDialogVisible, setSelectWalletDialogVisible,
    milestone, setMilestone, promotionalMilestones, setPromotionalMilestones,
    isShowXTokenBalance, setIsShowXTokenBalance, crowdloanState, setCrowdloanState, walletVisible, setWalletVisible,
    user, setUser, contributeType, setContributeType, termsState, setTermsState,
  ]);

  return <CrowdloanContext.Provider value={value}>{children}</CrowdloanContext.Provider>;
}

CrowdloanContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string]).isRequired,
  initialState: PropTypes.string,
};

CrowdloanContextProvider.defaultProps = {
  initialState: undefined,
};

export const useCrowdloanContext = () => useContext(CrowdloanContext);

export default CrowdloanContext;

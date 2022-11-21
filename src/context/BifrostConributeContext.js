import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const BifrostContributeContext = React.createContext();

export const FORM_STATE = {
  TELEPORT: 'TELEPORT',
  CONTRIBUTE: 'CONTRIBUTE',
  CONTRIBUTION_STATUS: 'CONTRIBUTION_STATUS',
};

export function BifrostContributeContextProvider({ children }) {
  const [formState, setFormState] = useState(FORM_STATE.TELEPORT);
  const value = useMemo(() => ({
    formState,
    setFormState,
  }), [formState, setFormState]);
  return <BifrostContributeContext.Provider value={value}>{children}</BifrostContributeContext.Provider>;
}

BifrostContributeContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string]).isRequired,
};

export const useBifrostContributeContext = () => useContext(BifrostContributeContext);

export default BifrostContributeContext;

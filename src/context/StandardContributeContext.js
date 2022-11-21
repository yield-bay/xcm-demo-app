import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const StandardContributeContext = React.createContext();

export const FORM_STATE = {
  CONTRIBUTE: 'CONTRIBUTE',
  CONTRIBUTION_STATUS: 'CONTRIBUTION_STATUS',
};

export function StandardContributeContextProvider({ children }) {
  const [formState, setFormState] = useState(FORM_STATE.CONTRIBUTE);
  const value = useMemo(() => ({
    formState,
    setFormState,
  }), [formState, setFormState]);
  return <StandardContributeContext.Provider value={value}>{children}</StandardContributeContext.Provider>;
}

StandardContributeContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string]).isRequired,
};

export const useStandardContributeContext = () => useContext(StandardContributeContext);

export default StandardContributeContext;

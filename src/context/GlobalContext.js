import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

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
  const [themeDark, setThemeDark] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [visibleOffCanvas, setVisibleOffCanvas] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidthMode, setScreenWidthMode] = useState(SCREEN_WIDTH_MODE.LG);

  const [header, setHeader] = useState({
    theme: 'light',
    variant: 'primary',
    align: 'left',
    isFluid: false,
    button: 'cta', // cta, account, null
  });

  const toggleVideoModal = useCallback(() => setVideoModalVisible(!videoModalVisible), [videoModalVisible]);
  const toggleOffCanvas = useCallback(() => setVisibleOffCanvas(!visibleOffCanvas), [visibleOffCanvas]);
  const closeOffCanvas = useCallback(() => setVisibleOffCanvas(false), []);

  const value = useMemo(() => ({
    themeDark,
    setThemeDark,
    videoModalVisible,
    toggleVideoModal,
    visibleOffCanvas,
    toggleOffCanvas,
    closeOffCanvas,
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
    themeDark, setThemeDark, videoModalVisible, toggleVideoModal, visibleOffCanvas, toggleOffCanvas, closeOffCanvas,
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

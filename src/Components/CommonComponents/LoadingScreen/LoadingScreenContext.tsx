import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import { LoadingScreen } from './LoadingScreen';

type ContextType = {
  showLoadingScreen: () => void;
  hideLoadingScreen: () => void;
};

const initialState: ContextType = {
  showLoadingScreen: () => {},
  hideLoadingScreen: () => {},
};

const LoadingScreenContext = createContext<ContextType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const LoadingScreenContextProvider: React.FC<PropsType> = props => {
  const [isVisible, setIsVisible] = useState(false);

  const showLoadingScreen = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  const hideLoadingScreen = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  return (
    <LoadingScreenContext.Provider value={{ showLoadingScreen, hideLoadingScreen }}>
      {props.children}
      {isVisible && <LoadingScreen />}
    </LoadingScreenContext.Provider>
  );
};

export function useLoadingScreen() {
  const context = useContext(LoadingScreenContext);

  if (!context) {
    throw new Error('LoadingScreenContext not defined');
  }

  return context;
}

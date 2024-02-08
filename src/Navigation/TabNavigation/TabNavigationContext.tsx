import { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import React from 'react';

import { CommonActions, useNavigation } from '@react-navigation/native';

export enum TabName {
  Server = 'Server',
  Home = 'Home',
  Settings = 'Settings',
}

type ContextType = {
  focusedTab: TabName;
  navigateTo: (tabName: TabName) => void;
  hidden: boolean;
  hideTab: () => void;
  showTab: () => void;
  resetFocusedTab: () => void;
};

const TabNavigationContext = createContext<ContextType | undefined>(undefined);

const TabNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigation = useNavigation();
  const [focusedTab, setFocusedTab] = useState(TabName.Home);
  const [hidden, setHidden] = useState(false);
  const hideTab = useCallback(() => setHidden(true), []);
  const showTab = useCallback(() => setHidden(false), []);

  const navigateTo = useCallback(
    (tabName: TabName) => {
      setFocusedTab(tabName);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: tabName }],
        }),
      );
    },
    [navigation],
  );

  const resetFocusedTab = useCallback(() => {
    setFocusedTab(TabName.Home);
  }, []);

  const value = {
    focusedTab: focusedTab,
    navigateTo: navigateTo,
    hidden: hidden,
    hideTab: hideTab,
    showTab: showTab,
    resetFocusedTab: resetFocusedTab,
  };

  return (
    <TabNavigationContext.Provider value={value}>{children}</TabNavigationContext.Provider>
  );
};

function useTabNavigationContext() {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw Error('TabNavigationContext can only be used inside TabNavigationContext');
  }
  return context;
}

export { TabNavigationProvider, useTabNavigationContext };

import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import React from 'react';

import { CommonActions, useNavigation } from '@react-navigation/native';

export enum TabName {
  Server = 'Server',
  Home = 'Home',
  Settings = 'Settings',
}

type TabNavigationContextType = {
  focusedTab: TabName;
  hidden: boolean;
};

type TabNavigationContextFunctionsType = {
  navigateTo: (tabName: TabName) => void;
  hideTab: () => void;
  showTab: () => void;
  resetFocusedTab: () => void;
};

const TabNavigationContext = createContext<TabNavigationContextType>({
  focusedTab: TabName.Home,
  hidden: false,
});
const TabNavigationFunctionsContext = createContext<TabNavigationContextFunctionsType>({
  navigateTo: () => {},
  hideTab: () => {},
  showTab: () => {},
  resetFocusedTab: () => {},
});

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

  const valueContext = useMemo(() => {
    return { focusedTab, hidden };
  }, [focusedTab, hidden]);

  const valueFunctions = useMemo(() => {
    return { navigateTo, hideTab, showTab, resetFocusedTab };
  }, [hideTab, navigateTo, resetFocusedTab, showTab]);

  return (
    <TabNavigationContext.Provider value={valueContext}>
      <TabNavigationFunctionsContext.Provider value={valueFunctions}>
        {children}
      </TabNavigationFunctionsContext.Provider>
    </TabNavigationContext.Provider>
  );
};

function useTabNavigationContext() {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw Error('TabNavigationContext can only be used inside TabNavigationProvider');
  }
  return context;
}

function useTabNavigationContextFunctions() {
  const context = useContext(TabNavigationFunctionsContext);
  if (!context) {
    throw Error('TabNavigationContext can only be used inside TabNavigationProvider');
  }
  return context;
}

export { TabNavigationProvider, useTabNavigationContext, useTabNavigationContextFunctions };

import { createContext, useCallback, useContext, useState } from 'react';
import React from 'react';

import { CommonActions, useNavigation } from '@react-navigation/native';

import { Tab } from '~/Navigation/Navigation';

type ContextType = {
  focusedTab: Tab;
  navigateTo: (tabName: Tab) => void;
  hidden: boolean;
  hideTab: () => void;
  showTab: () => void;
};

const TabNavigationContext = createContext<ContextType | undefined>(undefined);

const TabNavigationProvider = ({ children }: { children: any }) => {
  const navigation = useNavigation();
  const [focusedTab, setFocusedTab] = useState('Home');
  const [hidden, setHidden] = useState(false);
  const hideTab = useCallback(() => setHidden(true), []);
  const showTab = useCallback(() => setHidden(false), []);

  const navigateTo = useCallback(
    (tabName: Tab) => {
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

  const value = {
    focusedTab: focusedTab,
    navigateTo: navigateTo,
    hidden: hidden,
    hideTab: hideTab,
    showTab: showTab,
  };

  return (
    <TabNavigationContext.Provider value={value}>{children}</TabNavigationContext.Provider>
  );
};

function useTabNavigationContext() {
  const context = useContext(TabNavigationContext);
  if (!context) throw Error('TabNavigationContext can only be used inside an ServerProvider');
  return context;
}

export { TabNavigationProvider, useTabNavigationContext };

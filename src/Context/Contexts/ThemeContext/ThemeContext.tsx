import React, { ReactNode, createContext, useContext } from 'react';

import {
  StatePersistentDefaultValue,
  StatePersistentType,
  useStatePersistent,
} from '~/Hooks/useStatePersistent';

export type userThemeTypes = 'light' | 'dark' | 'deviceDefault';

export type ThemeContextType = {
  userSelectedThemeState: StatePersistentType<userThemeTypes>;
};

const ThemeContextInitialValue: ThemeContextType = {
  userSelectedThemeState: StatePersistentDefaultValue('deviceDefault'),
};

const ThemeContext = createContext<ThemeContextType>(ThemeContextInitialValue);

type PropsType = {
  children: ReactNode;
};

export const ThemeContextProvider: React.FC<PropsType> = props => {
  const userSelectedThemeState = useStatePersistent<userThemeTypes>(
    'deviceDefault',
    'ASYNC_STORAGE_USER_SELECTED_THEME',
  );

  return (
    <ThemeContext.Provider value={{ userSelectedThemeState }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export function useThemeContextInner(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('Theme Context not defined');
  }

  return context;
}

import React from 'react';
import { StatusBar } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { ConfigModules } from '~/Config/configModules';
import { AuthContextProvider } from '~/Context/Contexts/AuthContext';
import { ThemeContextProvider } from '~/Context/Contexts/ThemeContext';
import MainContextEffects from '~/Context/MainContextEffects';
import { ContextProvider } from '~/Context/MainContextProvider';
import { store } from '~/Context/ReduxStore/Store';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  ConfigModules();
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <ContextProvider>
          <MainContextEffects>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaProvider>
                <ThemeContextProvider>
                  <StatusBar backgroundColor={'transparent'} translucent />
                  <Navigation />
                </ThemeContextProvider>
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </MainContextEffects>
        </ContextProvider>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;

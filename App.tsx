import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { ConfigModules } from '~/Config/configModules';
import MainContextEffects from '~/Context/MainContextEffects';
import { ContextProvider } from '~/Context/MainContextProvider';
import { store } from '~/Context/ReduxStore/Store';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  ConfigModules();
  return (
    <Provider store={store}>
      <ContextProvider>
        <MainContextEffects>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <Navigation />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </MainContextEffects>
      </ContextProvider>
    </Provider>
  );
}

export default App;

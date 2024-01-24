import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainContextEffects from '~/Context/MainContextEffects';
import { ContextProvider } from '~/Context/MainContextProvider';
import { ConfigModules } from '~/Global/configModules';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  ConfigModules();
  return (
    <ContextProvider>
      <MainContextEffects>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </MainContextEffects>
    </ContextProvider>
  );
}

export default App;

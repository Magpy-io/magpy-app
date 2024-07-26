import React from 'react';
import { StatusBar } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import { PopupMessageModalContextProvider } from '~/Components/CommonComponents/PopupMessageModal/PopupMessageModalContext';
import { ConfigModules } from '~/Config/configModules';
import { ThemeContextProvider } from '~/Context/Contexts/ThemeContext';
import { GlobalContexts } from '~/Context/GlobalContexts';
import { GlobalEffects } from '~/Context/GlobalEffects';
import { store } from '~/Context/ReduxStore/Store';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  ConfigModules();
  return (
    <Provider store={store}>
      <GlobalContexts>
        <GlobalEffects>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <ThemeContextProvider>
                <PopupMessageModalContextProvider>
                  <StatusBar backgroundColor={'transparent'} translucent />
                  <Navigation />
                  <Toast />
                </PopupMessageModalContextProvider>
              </ThemeContextProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </GlobalEffects>
      </GlobalContexts>
    </Provider>
  );
}

export default App;

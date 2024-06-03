import React from 'react';
import { StatusBar } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { ConfigModules } from '~/Config/configModules';
import { AuthContextProvider } from '~/Context/Contexts/AuthContext';
import { BackgroundServiceContextProvider } from '~/Context/Contexts/BackgroundServiceContext';
import { LocalServersContextProvider } from '~/Context/Contexts/LocalServersContext';
import { PhotosDownloadingContextProvider } from '~/Context/Contexts/PhotosDownloadingContext/PhotosDownloadingContext';
import { ServerClaimContextProvider } from '~/Context/Contexts/ServerClaimContext';
import { ServerContextProvider } from '~/Context/Contexts/ServerContext';
import { ThemeContextProvider } from '~/Context/Contexts/ThemeContext';
import MainContextEffects from '~/Context/MainContextEffects';
import { store } from '~/Context/ReduxStore/Store';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  ConfigModules();
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <LocalServersContextProvider>
          <BackgroundServiceContextProvider>
            <ServerClaimContextProvider>
              <ServerContextProvider>
                <PhotosDownloadingContextProvider>
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
                </PhotosDownloadingContextProvider>
              </ServerContextProvider>
            </ServerClaimContextProvider>
          </BackgroundServiceContextProvider>
        </LocalServersContextProvider>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;

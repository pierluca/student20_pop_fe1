import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';

import { Provider } from 'react-redux';
import { storeInit } from './Store/configureStore';

import AppNavigation from './Navigation/AppNavigation';

/*
* The starting point of the app
*
* It opens the navigation component in a safeAreaProvider to be able use
* SafeAreaView in order to resolve issue with status bar
*
*  The Platform.OS is to put the statusBar in IOS in black, otherwise it is not readable
*/

export default function App() {
  const { store, persistor } = storeInit();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <SafeAreaProvider>
            {Platform.OS === 'ios'
            && <StatusBar barStyle="dark-content" backgroundColor="white" />}
            <AppNavigation />
          </SafeAreaProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

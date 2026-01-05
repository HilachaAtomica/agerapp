import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
//import BootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
//import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

import Screens from './src/screens/root';
import AppointmentInformationModal from './src/components/modals/appointment-information-modal';
import {
  appointmentInformationModalRef,
} from './src/utils/utils.global';
import store from './src/redux/store';
import {Provider} from 'react-redux';
import {useOnesignal} from './src/hooks/hooks.onesignal';

const App = () => {
  /*useEffect(() => {
    BootSplash.hide();
  }, []);*/

  // Inicializar OneSignal
  useOnesignal({ isEnabled: true });

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider style={[styles.safeAreaProvider]}>
          <Screens />
          <AppointmentInformationModal ref={appointmentInformationModalRef} />
        </SafeAreaProvider>
      </Provider>
      <Toast />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
  },
});

export default App;

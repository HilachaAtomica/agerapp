import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
//import BootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
//import { Provider } from 'react-redux';

import Screens from './src/screens/root';
import AppointmentInformationModal from './src/components/modals/appointment-information-modal';
import {appointmentInformationModalRef} from './src/utils/utils.global';
import store from './src/redux/store';
import {Provider} from 'react-redux';

const App = () => {
  /*useEffect(() => {
    BootSplash.hide();
  }, []);*/

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider style={[styles.safeAreaProvider]}>
          <Screens />
          <AppointmentInformationModal ref={appointmentInformationModalRef} />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
  },
});

export default App;

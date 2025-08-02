import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppNavigation, {AppTabParamList} from '../navigation/navigation.app';
import AuthNavigation, {
  AuthStackParamList,
} from '../navigation/navigation.auth';
import {navigationRef} from '../utils/utils.navigation';

export type RootStackParamList = {
  Auth: {
    screen?: keyof AuthStackParamList;
    params?: AuthStackParamList['Login'];
  };
  App: {
    screen?: keyof AppTabParamList;
    params?:
      | AppTabParamList['Home']
      | AppTabParamList['Account']
      | AppTabParamList['Calendar'];
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  //useOnesignal({ isEnabled: true });

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName={'Auth'}
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen component={AuthNavigation} name="Auth" />

        <RootStack.Screen component={AppNavigation} name="App" />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;

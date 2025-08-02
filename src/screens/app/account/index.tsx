import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Settings from './settings';
import AppointmentHistory from './appointment-history';

export type AccountParamList = {
  Settings: undefined;
  AppointmentHistory: undefined;
};

const AccountStack = createNativeStackNavigator<AccountParamList>();

const AccountNavigation = () => {
  return (
    <AccountStack.Navigator
      initialRouteName="Settings"
      screenOptions={{headerShown: false}}>
      <AccountStack.Screen component={Settings} name="Settings" />
      <AccountStack.Screen
        component={AppointmentHistory}
        name="AppointmentHistory"
      />
    </AccountStack.Navigator>
  );
};

export default AccountNavigation;

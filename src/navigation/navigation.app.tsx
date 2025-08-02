import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Text from '../components/ui/text';
import AppIcon, {IconNameProp} from '../components/icons';
import {useColors} from '../hooks/hook.color';

import Home from '../screens/app/home';
import Calendar from '../screens/app/calendar';
import Account from '../screens/app/account';

export type AppTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Account: undefined;
};

const AppTab = createBottomTabNavigator<AppTabParamList>();

const AppNavigation = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <AppTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          height: 55,
          paddingBottom: 0,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.lightGrey,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      <AppTab.Screen
        component={Home}
        name="Home"
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({focused, color}) => (
            <AppIcon
              size={24}
              name={focused ? ('homeFilled' as IconNameProp) : 'home'}
              color={color}
            />
          ),
          tabBarButton: props => <Pressable {...props} />,
        }}
      />

      <AppTab.Screen
        component={Calendar}
        name="Calendar"
        options={{
          tabBarLabel: 'Calendario',
          tabBarIcon: ({focused, color}) => (
            <AppIcon
              size={24}
              name={focused ? ('calendarFilled' as IconNameProp) : 'calendar'}
              color={color}
            />
          ),
          tabBarButton: props => <Pressable {...props} />,
        }}
      />

      <AppTab.Screen
        component={Account}
        name="Account"
        options={{
          tabBarLabel: 'Cuenta',
          tabBarIcon: ({focused, color}) => (
            <AppIcon
              size={24}
              name={focused ? ('accountFilled' as IconNameProp) : 'account'}
              color={color}
            />
          ),
          tabBarButton: props => <Pressable {...props} />,
        }}
      />
    </AppTab.Navigator>
  );
};

export default AppNavigation;

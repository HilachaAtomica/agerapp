import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppNavigation, {AppTabParamList} from '../navigation/navigation.app';
import AuthNavigation, {
  AuthStackParamList,
} from '../navigation/navigation.auth';
import {navigationRef} from '../utils/utils.navigation';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN_KEY} from '../constants/constants.api';
import {ActivityIndicator, View} from 'react-native';
import {useColors} from '../hooks/hook.color';
import AttachmentsScreen from './app/attachments';
import {ArchivoVisible} from '../models/calendar';

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
  Attachments: {
    archivosVisibles?: ArchivoVisible[];
    archivosFotos?: ArchivoVisible[];
    archivosPresupuestos?: ArchivoVisible[];
    citaId?: number;
    isDoneFromHistory?: boolean;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] =
    useState<keyof RootStackParamList>('Auth');

  //useOnesignal({ isEnabled: true });

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        console.log('Checking auth token on app start:', token);

        if (token && token.trim()) {
          setInitialRouteName('App');
        } else {
          setInitialRouteName('Auth');
        }
      } catch (error) {
        console.error('Error checking auth token:', error);
        setInitialRouteName('Auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.primary,
        }}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen component={AuthNavigation} name="Auth" />
        <RootStack.Screen component={AppNavigation} name="App" />
        <RootStack.Screen component={AttachmentsScreen} name="Attachments" />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;

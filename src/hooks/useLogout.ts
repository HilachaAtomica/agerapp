import {useCallback} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN_KEY} from '../constants/constants.api';
import * as NavigationUtil from '../utils/utils.navigation';

export const useLogout = () => {
  const logout = useCallback(async (showConfirmation = true) => {
    const performLogout = async () => {
      try {
        // Eliminar el token del AsyncStorage
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);

        // Limpiar otros datos si es necesario
        // await AsyncStorage.multiRemove(['@user/profile', '@app/settings']); // Ejemplo

        // Navegar de vuelta a la pantalla de login
        NavigationUtil.reset({
          index: 0,
          routes: [{name: 'Auth', params: {screen: 'Login'}}],
        });

        console.log('Logout successful');
      } catch (error) {
        console.error('Error during logout:', error);
        Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
      }
    };

    if (showConfirmation) {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Cerrar sesión',
            style: 'destructive',
            onPress: performLogout,
          },
        ],
      );
    } else {
      await performLogout();
    }
  }, []);

  return {logout};
};

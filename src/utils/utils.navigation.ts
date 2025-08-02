import {createNavigationContainerRef} from '@react-navigation/core';
import {RootStackParamList} from '../screens/root';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate = navigationRef.navigate;
export const goBack = navigationRef.goBack;
export const addListener = navigationRef.addListener;
export const reset = navigationRef.reset;

export default {
  navigate,
  goBack,
  reset,
  addListener,
};

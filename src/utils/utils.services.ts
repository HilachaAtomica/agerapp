import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ACCESS_TOKEN_KEY, API_URL} from '../constants/constants.api';
import * as NavigationUtil from './utils.navigation';

const baseQueryWithAuth = (scope?: string) =>
  fetchBaseQuery({
    baseUrl: scope?.trim() ? `${API_URL}${scope?.trim()}` : API_URL,
    prepareHeaders: async (headers: Headers) => {
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      headers.set('Accept', 'application/json');
      console.log('accessToken', accessToken);
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return headers;
    },
  });

export const baseQuery = (scope?: string) => {
  const baseQueryFn = baseQueryWithAuth(scope);

  return async (args: any, api: any, extraOptions: any) => {
    const result = await baseQueryFn(args, api, extraOptions);

    // Si el token ha expirado (401), limpiar el storage y redirigir al login
    if (result.error && result.error.status === 401) {
      console.log('Token expired, redirecting to login');
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      NavigationUtil.reset({
        index: 0,
        routes: [{name: 'Auth', params: {screen: 'Login'}}],
      });
    }

    return result;
  };
};

const baseQueryFormDataWithAuth = (scope?: string) =>
  fetchBaseQuery({
    baseUrl: scope?.trim() ? `${API_URL}${scope?.trim()}` : API_URL,
    prepareHeaders: async (headers: Headers) => {
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'multipart/form-data');
      if (accessToken?.trim()) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

export const baseQueryFormData = (scope?: string) => {
  const baseQueryFn = baseQueryFormDataWithAuth(scope);

  return async (args: any, api: any, extraOptions: any) => {
    const result = await baseQueryFn(args, api, extraOptions);

    // Si el token ha expirado (401), limpiar el storage y redirigir al login
    if (result.error && result.error.status === 401) {
      console.log('Token expired, redirecting to login');
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      NavigationUtil.reset({
        index: 0,
        routes: [{name: 'Auth', params: {screen: 'Login'}}],
      });
    }

    return result;
  };
};

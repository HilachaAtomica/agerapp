import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ACCESS_TOKEN_KEY, API_URL} from '../constants/constants.api';

export const baseQuery = (scope?: string) =>
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

export const baseQueryFormData = (scope?: string) =>
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

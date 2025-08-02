import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import {useDispatch, useSelector} from 'react-redux';
import {authApi} from './services/service.auth';
import {calendarApi} from './services/service.calendar';

// Configuración del store
export const store = configureStore({
  reducer: combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
  }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware, calendarApi.middleware),
});

// Configuración de listeners
setupListeners(store.dispatch);

// Inferir tipos del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks personalizados
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector;
export type AppState = ReturnType<typeof store.getState>;

export default store;

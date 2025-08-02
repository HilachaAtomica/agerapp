import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from '../../utils/utils.services';
import {Appointment, AppointmentDetail} from '../../models/calendar';

export const calendarApi = createApi({
  reducerPath: 'calendarApi',
  baseQuery: baseQuery('/cita'),
  tagTypes: ['Calendar', 'Appointment'],
  endpoints: builder => ({
    getDaysWithAppointments: builder.query<
      string[],
      {desde: string; hasta: string}
    >({
      query: ({desde, hasta}) =>
        `diasConCitasCalendario?desde=${desde}&hasta=${hasta}`,
      providesTags: ['Calendar'],
    }),
    getAppointmentsByDay: builder.query<Appointment[], string>({
      query: dia => `citasCalendarioPorDia?dia=${dia}`,
      providesTags: ['Appointment'],
    }),
    getAppointmentInfo: builder.query<AppointmentDetail, number>({
      query: expedienteId => `infoCitaOperario/${expedienteId}`,
      providesTags: ['Appointment'],
    }),
    getUpcomingAppointments: builder.query<Appointment[], void>({
      query: () => 'proximasCitas',
      providesTags: ['Appointment'],
    }),
    getPendingAppointments: builder.query<Appointment[], void>({
      query: () => 'citasPendientesCerrar',
      providesTags: ['Appointment'],
    }),
    getAppointmentsHistory: builder.query<
      Appointment[],
      {offset: number; limit: number}
    >({
      query: ({offset, limit}) =>
        `citasHistorial?offset=${offset}&limit=${limit}`,
      providesTags: ['Appointment'],
    }),
  }),
});

export const {
  useGetDaysWithAppointmentsQuery,
  useGetAppointmentsByDayQuery,
  useGetAppointmentInfoQuery,
  useGetUpcomingAppointmentsQuery,
  useGetPendingAppointmentsQuery,
  useGetAppointmentsHistoryQuery,
} = calendarApi;

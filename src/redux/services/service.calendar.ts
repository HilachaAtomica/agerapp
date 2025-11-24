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
      query: citaId => `infoCitaOperario/${citaId}`,
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
    // POST endpoints para subir archivos
    uploadBudget: builder.mutation<any, {citaId: number; files: FormData}>({
      query: ({citaId, files}) => ({
        url: `subirPresupuesto/${citaId}`,
        method: 'POST',
        body: files,
      }),
      invalidatesTags: ['Appointment'],
    }),
    uploadSignatures: builder.mutation<any, {citaId: number; files: FormData}>({
      query: ({citaId, files}) => ({
        url: `subirFirmas/${citaId}`,
        method: 'POST',
        body: files,
      }),
      invalidatesTags: ['Appointment'],
    }),
    uploadComments: builder.mutation<any, {citaId: number; texto: string}>({
      query: ({citaId, texto}) => ({
        url: `subirComentarios/${citaId}?texto=${encodeURIComponent(texto)}`,
        method: 'POST',
      }),
      invalidatesTags: ['Appointment'],
    }),
    uploadPhotos: builder.mutation<any, {citaId: number; files: FormData}>({
      query: ({citaId, files}) => ({
        url: `subirFotos/${citaId}`,
        method: 'POST',
        body: files,
      }),
      invalidatesTags: ['Appointment'],
    }),
    closeCita: builder.mutation<any, number>({
      query: citaId => ({
        url: `cerrarCita/${citaId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Appointment'],
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
  useUploadBudgetMutation,
  useUploadSignaturesMutation,
  useUploadCommentsMutation,
  useUploadPhotosMutation,
  useCloseCitaMutation,
} = calendarApi;

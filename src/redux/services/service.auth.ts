import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from '../../utils/utils.services';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery('/auth'),
  endpoints: builder => ({
    login: builder.mutation<any, any>({
      query: body => ({
        url: '/login',
        method: 'POST',
        body: {
          ...body,
        },
      }),
    }),
  }),
});

export const {useLoginMutation} = authApi;

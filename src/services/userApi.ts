// src/services/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type User = {
	id: number;
	name: string;
	email: string;
	phone: string;
	company: {
		name: string;
	};
};

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/'  }),
	endpoints: (builder) => ({
		getUsers: builder.query<User[], void>({
			query: () => `/users`,
			keepUnusedDataFor: 60 * 5,
		}),
		getUserById: builder.query<User, number>({
			query: (id) => `/users/${id}`,
		}),
	}),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;

export const { usePrefetch } = userApi;
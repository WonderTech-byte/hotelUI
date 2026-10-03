import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import type {
  AuthResponse, LoginRequest, RegisterRequest, MessageResponse,
  Room, Booking, BookingRequest, User, UserType
} from '../types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL || '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Room', 'Booking', 'User'],
  endpoints: (builder) => ({

    // ─── AUTH ───────────────────────────────────────────────
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    forgotPassword: builder.mutation<MessageResponse, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<MessageResponse, { token: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    // ─── ROOMS ──────────────────────────────────────────────
    getAllRooms: builder.query<Room[], void>({
      query: () => '/rooms',
      providesTags: ['Room'],
    }),
    getAvailableRooms: builder.query<Room[], void>({
      query: () => '/rooms/available',
      providesTags: ['Room'],
    }),
    getRoomById: builder.query<Room, number>({
      query: (id) => `/rooms/${id}`,
      providesTags: ['Room'],
    }),
    createRoom: builder.mutation<Room, FormData>({
      query: (body) => ({ url: '/rooms', method: 'POST', body }),
      invalidatesTags: ['Room'],
    }),
    updateRoom: builder.mutation<Room, { id: number; data: Partial<Room> }>({
      query: ({ id, data }) => ({ url: `/rooms/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Room'],
    }),
    deleteRoom: builder.mutation<void, number>({
      query: (id) => ({ url: `/rooms/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Room'],
    }),
    addRoomImage: builder.mutation<Room, { roomId: number; formData: FormData }>({
      query: ({ roomId, formData }) => ({ url: `/rooms/${roomId}/images`, method: 'POST', body: formData }),
      invalidatesTags: ['Room'],
    }),
    deleteRoomImage: builder.mutation<Room, { roomId: number; imageUrl: string }>({
      query: ({ roomId, imageUrl }) => ({ url: `/rooms/${roomId}/images?imageUrl=${encodeURIComponent(imageUrl)}`, method: 'DELETE' }),
      invalidatesTags: ['Room'],
    }),
    addRoomFeature: builder.mutation<Room, { roomId: number; formData: FormData }>({
      query: ({ roomId, formData }) => ({ url: `/rooms/${roomId}/features`, method: 'POST', body: formData }),
      invalidatesTags: ['Room'],
    }),

    // ─── BOOKINGS ───────────────────────────────────────────
    createBooking: builder.mutation<Booking, BookingRequest>({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: ['Booking', 'Room'],
    }),
    getMyBookings: builder.query<Booking[], void>({
      query: () => '/bookings/my',
      providesTags: ['Booking'],
    }),
    getAllBookings: builder.query<Booking[], void>({
      query: () => '/bookings',
      providesTags: ['Booking'],
    }),
    getBookingByCode: builder.query<Booking, string>({
      query: (code) => `/bookings/${code}`,
      providesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation<Booking, number>({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: ['Booking', 'Room'],
    }),
    checkIn: builder.mutation<Booking, string>({
      query: (bookingCode) => ({ url: `/bookings/${bookingCode}/checkin`, method: 'PATCH' }),
      invalidatesTags: ['Booking', 'Room'],
    }),
    checkOut: builder.mutation<Booking, string>({
      query: (bookingCode) => ({ url: `/bookings/${bookingCode}/checkout`, method: 'PATCH' }),
      invalidatesTags: ['Booking', 'Room'],
    }),

    // ─── USERS (ADMIN) ──────────────────────────────────────
    getAllUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    getUsersByType: builder.query<User[], UserType>({
      query: (type) => `/users/type/${type}`,
      providesTags: ['User'],
    }),
    deactivateUser: builder.mutation<User, number>({
      query: (id) => ({ url: `/users/${id}/deactivate`, method: 'PATCH' }),
      invalidatesTags: ['User'],
    }),
    activateUser: builder.mutation<User, number>({
      query: (id) => ({ url: `/users/${id}/activate`, method: 'PATCH' }),
      invalidatesTags: ['User'],
    }),
    promoteToAdmin: builder.mutation<User, number>({
      query: (id) => ({ url: `/users/${id}/promote/admin`, method: 'PATCH' }),
      invalidatesTags: ['User'],
    }),
    promoteToFrontDesk: builder.mutation<User, number>({
      query: (id) => ({ url: `/users/${id}/promote/front-desk`, method: 'PATCH' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation,
  useGetAllRoomsQuery, useGetAvailableRoomsQuery, useGetRoomByIdQuery,
  useCreateRoomMutation, useUpdateRoomMutation, useDeleteRoomMutation,
  useAddRoomImageMutation, useDeleteRoomImageMutation, useAddRoomFeatureMutation,
  useCreateBookingMutation, useGetMyBookingsQuery, useGetAllBookingsQuery,
  useGetBookingByCodeQuery, useCancelBookingMutation, useCheckInMutation, useCheckOutMutation,
  useGetAllUsersQuery, useGetUserByIdQuery, useGetUsersByTypeQuery,
  useDeactivateUserMutation, useActivateUserMutation,
  usePromoteToAdminMutation, usePromoteToFrontDeskMutation,
} = api;

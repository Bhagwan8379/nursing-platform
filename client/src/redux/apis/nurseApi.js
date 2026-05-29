import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const nurseApi = createApi({
    reducerPath: "nurseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL || "/api",
        credentials: "include"
    }),
    tagTypes: ["NurseProfile", "NurseBookings"],
    endpoints: (builder) => ({
        getNurseInfo: builder.query({
            query: () => "/nurse/info-nurse-info",
            providesTags: ["NurseProfile"]
        }),
        createNurseInfo: builder.mutation({
            query: (formData) => ({
                url: "/nurse/create-nurse-info",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["NurseProfile"]
        }),
        updateNurseInfo: builder.mutation({
            query: (formData) => ({
                url: "/nurse/update-nurse-info",
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["NurseProfile"]
        }),
        updateAvailability: builder.mutation({
            query: ({ availabilityStatus }) => ({
                url: "/nurse/update-availability",
                method: "PUT",
                body: { availabilityStatus }
            }),
            invalidatesTags: ["NurseProfile"]
        }),
        updateNursePassword: builder.mutation({
            query: (passwordData) => ({
                url: "/nurse/update-password",
                method: "PUT",
                body: passwordData
            })
        }),

        // Booking interactions
        getNurseBookings: builder.query({
            query: () => "/booking/get-nurse-bookings",
            providesTags: ["NurseBookings"]
        }),
        acceptBooking: builder.mutation({
            query: (bookingId) => ({
                url: `/booking/accept-booking/${bookingId}`,
                method: "PUT"
            }),
            invalidatesTags: ["NurseBookings"]
        }),
        declineBooking: builder.mutation({
            query: ({ bookingId, reason }) => ({
                url: `/booking/decline-booking/${bookingId}`,
                method: "PUT",
                body: { reason }
            }),
            invalidatesTags: ["NurseBookings"]
        }),
        updateBookingStatus: builder.mutation({
            query: ({ bookingId, status }) => ({
                url: `/booking/update-status/${bookingId}`,
                method: "PUT",
                body: { status }
            }),
            invalidatesTags: ["NurseBookings", "NurseProfile"]
        }),

        // Reviews
        getNurseReviews: builder.query({
            query: (nurseId) => `/review/get-nurse-review/${nurseId}`,
            providesTags: ["NurseBookings"]
        })
    })
})

export const {
    useGetNurseInfoQuery,
    useCreateNurseInfoMutation,
    useUpdateNurseInfoMutation,
    useUpdateAvailabilityMutation,
    useUpdateNursePasswordMutation,
    useGetNurseBookingsQuery,
    useAcceptBookingMutation,
    useDeclineBookingMutation,
    useUpdateBookingStatusMutation,
    useGetNurseReviewsQuery
} = nurseApi

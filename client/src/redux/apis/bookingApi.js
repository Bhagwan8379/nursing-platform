import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL || "/api",
        credentials: "include"
    }),
    tagTypes: ["CustomerBookings", "CustomerPayments", "PublicServices", "CustomerProfile", "Milestones", "Testimonials"],
    endpoints: (builder) => ({
        // Feedback endpoints
        submitFeedback: builder.mutation({
            query: (feedbackData) => ({
                url: "/feedback/submit",
                method: "POST",
                body: feedbackData
            }),
            invalidatesTags: ["Testimonials"]
        }),
        getPublicTestimonials: builder.query({
            query: () => "/feedback/testimonials",
            providesTags: ["Testimonials"]
        }),

        // Catalog services
        getAllServices: builder.query({
            query: () => "/service/get-all-services",
            providesTags: ["PublicServices"]
        }),
        getSingleService: builder.query({
            query: (serviceId) => `/service/get-single-service/${serviceId}`,
            providesTags: ["PublicServices"]
        }),
        getMilestones: builder.query({
            query: () => "/milestones",
            providesTags: ["Milestones"]
        }),

        // Customer Profile
        getCustomerInfo: builder.query({
            query: () => "/customer/get-customer-info",
            providesTags: ["CustomerProfile"]
        }),
        updateCustomerInfo: builder.mutation({
            query: (customerData) => ({
                url: "/customer/update-cutomer-info",
                method: "PUT",
                body: customerData
            }),
            invalidatesTags: ["CustomerProfile"]
        }),
        updateCustomerPassword: builder.mutation({
            query: (passwordData) => ({
                url: "/customer/update-password",
                method: "PUT",
                body: passwordData
            })
        }),

        // Booking operations
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: "/booking/create-booking",
                method: "POST",
                body: bookingData
            }),
            invalidatesTags: ["CustomerBookings"]
        }),
        getMyBookings: builder.query({
            query: () => "/booking/get-my-bookings",
            providesTags: ["CustomerBookings"]
        }),
        getSingleBooking: builder.query({
            query: (bookingId) => `/booking/get-single-booking/${bookingId}`,
            providesTags: ["CustomerBookings"]
        }),
        cancelBooking: builder.mutation({
            query: ({ bookingId, cancellationReason }) => ({
                url: `/booking/cancel/${bookingId}`,
                method: "PUT",
                body: { cancellationReason }
            }),
            invalidatesTags: ["CustomerBookings"]
        }),

        // Payments
        createPaymentOrder: builder.mutation({
            query: ({ bookingId }) => ({
                url: "/payment/create-order",
                method: "POST",
                body: { bookingId }
            }),
            invalidatesTags: ["CustomerPayments"]
        }),
        verifyPayment: builder.mutation({
            query: (paymentDetails) => ({
                url: "/payment/verify-payment",
                method: "POST",
                body: paymentDetails
            }),
            invalidatesTags: ["CustomerBookings", "CustomerPayments"]
        }),
        getMyPayments: builder.query({
            query: () => "/payment/get-my-payment",
            providesTags: ["CustomerPayments"]
        })
    })
})

export const {
    useGetAllServicesQuery,
    useGetSingleServiceQuery,
    useGetCustomerInfoQuery,
    useUpdateCustomerInfoMutation,
    useUpdateCustomerPasswordMutation,
    useCreateBookingMutation,
    useGetMyBookingsQuery,
    useGetSingleBookingQuery,
    useCancelBookingMutation,
    useCreatePaymentOrderMutation,
    useVerifyPaymentMutation,
    useGetMyPaymentsQuery,
    useGetMilestonesQuery,
    useSubmitFeedbackMutation,
    useGetPublicTestimonialsQuery
} = bookingApi


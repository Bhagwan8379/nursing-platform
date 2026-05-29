import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL || "/api",
        credentials: "include"
    }),
    tagTypes: ["Nurses", "Customers", "Bookings", "Services", "Payments"],
    endpoints: (builder) => ({
        // Nurses
        getAllNurses: builder.query({
            query: () => "/admin/nurses",
            providesTags: ["Nurses"]
        }),
        getPendingNurses: builder.query({
            query: () => "/admin/nurses/pending",
            providesTags: ["Nurses"]
        }),
        approveNurse: builder.mutation({
            query: (nurseId) => ({
                url: `/admin/nurses/approve/${nurseId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Nurses"]
        }),
        rejectNurse: builder.mutation({
            query: ({ nurseId, rejectionReason }) => ({
                url: `/admin/nurses/reject/${nurseId}`,
                method: "PUT",
                body: { rejectionReason }
            }),
            invalidatesTags: ["Nurses"]
        }),
        suspendNurse: builder.mutation({
            query: (nurseId) => ({
                url: `/admin/nurses/suspend/${nurseId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Nurses"]
        }),

        // Customers
        getAllCustomers: builder.query({
            query: () => "/admin/customers",
            providesTags: ["Customers"]
        }),
        blockCustomer: builder.mutation({
            query: (customerId) => ({
                url: `/admin/customers/block/${customerId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Customers"]
        }),
        unblockCustomer: builder.mutation({
            query: (customerId) => ({
                url: `/admin/customers/unblock/${customerId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Customers"]
        }),

        // Services CRUD
        createService: builder.mutation({
            query: (serviceData) => ({
                url: "/admin/services",
                method: "POST",
                body: serviceData
            }),
            invalidatesTags: ["Services"]
        }),
        updateService: builder.mutation({
            query: ({ serviceId, serviceData }) => ({
                url: `/admin/services/${serviceId}`,
                method: "PUT",
                body: serviceData
            }),
            invalidatesTags: ["Services"]
        }),
        deactivateService: builder.mutation({
            query: (serviceId) => ({
                url: `/admin/services/deactivate/${serviceId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Services"]
        }),
        activateService: builder.mutation({
            query: (serviceId) => ({
                url: `/admin/services/activate/${serviceId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Services"]
        }),

        // Bookings
        getAllBookings: builder.query({
            query: () => "/admin/get-all-bookings",
            providesTags: ["Bookings"]
        }),
        getAvailableNurses: builder.query({
            query: (bookingId) => `/admin/available-nurses/${bookingId}`,
            providesTags: ["Nurses"]
        }),
        assignNurse: builder.mutation({
            query: ({ bookingId, nurseId }) => ({
                url: `/admin/assign/${bookingId}`,
                method: "PUT",
                body: { nurseId }
            }),
            invalidatesTags: ["Bookings", "Nurses"]
        }),

        // Payments (Cash/Refund)
        confirmCashPayment: builder.mutation({
            query: (bookingId) => ({
                url: `/payment/cash-confirm/${bookingId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Bookings", "Payments"]
        }),
        refundPayment: builder.mutation({
            query: (bookingId) => ({
                url: `/payment/refund-payment/${bookingId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Bookings", "Payments"]
        })
    })
})

export const {
    useGetAllNursesQuery,
    useGetPendingNursesQuery,
    useApproveNurseMutation,
    useRejectNurseMutation,
    useSuspendNurseMutation,
    useGetAllCustomersQuery,
    useBlockCustomerMutation,
    useUnblockCustomerMutation,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeactivateServiceMutation,
    useActivateServiceMutation,
    useGetAllBookingsQuery,
    useGetAvailableNursesQuery,
    useAssignNurseMutation,
    useConfirmCashPaymentMutation,
    useRefundPaymentMutation
} = adminApi

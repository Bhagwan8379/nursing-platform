import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "/api"}/auth`,
        credentials: "include"
    }),
    tagTypes: ["authApi"],
    endpoints: (builder) => {
        return {

            loginPatient: builder.mutation({
                query: authData => {
                    return {
                        url: "/login-patient",
                        method: "POST",
                        body: authData
                    }
                },
                transformResponse: data => {
                    localStorage.setItem('patient', JSON.stringify(data.result))
                    return data.result
                },
                invalidatesTags: ["authApi"]
            }),

            loginAdmin: builder.mutation({
                query: authData => {
                    return {
                        url: "/login-admin",
                        method: "POST",
                        body: authData
                    }
                },
                transformResponse: data => {
                    localStorage.setItem('admin', JSON.stringify(data.result))
                    return data.result
                },
                invalidatesTags: ["authApi"]
            }),

            loginNurse: builder.mutation({
                query: authData => {
                    return {
                        url: "/login-nurse",
                        method: "POST",
                        body: authData
                    }
                },
                transformResponse: data => {
                    localStorage.setItem('nurse', JSON.stringify(data.result))
                    return data.result
                },
                invalidatesTags: ["authApi"]
            }),



            registerNurse: builder.mutation({
                query: authData => {
                    return {
                        url: "/register-nurse",
                        method: "POST",
                        body: authData
                    }
                },
                invalidatesTags: ["authApi"]
            }),

            registerPatient: builder.mutation({
                query: authData => {
                    return {
                        url: "/register-customer",
                        method: "POST",
                        body: authData
                    }
                },
                invalidatesTags: ["authApi"]
            }),



            logoutPatient: builder.mutation({
                query: authData => {
                    return {
                        url: "/logout-customer",
                        method: "POST",
                        body: authData
                    }
                },
                transformResponse: data => {
                    localStorage.removeItem('patient')
                    return data.result
                },
                invalidatesTags: ["authApi"]
            }),

            logoutNurse: builder.mutation({
                query: authData => {
                    return {
                        url: "/logout-nurse",
                        method: "POST",
                        body: authData
                    }
                },
                transformResponse: data => {
                    localStorage.removeItem('nurse')
                    return data.result
                },
                invalidatesTags: ["authApi"]
            }),

            logoutAdmin: builder.mutation({
                query: authData => {
                    return {
                        url: "/logout-admin",
                        method: "POST",
                        body: authData
                    }
                },
                transformResponse: data => {
                    localStorage.removeItem('admin')
                    return data.result
                },
                invalidatesTags: ["authApi"]
            }),




        }
    }
})

export const {
    useLoginAdminMutation,
    useLoginNurseMutation,
    useLoginPatientMutation,
    useRegisterNurseMutation,
    useRegisterPatientMutation,
    useLogoutAdminMutation,
    useLogoutNurseMutation,
    useLogoutPatientMutation
} = authApi

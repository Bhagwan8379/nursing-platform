import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        admin: JSON.parse(localStorage.getItem('admin')),
        patient: JSON.parse(localStorage.getItem('patient')),
        nurse: JSON.parse(localStorage.getItem('nurse')),
    },

    reducers: {
        logoutAdmin: (state, { payload }) => {
            localStorage.removeItem('admin')
            state.admin = null
        },
        logoutNurse: (state, { payload }) => {
            localStorage.removeItem('nurse')
            state.nurse = null
        },
        logoutPatient: (state, { payload }) => {
            localStorage.removeItem('patient')
            state.patient = null
        },
    },


    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.loginAdmin.matchFulfilled, (state, { payload }) => {
            state.admin = payload
        })
        .addMatcher(authApi.endpoints.loginNurse.matchFulfilled, (state, { payload }) => {
            state.nurse = payload
        })
        .addMatcher(authApi.endpoints.loginPatient.matchFulfilled, (state, { payload }) => {
            state.patient = payload
        })


        .addMatcher(authApi.endpoints.logoutAdmin.matchFulfilled, (state, { payload }) => {
            state.admin = null
        })
        .addMatcher(authApi.endpoints.logoutNurse.matchFulfilled, (state, { payload }) => {
            state.nurse = null
        })
        .addMatcher(authApi.endpoints.logoutPatient.matchFulfilled, (state, { payload }) => {
            state.patient = null
        })

})

export const {
    logoutAdmin, logoutNurse, logoutPatient
} = authSlice.actions
export default authSlice.reducer
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { adminApi } from "./apis/adminApi";
import { nurseApi } from "./apis/nurseApi";
import { bookingApi } from "./apis/bookingApi";
import authReducer, { logoutAdmin, logoutNurse, logoutPatient } from "./slice/authSlice";

const authErrorMiddleware = (store) => (next) => (action) => {
    if (action.type?.endsWith('/rejected') && action.payload?.status === 401) {
        store.dispatch(logoutAdmin())
        store.dispatch(logoutNurse())
        store.dispatch(logoutPatient())
        localStorage.removeItem('admin')
        localStorage.removeItem('nurse')
        localStorage.removeItem('patient')
    }
    return next(action)
}

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [nurseApi.reducerPath]: nurseApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        auth: authReducer,
    },
    middleware: def => [
        ...def(),
        authApi.middleware,
        adminApi.middleware,
        nurseApi.middleware,
        bookingApi.middleware,
        authErrorMiddleware
    ]
})

export default reduxStore
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { adminApi } from "./apis/adminApi";
import { nurseApi } from "./apis/nurseApi";
import { bookingApi } from "./apis/bookingApi";
import authReducer from "./slice/authSlice";


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
        bookingApi.middleware
    ]
})

export default reduxStore
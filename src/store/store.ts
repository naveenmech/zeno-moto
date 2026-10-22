import { configureStore } from "@reduxjs/toolkit";
import { zenoApi } from "./api";
import uiReducer from "./uiSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      [zenoApi.reducerPath]: zenoApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(zenoApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

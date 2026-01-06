import {configureStore, combineReducers} from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import modelSlice from "./slices/modelSlice"

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage   from "redux-persist/lib/storage";


const rootReducers = combineReducers({
    auth : authSlice,
    model : modelSlice,
})


const persistConfiguration = {
    key : 'prenup_root',
    storage,
    whitelist: ["auth"],
}

const persistedReducer = persistReducer(persistConfiguration, rootReducers)


export const Store = configureStore({
    reducer: persistedReducer,
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
})


export const persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
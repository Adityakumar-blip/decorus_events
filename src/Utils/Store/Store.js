import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthSlice from '../Slices/AuthSlice';
import UserSlice from '../Slices/UserSlice';
import ChatSlice from '../Slices/ChatSlice';

//Sattle persistConfig
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['navigation'],
};
const intialState = {};

const Reducer = combineReducers({
  AuthSlice: AuthSlice,
  UserSlice: UserSlice,
  ChatSlice: ChatSlice,
});

const persistedReducer = persistReducer(persistConfig, Reducer);
const store = configureStore({
  reducer: persistedReducer,
  preloadedState: intialState,
  middleware: [thunk],
});

export default store;

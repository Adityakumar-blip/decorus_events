import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('users');

const initialState = {
  allUsers: [],
};

export const GetAllUser = createAsyncThunk('GetAllUser', async () => {
  try {
    const usersSnapshot = await usersCollection.get();

    const usersData = usersSnapshot.docs.map(doc => doc.data());

    return usersData;
  } catch (error) {
    throw error;
  }
});

export const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(GetAllUser.fulfilled, (state, action) => {
      state.allUsers = action.payload;
    });
  },
});

export default UserSlice.reducer;

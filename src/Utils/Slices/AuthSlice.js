import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const usersCollection = firestore().collection('users');
const initialState = {
  session: undefined,
  user: undefined,
  tempConfirm: undefined,
};

export const ConfirmSignInWithPhone = createAsyncThunk(
  'ConfirmSignInWithPhone',
  async (values, {getState}) => {
    try {
      const state = getState();
      if (state?.AuthSlice?.tempConfirm) {
        const result = await state?.AuthSlice?.tempConfirm.confirm(values);
        return result;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);

export const Logout = createAsyncThunk('Logout', async () => {
  return await auth().signOut();
});
export const GetUser = createAsyncThunk('GetUser', async userId => {
  try {
    if (userId) {
      const querySnapShot = await usersCollection
        .where('userId', '==', userId)
        .get();
      if (!querySnapShot.empty) {
        return querySnapShot.docs[0].data();
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error(error);
  }
});
export const UpdateUser = createAsyncThunk('UpdateUser', async values => {
  try {
    const currentUser = auth().currentUser;
    const userId = currentUser.uid;
    const usersList = await usersCollection.where('userId', '==', userId).get();
    await auth().currentUser.updateProfile({
      displayName: values?.fullName
        ? values?.fullName
        : currentUser?.displayName,
      photoURL: values?.image,
    });

    if (!usersList.empty) {
      const userDoc = usersList.docs[0];
      await usersCollection.doc(userDoc.id).update(values);
      return await usersCollection.doc(userDoc.id).get();
    } else {
      const result = await usersCollection.add({...values, userId});
      return await result.get();
    }
  } catch (error) {
    console.error('error in creating user', error);
  }
});

export const loginUserWithEmail = createAsyncThunk(
  'getUser',
  async (values, {rejectWithValue}) => {
    try {
      const usersDoc = await usersCollection
        .where('email', '==', values.email)
        .get();

      if (!usersDoc.empty) {
        const user = usersDoc.docs[0].data();

        if (user.password === values.password) {
          return user;
        } else {
          console.log('Password not matched');
          return rejectWithValue('Incorrect password');
        }
      } else {
        console.log('No user found');
        return rejectWithValue('User not found');
      }
    } catch (error) {
      console.error('Error fetching user', error);
      return rejectWithValue('Failed to fetch user');
    }
  },
);

export const AuthSlice = createSlice({
  name: 'AuthSlice',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action?.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(GetUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(UpdateUser.fulfilled, (state, action) => {
      console.log('action.payloaf', action.payload);
      state.user = action.payload?._data;
    });
  },
});

export const {setSession} = AuthSlice.actions;
export default AuthSlice.reducer;

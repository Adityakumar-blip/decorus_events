import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const expenseCollection = firestore().collection('expenses');

const initialState = {
  payments: [],
};

export const PaymentsByRoom = createAsyncThunk(
  'PaymentsByRoom',
  async (values, {dispatch}) => {
    console.log('messages values at payment data', values);
    try {
      firestore()
        .collection(`${values.path}/payments`)
        .doc()
        .set({
          group: values.item.groupName,
          amount: values?.amount,
          createdAt: new Date(),
        })
        .then(() => {
          expenseCollection.doc(values.item.groupId).set({
            ...values.item,
          });
        })
        .catch(error => {
          console.log('Error is adding payments', error);
        });
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const GetAllPayments = createAsyncThunk(
  'GetAllPayments',
  async (values, {dispatch}) => {
    try {
      const groupCollection = expenseCollection.get();

      const paymentsArray = [];

      (await groupCollection).forEach(doc => {
        paymentsArray.push(doc.data());
      });

      return paymentsArray;
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const ExpenseSlice = createSlice({
  name: 'ExpenseSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(GetAllPayments.fulfilled, (state, action) => {
      console.log('Action payload', action.payload);
      state.payments = action.payload;
    });
  },
});

export const {} = ExpenseSlice.actions;
export default ExpenseSlice.reducer;

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const expenseCollection = firestore().collection('expenses');
const graphCollection = firestore().collection('graph');

const initialState = {
  payments: [],
  paymentById: [],
  paymentsByMonth: [],
};

export const PaymentsByRoom = createAsyncThunk(
  'PaymentsByRoom',
  async (values, {dispatch}) => {
    console.log('messages values at payment data', values);
    try {
      if (values.isPaid) {
        firestore()
          .collection(`${values.path}/payments`)
          .doc()
          .set({
            group: values.item.groupName ? values.item.groupName : '',
            amount: values?.amount ? values?.amount : '',
            remarks: values?.remarks ? values?.remarks : '',
            paidTo: values?.item?.fullName ? values?.item?.fullName : '',
            paidBy: values?.paidBy ? values?.paidBy : {},
            createdAt: new Date(),
          })
          .then(() => {
            expenseCollection.doc(values.item.groupId).set({
              ...values.item,
            });
            dispatch(MonthwiseData({...values, createdAt: new Date()}));
          })
          .catch(error => {
            console.log('Error in adding payments', error);
          });
      } else {
        console.log('it is goooooiiing here');
      }
    } catch (error) {
      console.error('error in payments', error);
    }
  },
);

export const GetAllPayments = createAsyncThunk(
  'GetAllPayments',
  async (values, {dispatch}) => {
    console.log(values);
    try {
      const groupCollection = expenseCollection.get();

      const paymentsArray = [];

      const filterByMonth = values && values.toLowerCase();

      (await groupCollection).forEach(doc => {
        const createdAt = doc.data().createdAt.toDate();
        const paymentMonth = createdAt
          .toLocaleString('en-US', {month: 'long'})
          .toLowerCase();

        if (!filterByMonth || paymentMonth.includes(filterByMonth)) {
          paymentsArray.push(doc.data());
        }
      });

      return paymentsArray;
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const GetPaymentsById = createAsyncThunk(
  'GetPaymentsById',
  async (values, {dispatch}) => {
    try {
      const groupCollection = expenseCollection
        .doc(values)
        .collection('payments')
        .get();

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

export const UpdatePaymentById = createAsyncThunk(
  'UpdatePaymentById',
  async (values, {dispatch}) => {
    try {
      expenseCollection.doc(values?.id).update({
        totalAmount: values?.amount,
      });
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const MonthwiseData = createAsyncThunk(
  'MonthwiseData',
  async (values, {dispatch}) => {
    try {
      var currentDate = new Date();

      // Array of month names
      var monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      // Get the current month (returns a number from 0 to 11)
      var currentMonthIndex = currentDate.getMonth();

      var currentMonthName = monthNames[currentMonthIndex];

      const docRef = graphCollection.doc(currentMonthName);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const existingData = docSnapshot.data();
        const updatedAmount =
          (existingData.amount || 0) + (values?.amount || 0);

        docRef.update({
          amount: updatedAmount,
        });
      } else {
        docRef.set({
          ...values,
          id: currentMonthName,
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const GetPaymentsByMonth = createAsyncThunk(
  'GetPaymentsByMonth',
  async (values, {dispatch}) => {
    try {
      const groupCollection = graphCollection.get();

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
    builder.addCase(GetPaymentsById.fulfilled, (state, action) => {
      console.log('Action payload', action.payload);
      state.paymentById = action.payload;
    });
    builder.addCase(GetPaymentsByMonth.fulfilled, (state, action) => {
      console.log('Monthwise payments', action.payload);
      state.paymentsByMonth = action.payload;
    });
  },
});

export const {} = ExpenseSlice.actions;
export default ExpenseSlice.reducer;

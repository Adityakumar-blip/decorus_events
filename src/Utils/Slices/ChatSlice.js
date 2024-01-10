import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const chatCollection = firestore().collection('chats');
const invoiceCollection = firestore().collection('invoices');
const salaryCollection = firestore().collection('SalarySlips');

const initialState = {
  allRooms: [],
  groupData: {},
  groupMedia: [],
  allMedia: [],
  allMembers: [],
  lastMessage: [],
  invoiceArray: [],
};

export const CreateChatRooms = createAsyncThunk(
  'CreateChatRooms',
  async values => {
    try {
      console.log('group values', values);
      const groupCollection = chatCollection.doc();
      const groupId = groupCollection.id;

      await groupCollection.set({
        groupName: values?.groupName,
        groupId: groupId,
        imageUrl: values?.image,
      });

      const membersCollection = chatCollection
        .doc(groupId)
        .collection('members');

      for (const member of values.members) {
        await membersCollection.doc(member.userId).set({
          email: member.email,
          fullName: member.fullName,
          phoneNo: member.phoneNo,
          role: member.role,
          userId: member.userId,
        });
      }
      console.log('Group creaated');

      return 'Members added successfully';
    } catch (error) {
      throw error;
    }
  },
);

export const GetAllRooms = createAsyncThunk(
  'rooms/getAllRooms',
  async (values, {dispatch}) => {
    try {
      const roomSnapshot = await chatCollection.get();

      const roomsData = roomSnapshot?.docs?.map(doc => doc.data());

      chatCollection.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'modified') {
            const modifiedRoom = change.doc.data();
            dispatch(updateRoom(modifiedRoom));
          }
        });
      });

      return roomsData;
    } catch (error) {
      throw error;
    }
  },
);

export const GetMediaByRoom = createAsyncThunk(
  'GetMediaByRoom',
  async values => {
    try {
      const collectionRef = chatCollection.doc(values).collection('messages');

      const mediaData = [];
      const querySnapshot = await collectionRef
        .where('mediaType', '==', 'image')
        .get();

      querySnapshot.forEach(doc => {
        mediaData.push(doc.data());
      });

      return mediaData;
    } catch (error) {
      throw error;
    }
  },
);

export const SendMessageByRoom = createAsyncThunk(
  'SendMessageByRoom',
  async (values, {dispatch}) => {
    console.log('messages values', values);
    try {
      const newDocRef = firestore().collection(values?.roomPath).doc();

      newDocRef
        .set({
          messageId: newDocRef.id,
          message: values.message,
          amount: values?.amount ? Number(values?.amount) : 0,
          remarks: values?.remarks ? values?.remarks : '',
          createdAt: new Date(),
          senderId: values?.senderId,
          fullName: values?.fullName,
          isPaid: values?.isPaid ? values?.isPaid : false,
          mediaType: values?.mediaType ? values?.mediaType : 'text',
        })
        .then(() => {
          chatCollection.doc(values?.groupId).update({
            message: values.message,
            createdAt: new Date(),
            fullName: values?.fullName,
          });
        });
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const getGroup = createAsyncThunk(
  'getGroup',
  async (values, {dispatch}) => {
    console.log('messages values', values);
    try {
      const groupDoc = await chatCollection.doc(values).get();
      if (groupDoc.exists) {
        const groupData = groupDoc.data();
        console.log('sakdhfjkdshakjfhaksndgjkbasjkdg', groupData);
        return groupData;
      } else {
        throw new Error('Group not found');
      }
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  },
);

export const updateGroup = createAsyncThunk(
  'updateGroup',
  async (values, {dispatch}) => {
    try {
      await chatCollection.doc(values.groupId).update(values.updatedUserData);
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  },
);

export const getMedia = createAsyncThunk(
  'getMedia',
  async (values, {dispatch}) => {
    try {
      const snapshot = await chatCollection
        .doc(values)
        .collection('messages')
        .where('mediaType', '==', 'image')
        .get();

      const mediaData = snapshot?.docs?.map(doc => doc.data());

      return mediaData;
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  },
);

export const getAllMembers = createAsyncThunk(
  'getAllMembers',
  async (values, {dispatch}) => {
    try {
      const snapshot = await chatCollection
        .doc(values)
        .collection('members')
        .get();

      const membersData = snapshot.docs.map(doc => doc.data());

      return membersData;
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  },
);

export const getLastMessage = createAsyncThunk(
  'getLastMessage',
  async (values, {dispatch}) => {
    try {
      const snapshot = await chatCollection
        .doc(values)
        .collection('messages')
        .doc()
        .get();

      const membersData = snapshot?.docs?.map(doc => doc.data());

      return membersData;
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  },
);

export const UploadBills = createAsyncThunk(
  'UploadBills',
  async (values, {dispatch}) => {
    try {
      const groupCollection = invoiceCollection.doc();
      const invoiceId = groupCollection.id;

      await groupCollection.set({
        groupId: values?.groupId,
        groupName: values?.groupName,
        invoiceId: invoiceId,
        invoice: values?.invoiceUrl,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const UploadSalarySlips = createAsyncThunk(
  'UploadBills',
  async (values, {dispatch}) => {
    try {
      const groupCollection = salaryCollection.doc();
      const invoiceId = groupCollection.id;

      await groupCollection.set({
        groupId: values?.groupId,
        groupName: values?.groupName,
        invoiceId: invoiceId,
        slip: values?.salaryUrl,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const GetAllBills = createAsyncThunk(
  'GetAllBills',
  async (values, {dispatch}) => {
    console.log('messages values', values);
    try {
      const groupCollection = invoiceCollection.get();

      const invoicesArray = [];

      (await groupCollection).forEach(doc => {
        invoicesArray.push(doc.data());
      });

      return invoicesArray;
    } catch (error) {
      console.error('error', error);
    }
  },
);

export const AddMembers = createAsyncThunk(
  'AddMembers',
  async (values, {dispatch}) => {
    console.log('values', values);
    try {
      chatCollection.doc(values.id).collection('members').add({});
    } catch (error) {
      console.log('Error in adding members', error);
    }
  },
);

export const ChatSlice = createSlice({
  name: 'ChatSlice',
  initialState,
  reducers: {
    setLastMessage: (state, action) => {},
    updateRoom(state, action) {
      state.allRooms = state.allRooms.map(room =>
        room.groupId === action.payload.groupId ? action.payload : room,
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(GetAllRooms.fulfilled, (state, action) => {
      state.allRooms = action.payload;
    });
    builder.addCase(getGroup.fulfilled, (state, action) => {
      state.groupData = action.payload;
    });
    builder.addCase(getMedia.fulfilled, (state, action) => {
      state.allMedia = action.payload;
    });
    builder.addCase(getAllMembers.fulfilled, (state, action) => {
      state.allMembers = action.payload;
    });
    builder.addCase(GetMediaByRoom.fulfilled, (state, action) => {
      const mediaData = action.payload;
      state.groupMedia = mediaData;
    });
    builder.addCase(GetAllBills.fulfilled, (state, action) => {
      state.invoiceArray = action.payload;
    });
    builder.addCase(updateGroup.fulfilled, (state, action) => {
      state.groupData = action.payload;
    });
  },
});

export const {updateRoom} = ChatSlice.actions;
export default ChatSlice.reducer;

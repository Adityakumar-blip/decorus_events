import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const chatCollection = firestore().collection('chats');

const initialState = {
  allRooms: [],
  groupData: {},
  groupMedia: [],
};

export const CreateChatRooms = createAsyncThunk(
  'CreateChatRooms',
  async values => {
    try {
      const groupCollection = chatCollection.doc();
      const groupId = groupCollection.id;

      await groupCollection.set({
        groupName: values?.groupName,
        groupId: groupId,
        imageUrl: values?.image,
        user: values?.user,
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

export const GetAllRooms = createAsyncThunk('GetAllRooms', async () => {
  try {
    const roomSnapshot = await chatCollection.get();

    const roomsData = roomSnapshot.docs.map(doc => doc.data());

    return roomsData;
  } catch (error) {
    throw error;
  }
});

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
      firestore()
        .collection(values?.roomPath)
        .doc()
        .set({
          message: values.message,
          createdAt: new Date(),
          senderId: values?.senderId,
          fullName: values?.fullName,
          mediaType: values?.mediaType ? values?.mediaType : 'text',
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
  'updateUser',
  async (values, {dispatch}) => {
    console.log('update values ^^^^^^^^^^^^^^^^^^', values);
    try {
      await chatCollection
        .doc(values.groupId)
        .collection('members')
        .doc(values.userId)
        .update(values.updatedUserData);
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  },
);

export const ChatSlice = createSlice({
  name: 'ChatSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(GetAllRooms.fulfilled, (state, action) => {
      state.allRooms = action.payload;
    });
    builder.addCase(getGroup.fulfilled, (state, action) => {
      state.groupData = action.payload;
    });
    builder.addCase(GetMediaByRoom.fulfilled, (state, action) => {
      const mediaData = action.payload;
      state.groupMedia = mediaData;
    });
  },
});

export default ChatSlice.reducer;

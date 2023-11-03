import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import {TeamStyle} from '../../../Utils/Styles/TeamsStyle';
import {useDispatch, useSelector} from 'react-redux';
import {GetAllUser} from '../../../Utils/Slices/UserSlice';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {Login} from '../../../Utils/Styles/LoginStyles';
import {CreateChatRooms, GetAllRooms} from '../../../Utils/Slices/ChatSlice';
import ImageC from '../../../Components/ImageC';

const Group = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {members} = route.params;
  const hasImage = false;

  console.log('MEMBERS ', members);

  const [groupName, setGroupName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  console.log('navigation of group', members);
  console.log('group name is', imageUrl);

  const {allUsers} = useSelector(({UserSlice}) => UserSlice);
  const {user} = useSelector(({AuthSlice}) => AuthSlice);

  console.log('CURRENT USER', user);

  useEffect(() => {
    dispatch(GetAllUser());
  }, []);

  const renderContactItem = ({item}) => {
    // if (item.userId === user.userId) {
    //   return null;
    // }
    return (
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
          borderBottomWidth: 0.5,
          borderBottomColor: '#4369F6',
          paddingBottom: 15,
          paddingTop: 15,
        }}>
        <View>
          {hasImage ? (
            <Image
              source={{uri: item.profileImage}}
              style={{width: 50, height: 50, borderRadius: 50}}
            />
          ) : (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                backgroundColor: '#4369F6',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'center',
                }}>
                {item?.fullName[0]}
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text style={{fontSize: 22, fontWeight: '700', color: '#4369F6'}}>
            {item?.fullName}
          </Text>
          <Text style={{color: 'black', fontWeight: '600'}}>
            {item?.phoneNo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCreateGroup = () => {
    const Group = {
      groupName,
      members,
      image: imageUrl ? imageUrl : '',
    };
    console.log('CHATROOM DATA IS', Group);
    dispatch(CreateChatRooms(Group));
    dispatch(GetAllRooms());
    navigation.navigate('Team');
  };

  return (
    <View style={{flex: 1}}>
      <View style={TeamStyle.TeamHeader}>
        <Text style={{fontSize: 32, fontWeight: '700', color: '#4369F6'}}>
          New Group
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginHorizontal: 20,
        }}>
        <View
          style={{
            height: 60,
            backgroundColor: 'red',
            width: 60,
            borderRadius: 50,
          }}>
          <ImageC
            source={imageUrl}
            onChange={url => {
              setImageUrl(url);
            }}
          />
        </View>
        <TextInput
          style={{
            width: '80%',
            padding: 15,
            borderWidth: 1,
            borderColor: '#4287f5',
            marginBottom: 10,
            borderRadius: 10,
            color: '#7DA5FF',
            fontFamily: 'Lato',
            fontSize: 18.988,
            fontWeight: '700',
            letterSpacing: 0.26,
          }}
          placeholder="Enter Group Name"
          onChangeText={text => setGroupName(text)}
          placeholderTextColor="black"
        />
      </View>
      <View style={{padding: 20}}>
        <FlatList
          data={members}
          renderItem={renderContactItem}
          keyExtractor={item => item.userId}
        />
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#4369F6',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          handleCreateGroup();
        }}>
        <Text>Go</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Group;

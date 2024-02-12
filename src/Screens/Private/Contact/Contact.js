import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {TeamStyle} from '../../../Utils/Styles/TeamsStyle';
import {useDispatch, useSelector} from 'react-redux';
import {GetAllUser} from '../../../Utils/Slices/UserSlice';
import {useNavigation} from '@react-navigation/native';
import {AddMembers} from '../../../Utils/Slices/ChatSlice';

const Contact = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const groupId = route?.params?.groupId;

  console.log('group id', groupId);

  const {allUsers} = useSelector(({UserSlice}) => UserSlice);
  const {user} = useSelector(({AuthSlice}) => AuthSlice);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [filteredContacts, setFilterContacts] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = text => {
    setSearchText(text);
    // Filter the rooms based on the search text
    const filtered = allUsers.filter(room =>
      room.fullName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilterContacts(filtered);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    // Clear the search text when hiding the input field
    if (!showSearchInput) {
      setSearchText('');
    }
  };

  const handleContactClick = item => {
    if (isSelected(item)) {
      setSelectedUsers(prevSelectedUsers =>
        prevSelectedUsers.filter(user => user.userId !== item.userId),
      );
    } else {
      setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, item]);
    }
  };

  const isSelected = item => {
    return selectedUsers.some(user => user.userId === item.userId);
  };

  console.log('Selected users', selectedUsers);

  useEffect(() => {
    dispatch(GetAllUser());
  }, []);

  console.log('all users ', allUsers);
  console.log('all contacts', selectedUsers);

  const renderContactItem = ({item}) => {
    const selected = isSelected(item);
    if (item.userId === user.userId) {
      return null;
    }
    const hasImage = item?.image;
    return (
      <TouchableOpacity
        onPress={() => handleContactClick(item)}
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
              source={{uri: item?.image}}
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
                {item?.fullName[0]}{' '}
                {/* Replace 'userName' with the actual key in your user data */}
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text style={{fontSize: 22, fontWeight: '700', color: '#4369F6'}}>
            {item?.fullName}{' '}
            {/* Replace 'userName' with the actual key in your user data */}
          </Text>
          <Text style={{color: 'black', fontWeight: '600'}}>
            {item?.phoneNo}{' '}
            {/* Replace 'phoneNumber' with the actual key in your user data */}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleGroup = () => {
    if (selectedUsers.length > 0) {
      const loggedInUser = user;
      const members = [loggedInUser, ...selectedUsers];
      navigation.navigate('Group', {members});
    }
  };

  const handleAddMembers = () => {
    if (selectedUsers) {
      dispatch(AddMembers({id: groupId, members: selectedUsers})).then(() => {
        navigation.navigate('Team');
        Alert.alert('Success', 'Member added succesfully');
      });
    }
  };
  console.log('selected users', selectedUsers);
  const onBackPress = () => {
    navigation.goBack();
  };

  const handleAddToGroup = () => {
    try {
    } catch (error) {}
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={TeamStyle.TeamHeader}>
        <TouchableOpacity onPress={() => onBackPress()}>
          <Image source={require('../../../Assets/Images/back_blue.png')} />
        </TouchableOpacity>

        <Text style={{fontSize: 32, fontWeight: '700', color: '#4369F6'}}>
          Contacts
        </Text>
        <TouchableOpacity onPress={toggleSearchInput}>
          {showSearchInput ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: 'blue',
                borderRadius: 15,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: 200,
                paddingRight: 10,
                height: 45,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  marginLeft: 10,
                  width: 200,
                  paddingLeft: 10,
                  color: 'black',
                }}
                placeholder="Search..."
                value={searchText}
                onChangeText={handleSearchTextChange}
                placeholderTextColor="black"
              />
              <TouchableOpacity onPress={() => toggleSearchInput()}>
                <Image
                  source={require('../../../Assets/Images/cancel.png')}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Image
              source={require('../../../Assets/Images/search.png')}
              height={20}
              width={20}
            />
          )}
        </TouchableOpacity>
      </View>

      {selectedUsers.length > 0 && (
        <ScrollView
          style={{maxHeight: 70, borderWidth: 1, borderColor: 'grey'}}>
          <View style={{padding: 20, flexDirection: 'row', flexWrap: 'wrap'}}>
            {selectedUsers?.map((item, index) => (
              <View
                key={index}
                style={{
                  width: 'auto',
                  backgroundColor: '#4369F6',
                  padding: 10,
                  borderRadius: 20,
                  margin: 5,
                }}>
                <Text style={{color: 'white', fontWeight: '600'}}>
                  {item.fullName}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <View style={{padding: 20}}>
        <FlatList
          data={showSearchInput && searchText ? filteredContacts : allUsers}
          renderItem={renderContactItem}
          keyExtractor={item => item.phoneNo}
        />
      </View>
      <TouchableOpacity
        style={
          groupId
            ? {
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 200,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#4369F6',
                justifyContent: 'center',
                alignItems: 'center',
              }
            : {
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#4369F6',
                justifyContent: 'center',
                alignItems: 'center',
              }
        }
        onPress={() => {
          groupId ? handleAddMembers() : handleGroup();
        }}>
        {groupId ? (
          <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
            Add Members
          </Text>
        ) : (
          <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
            Go
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Contact;

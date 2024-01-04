import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {TeamStyle} from '../../../Utils/Styles/TeamsStyle';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {GetAllRooms, getLastMessage} from '../../../Utils/Slices/ChatSlice';
import firestore from '@react-native-firebase/firestore';

const Teams = () => {
  const {session, user} = useSelector(({AuthSlice}) => AuthSlice);
  const {allRooms} = useSelector(({ChatSlice}) => ChatSlice);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [rooms, setRooms] = useState([]);
  const [searchText, setSearchText] = useState(''); // State to hold the search text
  const [showSearchInput, setShowSearchInput] = useState(false); // State to toggle search input visibility
  const [filteredRooms, setFilteredRooms] = useState([]);

  const handleSearchTextChange = text => {
    setSearchText(text);
    // Filter the rooms based on the search text
    const filtered = allRooms.filter(room =>
      room.groupName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredRooms(filtered);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    // Clear the search text when hiding the input field
    if (!showSearchInput) {
      setSearchText('');
    }
  };

  const handleGroupClick = async item => {
    const membersRef = firestore().collection(`chats/${item?.groupId}/members`);

    try {
      const membersSnapshot = await membersRef.get();
      const membersLength = membersSnapshot.size;

      navigation.navigate('ChatScreen', {
        path: `chats/${item?.groupId}/messages`,
        header: item?.groupName,
        membersCount: membersLength,
        item,
        imageUrl: item?.imageUrl,
      });
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleContact = () => {
    navigation.navigate('Contacts');
  };

  useEffect(() => {
    dispatch(GetAllRooms(user?.userId));
    dispatch(getLastMessage());
  }, [user]);

  useEffect(() => {
    setRooms(allRooms);
  }, [allRooms]);

  const renderRooms = ({item}) => {
    // if (item.userId === user.userId) {
    //   return null;
    // }
    return (
      <View style={{marginHorizontal: 10}}>
        <TouchableOpacity
          onPress={() => handleGroupClick(item)}
          style={TeamStyle.TeamChat}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}>
            <Image
              source={{
                uri: item?.imageUrl
                  ? item?.imageUrl
                  : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGdyb3VwfGVufDB8fDB8fHww',
              }}
              height={60}
              width={60}
              style={{borderRadius: 10}}
            />
            <View style={{marginVertical: 20}}>
              <Text style={{color: 'black', fontSize: 17, fontWeight: '500'}}>
                {item?.groupName}
              </Text>
              <Text style={{maxWidth: 250, color: 'black'}}>
                {item?.fullName && `${item?.fullName}: ${item?.message}`}
              </Text>
            </View>
          </View>

          {/* <View
            style={{
              backgroundColor: '#6583F3',
              width: 25,
              height: 25,
              borderRadius: 50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}>
            <Text style={{color: 'white'}}>0</Text>
          </View> */}
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={TeamStyle.TeamHeader}>
        <Text style={{fontSize: 32, fontWeight: '700', color: '#4369F6'}}>
          Teams
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

      <FlatList
        data={showSearchInput && searchText ? filteredRooms : rooms}
        renderItem={renderRooms}
        keyExtractor={item => item.groupId}
      />
      {user?.role === 'admin' && (
        <TouchableOpacity
          style={TeamStyle.FloatingButton}
          onPress={() => {
            handleContact();
          }}>
          <Text style={{color: 'white', fontSize: 24}}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Teams;

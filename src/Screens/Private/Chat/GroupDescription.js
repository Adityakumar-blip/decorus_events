import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import {TeamStyle} from '../../../Utils/Styles/TeamsStyle';
import ImageC from '../../../Components/ImageC';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetMediaByRoom,
  getAllMembers,
  getGroup,
  getMedia,
  updateGroup,
} from '../../../Utils/Slices/ChatSlice';
import {firebase} from '@react-native-firebase/storage';

const GroupDescription = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [editDescription, setEditDescription] = useState(false);
  const [description, setDescription] = useState('');

  const {groupData, groupMedia, allMedia, allMembers} = useSelector(
    ({ChatSlice}) => ChatSlice,
  );

  console.log('GROUP DATA JSHJHKDJSHJD0', allMembers);

  const groupId = route?.params?.item?.groupId;
  const imageUrl = route?.params?.item?.imageUrl;
  const item = route?.params?.item;

  console.log('Group Details', item);

  useEffect(() => {
    if (groupId) {
      dispatch(getGroup(groupId));
      dispatch(GetMediaByRoom(groupId));
    }
  }, []);

  const toggleDescriptionEdit = () => {
    setEditDescription(!editDescription);
  };

  const updateDescription = () => {
    dispatch(updateGroup({groupId, updatedUserData: {description}})).then(
      res => {
        dispatch(getMedia(groupId));
      },
    );
  };

  useEffect(() => {
    dispatch(getMedia(groupId));
    dispatch(getAllMembers(groupId));
  }, []);

  const renderMedia = ({item, index}) => {
    return (
      <View
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}
        key={index}>
        <View>
          <Image
            source={{
              uri: item?.message ? item?.message : undefined,
            }}
            style={{height: 100, width: 100, borderRadius: 10, marginRight: 10}}
          />
        </View>
      </View>
    );
  };

  const handleAddMembers = () => {
    navigation.navigate('Contacts', {groupId});
  };

  return (
    <>
      <ScrollView>
        <View>
          <View
            style={{
              backgroundColor: '#001666',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              padding: 20,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../../../Assets/Images/back_icon.png')} />
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 18,
                  marginHorizontal: 20,
                }}>
                <View>
                  <ImageC
                    source={imageUrl ? imageUrl : groupData?.image}
                    onChange={url => {
                      var storage = firebase.storage();
                      var imageRef = storage.ref().child(url);
                      imageRef
                        .getDownloadURL()
                        .then(function (url) {
                          dispatch(
                            updateGroup({
                              groupId,
                              updatedUserData: {image: url},
                            }),
                          );
                        })
                        .catch(function (error) {
                          console.error(error);
                        });
                    }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{marginVertical: 20}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 17,
                      fontWeight: '500',
                      width: 200,
                    }}>
                    {item?.groupName}
                  </Text>
                  <Text
                    style={{
                      maxWidth: 250,
                      color: 'white',
                      fontWeight: '400',
                      fontSize: 10,
                    }}>
                    Members
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    color: 'white',
                  }}>
                  <Image
                    source={require('../../../Assets/Images/edit.png')}
                    style={{height: 20, width: 20}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <View style={{display: 'flex', flexDirection: 'row', gap: 15}}>
                <Text style={{color: 'white'}}>Team Description</Text>
                {editDescription ? (
                  <TouchableOpacity
                    onPress={() => {
                      updateDescription();
                      toggleDescriptionEdit();
                    }}>
                    <View>
                      <Image
                        source={require('../../../Assets/Images/check.png')}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => toggleDescriptionEdit()}>
                    <View>
                      <Image
                        source={require('../../../Assets/Images/pen.png')}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                {editDescription ? (
                  <TextInput
                    value={description}
                    multiline={true}
                    onChangeText={text => setDescription(text)}
                    style={{color: 'white'}}
                    placeholder="Description"
                  />
                ) : (
                  <Text
                    style={{color: 'white', fontSize: 12, fontWeight: '300'}}>
                    {groupData?.description}
                  </Text>
                )}
              </View>
              <Text style={{color: 'white'}}>Team Leader</Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  marginTop: 10,
                  fontWeight: '300',
                }}>
                Sarvesh Sharma (+919999200034)
              </Text>
              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text style={{color: 'white'}}>Team Media</Text>
                  <Text style={{color: 'white'}}>Edit</Text>
                </View>
                <FlatList
                  data={allMedia}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderMedia}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>

          <View style={{marginHorizontal: 20, paddingVertical: 10}}>
            <Text style={{color: 'black', fontWeight: 700}}>Team Members</Text>
            {allMembers?.map((item, index) => (
              <View
                style={{
                  marginTop: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 40,
                }}
                key={index}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{
                      uri: item?.image,
                    }}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  />
                  <View>
                    <Text style={{color: 'black', fontWeight: 600}}>
                      {item?.fullName}
                    </Text>
                    <Text>+91 {item?.phoneNo}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderColor: 'gray',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          paddingVertical: 10,
          flex: 1,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            borderRightWidth: 1,
            borderRightColor: 'gray',
          }}
          onPress={() => handleAddMembers()}>
          <Text style={{color: 'black'}}>Add Members</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <Text style={{color: 'red'}}>Exit Group</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default GroupDescription;

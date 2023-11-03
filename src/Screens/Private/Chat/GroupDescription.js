import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, Text, TextInput} from 'react-native';
import {TeamStyle} from '../../../Utils/Styles/TeamsStyle';
import ImageC from '../../../Components/ImageC';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetMediaByRoom,
  getGroup,
  updateGroup,
} from '../../../Utils/Slices/ChatSlice';
import {firebase} from '@react-native-firebase/storage';

const GroupDescription = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [editDescription, setEditDescription] = useState(false);
  const [description, setDescription] = useState('');

  const {groupData, groupMedia} = useSelector(({ChatSlice}) => ChatSlice);

  console.log('GROUP DATA JSHJHKDJSHJD0', groupMedia);

  const groupId = route?.params?.item?.groupId;
  const imageUrl = route?.params?.item?.imageUrl;

  console.log('GROUP ID::', route.params?.item?.groupId);

  useEffect(() => {
    console.log('new group id is new data test', groupId);
    if (groupId) {
      dispatch(getGroup(groupId));
      dispatch(GetMediaByRoom(groupId));
    }
  }, []);

  const toggleDescriptionEdit = () => {
    setEditDescription(!editDescription);
  };

  const updateDescription = () => {
    dispatch(updateGroup({groupId, updatedUserData: {description}}));
  };

  return (
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
                        updateGroup({groupId, updatedUserData: {image: url}}),
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
              <Text style={{color: 'white', fontSize: 17, fontWeight: '500'}}>
                Shanti Vihar Wedding Event Management
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
                  <Image source={require('../../../Assets/Images/check.png')} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => toggleDescriptionEdit()}>
                <View>
                  <Image source={require('../../../Assets/Images/pen.png')} />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={{marginTop: 10, marginBottom: 10}}>
            {editDescription ? (
              <TextInput
                value={groupData?.description}
                multiline={true}
                onChangeText={text => setDescription(text)}
                style={{color: 'white'}}
              />
            ) : (
              <Text style={{color: 'white', fontSize: 12, fontWeight: '300'}}>
                This group is created for the wedding anniversary of Mr. Anubhav
                and Sneha Patel. Event is in leadership of senior event manager
                Mr. Sarvesh Sharma.{' '}
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
          </View>
        </View>
      </View>
      <View>
        <View>
          <Text>Team Members</Text>
        </View>
      </View>
    </View>
  );
};

export default GroupDescription;

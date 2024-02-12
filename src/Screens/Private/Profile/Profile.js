import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import {ProfileStyle} from '../../../Utils/Styles/ProfileStyles';
import {useDispatch, useSelector} from 'react-redux';
import {Logout, UpdateUser} from '../../../Utils/Slices/AuthSlice';
import {useNavigation} from '@react-navigation/native';
import ImageC from '../../../Components/ImageC';
import {firebase} from '@react-native-firebase/storage';
import {GetAllUser} from '../../../Utils/Slices/UserSlice';
import {updateGroup} from '../../../Utils/Slices/ChatSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {session, user} = useSelector(({AuthSlice}) => AuthSlice);
  const {allUsers} = useSelector(({UserSlice}) => UserSlice);

  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [editPhone, setEditPhone] = useState(false);
  const [phone, setPhone] = useState('');

  console.log('USER DATA ********************', user);

  const handleEmailEdit = () => {
    setEditEmail(true);
    setEmail(user.email);
  };

  const handleEmailSave = () => {
    dispatch(UpdateUser({email}));
    setEditEmail(false);
  };

  const handlePhoneEdit = () => {
    setEditPhone(true);
    setPhone(user?.phoneNo);
  };

  const handlePhoneSave = () => {
    dispatch(UpdateUser({phoneNo: phone}));
    setEditPhone(false);
  };

  const handleBank = () => {
    if (user?.bank) {
      navigation.navigate('Bank', {bank: user?.bank});
    } else {
      navigation.navigate('Bank');
    }
  };

  useEffect(() => {
    dispatch(GetAllUser());
  }, []);

  const renderUsers = ({item, index}) => {
    if (item?.role === 'user') {
      return null;
    }
    return (
      <View
        style={{
          width: 80,
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        key={index}>
        <View>
          <Image
            source={{
              uri: item?.image ? item?.image : undefined,
            }}
            style={{height: 60, width: 60, borderRadius: 50}}
          />
        </View>
        <View>
          <Text style={{color: 'black'}}>{item?.fullName}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <View>
          <Text style={{color: '#4369F6', fontSize: 32, fontWeight: '700'}}>
            Profile
          </Text>
        </View>
        <View style={ProfileStyle.ProfileDetails}>
          <View style={ProfileStyle.ProfileImage}>
            <ImageC
              source={user?.image}
              onChange={url => {
                dispatch(UpdateUser({image: url}));
              }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={ProfileStyle.Username}>{user?.fullName}</Text>
            <Text style={{color: 'black'}}>{user?.role}</Text>
          </View>
          {/* <TouchableOpacity>
            <Image source={require('../../../Assets/Images/pencil.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../../Assets/Images/camera.png')} />
          </TouchableOpacity> */}
        </View>
        <View>
          <Text style={{fontWeight: '600', color: 'black', fontSize: 16}}>
            Admins
          </Text>
          <FlatList
            data={allUsers}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderUsers}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            marginTop: 30,
          }}>
          <View style={ProfileStyle.Email}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 20,
                alignItems: 'center',
              }}>
              <Image source={require('../../../Assets/Images/email.png')} />
              {editEmail ? (
                <TextInput
                  value={email}
                  placeholder="Enter Your Email"
                  placeholderTextColor="black"
                  onChangeText={text => setEmail(text)}
                  style={{color: 'black', height: 40}}
                />
              ) : (
                <Text
                  style={{color: '#407BFF', fontSize: 15, fontWeight: '700'}}>
                  {user?.email}
                </Text>
              )}
            </View>
            {editEmail ? (
              <TouchableOpacity onPress={() => handleEmailSave()}>
                <Text style={{color: 'black'}}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleEmailEdit()}>
                <Text style={{color: 'black'}}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={ProfileStyle.Email}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 20,
                alignItems: 'center',
              }}>
              <Image source={require('../../../Assets/Images/phone.png')} />
              {editPhone ? (
                <TextInput
                  value={phone}
                  placeholder="Enter Your Phone Number"
                  placeholderTextColor="black"
                  onChangeText={text => setPhone(text)}
                  style={{
                    color: 'black',
                    height: 40,
                  }}
                />
              ) : (
                <Text
                  style={{color: '#407BFF', fontSize: 15, fontWeight: '700'}}>
                  {`+91 ${user?.phoneNo}`}
                </Text>
              )}
            </View>
            {editPhone ? (
              <TouchableOpacity onPress={() => handlePhoneSave()}>
                <Text style={{color: 'black'}}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handlePhoneEdit()}>
                <Text style={{color: 'black'}}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={ProfileStyle.Email}
            onPress={() => handleBank()}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
              <Image source={require('../../../Assets/Images/bank.png')} />
              <Text style={{color: '#407BFF', fontSize: 15, fontWeight: '700'}}>
                Add Bank Details
              </Text>
            </View>
            <Image source={require('../../../Assets/Images/right-arrow.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={ProfileStyle.Email}
            onPress={() => dispatch(Logout())}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
              <Image source={require('../../../Assets/Images/logout.png')} />
              <Text style={{color: '#407BFF', fontSize: 15, fontWeight: '700'}}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

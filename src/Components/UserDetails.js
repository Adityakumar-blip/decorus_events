import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ProfileStyle} from '../Utils/Styles/ProfileStyles';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getUserById} from '../Utils/Slices/UserSlice';

const UserDetails = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [editPhone, setEditPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [user, setUserData] = useState({});

  console.log('User ID', route.params.userId);

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
    dispatch(getUserById(route?.params?.userId)).then(res => {
      console.log('User Response', res.payload);
      setUserData(res?.payload);
    });
  }, []);
  return (
    <View style={styles.container}>
      <View style={{backgroundColor: 'black', padding: 15, paddingLeft: 20}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../Assets/Images/back_icon.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHNob3R8ZW58MHx8MHx8fDA%3D',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user?.fullName}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>
      <ScrollView style={styles.details}>
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
              <Image source={require('../Assets/Images/email.png')} />
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
              <Image source={require('../Assets/Images/phone.png')} />
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
              <Image source={require('../Assets/Images/bank.png')} />
              <Text style={{color: '#407BFF', fontSize: 15, fontWeight: '700'}}>
                Add Bank Details
              </Text>
            </View>
            <Image source={require('../Assets/Images/right-arrow.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={ProfileStyle.Email}
            onPress={() => dispatch(Logout())}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
              <Image source={require('../Assets/Images/logout.png')} />
              <Text style={{color: '#407BFF', fontSize: 15, fontWeight: '700'}}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  profileImage: {
    width: '45%',
    height: '45%',
    borderRadius: 50,
  },
  username: {
    color: 'black',
    marginTop: 10,
    fontSize: 20,
  },
  role: {
    color: 'black',
    marginTop: 5,
    fontSize: 15,
  },
  details: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
});

export default UserDetails;

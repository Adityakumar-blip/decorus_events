import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import ImageC from './ImageC';

const PaymentDetail = ({navigation, route}) => {
  const data = route.params.item;

  console.log('Data', data);
  return (
    <ScrollView>
      <View>
        <View
          style={{
            backgroundColor: '#6485FF',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            padding: 20,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../Assets/Images/back_icon.png')} />
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
                <Image source={{uri: data.image}} alt="profile" />
              </View>
              <View style={{marginVertical: 20}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 17,
                    fontWeight: '500',
                    width: 200,
                  }}>
                  {data?.groupName}
                  {/* Test */}
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
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={{marginHorizontal: 20, paddingVertical: 10}}>
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
        </View> */}
      </View>
    </ScrollView>
  );
};

export default PaymentDetail;

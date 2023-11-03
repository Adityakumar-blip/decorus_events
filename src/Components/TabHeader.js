import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../Utils/constants';
import {useNavigation} from '@react-navigation/native';

export default function TabHeader({
  title,
  titlestyle,
  onBackPress,
  isBackAvailable,
  isEdit,
  onEditButton,
  para,
  item,
  imageUrl,
}) {
  const navigation = useNavigation();
  return (
    <View style={styles.HeaderConatiner}>
      <View style={styles.Header}>
        <View>
          {isBackAvailable && (
            <TouchableOpacity
              style={styles.backarrow}
              onPress={() => onBackPress && onBackPress()}>
              <Image source={require('../Assets//Images/back_icon.png')} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.Image}>
          <Image source={{uri: imageUrl}} style={styles.Image} />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={{color: 'white'}}>{para}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Description', {item: item})}>
        <Image source={require('../Assets/Images/three_dots.png')} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  Header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  HeaderConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6583F3',
    justifyContent: 'space-between',
    gap: 10,
    padding: 15,
  },
  title: {
    fontSize: fontPixel(40),
    color: 'white',
    letterSpacing: 1,
  },
  backarrow: {
    marginBottom: pixelSizeVertical(10),
  },
  Absulate: {
    flexDirection: 'row',
    height: heightPixel(150),
    width: '100%',
    alignItems: 'center',
    paddingBottom: pixelSizeVertical(20),
    position: 'absolute',
  },
  Image: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

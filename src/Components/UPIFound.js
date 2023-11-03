import * as React from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const DEFAULT_HEIGHT = 200;

function useAnimatedBottom(show, height = DEFAULT_HEIGHT) {
  const animatedValue = React.useRef(new Animated.Value(0));

  const bottom = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0],
  });

  React.useEffect(() => {
    if (show) {
      Animated.timing(animatedValue.current, {
        toValue: 1,
        duration: 350,
        easing: Easing.bezier(0.28, 0, 0.63, 1),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue.current, {
        toValue: 0,
        duration: 250,
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start();
    }
  }, [show]);

  return bottom;
}

export function BottomSheet({
  children,
  show,
  height = DEFAULT_HEIGHT,
  onOuterClick,
}) {
  const navigation = useNavigation();
  const {height: screenHeight} = useWindowDimensions();
  const bottom = useAnimatedBottom(show, height);

  return (
    <>
      {show && (
        <Pressable
          onPress={onOuterClick}
          style={[styles.outerOverlay, {height: screenHeight}]}>
          <View />
        </Pressable>
      )}
      <Animated.View style={[styles.bottomSheet, {height, bottom}]}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'white', fontWeight: '600', fontSize: 20}}>
            UPI Id Found
          </Text>
          <Image source={require('../Assets/Images/upi.png')} />
        </View>
        <View>
          <Text style={{color: 'white'}}>Sarvesh Kumar</Text>
          <Text style={{color: 'white'}}>UPI ID: sarveshkumar99903@ybl</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#011A75',
            borderRadius: 12,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}
          onPress={() => navigation.navigate('Checkout')}>
          <Text style={{color: 'white', fontSize: 13, fontWeight: '600'}}>
            Continue to Pay
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  outerOverlay: {
    position: 'absolute',
    width: '110%',
    zIndex: 1,
    backgroundColor: 'black',
    opacity: 0.3,
    marginBottom: 100,
  },
  bottomSheet: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    backgroundColor: '#6583F3',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  folderIcon: {
    width: 40,
    height: 40,
  },
  nameView: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  folderName: {
    fontSize: 20,
    color: 'black',
  },
  folderFunc: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
});

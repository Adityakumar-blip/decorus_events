import {StyleSheet} from 'react-native';

export const TeamStyle = StyleSheet.create({
  TeamHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  TeamChat: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#4369F6',
    marginHorizontal: 10,
  },
  FloatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // To make it circular
    backgroundColor: '#4369F6', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow depth
  },
});

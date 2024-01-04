import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  PreviewM: {
    display: 'flex',
    height: '100%',
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'space-between',
  },
  PreviewH: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  PreviewImg: {
    height: 500,
    width: 'auto',
  },
  SendM: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  SendB: {
    backgroundColor: 'blue',
    padding: 15,
    paddingRight: 25,
    paddingLeft: 25,
    textAlign: 'center',
    borderRadius: 15,
  },
  SendT: {
    fontWeight: '600',
    color: 'white',
  },
});

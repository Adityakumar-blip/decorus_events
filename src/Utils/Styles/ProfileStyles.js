const {StyleSheet} = require('react-native');

export const ProfileStyle = StyleSheet.create({
  ProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  ProfileDetails: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    gap: 25,
    paddingTop: 20,
    paddingBottom: 20,
  },
  Username: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  Email: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E9EFFF',
    height: 60,
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
});

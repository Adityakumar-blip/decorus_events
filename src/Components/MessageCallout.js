import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ChatMessageWithCallout = ({message}) => {
  return (
    <View style={styles.container}>
      <View style={styles.calloutContainer}>
        <View style={styles.callout} />
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 8,
  },
  calloutContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  callout: {
    backgroundColor: 'transparent',
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: 'lightgrey', // Color of the callout
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
  },
  messageContainer: {
    backgroundColor: 'lightgrey', // Background color of the chat bubble
    padding: 10,
    borderTopRightRadius: 20, // Adjust this value as needed
    borderBottomRightRadius: 20, // Adjust this value as needed
    borderBottomLeftRadius: 20, // Adjust this value as needed
    margin: 4,
  },
  messageText: {
    fontSize: 16,
    color: 'black', // Color of the message text
  },
});

export default ChatMessageWithCallout;

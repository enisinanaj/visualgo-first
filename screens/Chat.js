import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";

import ChatEngineCore from "chat-engine";
import typingIndicator from "chat-engine-typing-indicator";

import {MessageEntry} from "chat-engine-react-native";
import {MessageList} from "chat-engine-react-native";


const ChatEngine = ChatEngineCore.create({
  publishKey: "pub-c-eb378a0a-e946-4e80-b587-58e7fb504fe2",
  subscribeKey: "sub-c-96456abe-f710-11e7-acf8-26f7716e5467"
});

const now = new Date().getTime();
const username = ['user', now].join('-');

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: null,
      renderChat: false,
      me: null, 
    };
  }

  componentDidMount() {
    //chatengine throws some warning about timing that is a part of the library itself
    console.disableYellowBox = true;

    
    ChatEngine.connect(username, {
        signedOnTime: now
    }, 'auth-key');
    
    

    ChatEngine.on("$.ready", data => {
      
    });
    
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.renderChat ? (
          <Text> Loading </Text>  
        ) : (
          <View style={{flex:1}}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
            <MessageList chat={this.state.chat} /> 
            <MessageEntry chat={this.state.chat} typingIndicator />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import PubNub from 'pubnub'

class ReactPubNub extends Component {
  render() {
    return (
      null
    )
  }
}

const pubnub = new PubNub({
    subscribeKey: "sub-c-d6949282-0608-11e8-927f-06eb6632f9a6",
    publishKey: "pub-c-0563e033-6782-4e52-b405-9b7dc36dc9a7",
    ssl: true
})

pubnub.addListener({
    message: function(message) {
        console.log(message);
        // handle message
    }
})

pubnub.subscribe({ 
    channels: ['girish'] 
});

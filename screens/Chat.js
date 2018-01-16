import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    ScrollView,
    ListView,
    StyleSheet,
    TouchableOpacity,
    Button
} from 'react-native';

const {width, height} = Dimensions.get('window');

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import ButtonBar from './common/button-bar';
import OnYourMind from './common/onYourMind';
import NewsFeedItem from './common/newsfeed-item';
import CreatePost from './common/create-post';

import {EvilIcons} from '@expo/vector-icons';

import Drawer from './common/drawer';
import MessagesList from './common/messages-list';
import _ from 'lodash';

export default class Chat extends Component {
  constructor(props) {
      super(props);


  }


  renderMessagesList() {
    return (
        <MessagesList/>
    )
  }

  renderTitle(){
    return(
      <Text>
        Messages
      </Text>
    )
  }



  render() {
    return (
        <View>
            {this.renderMessagesList()}
        </View>
    )
}


}


const styles= StyleSheet.create({

})
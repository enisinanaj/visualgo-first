import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  ScrollView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

export default class TaskDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: height
    };
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Done</Text>
      </View>
    );
  }

  renderText() {
    return (
        <View style={{flex: 1, padding: 16, borderBottomColor: Colors.main, borderBottomWidth: 10}}>
            <TextInput autoFocus={true} style={{flex: 1, fontSize: 22,
                fontWeight: '300'}}
                multiline = {true}
                numberOfLines = {4}
                underlineColorAndroid={'rgba(0,0,0,0)'} 
                placeholderTextColor={Colors.grayText} 
                placeholder={"What's on your mind?"}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                borderBottomColor={Colors.gray}
                borderBottomWidth={10}/>
        </View>
    )
}

  render() {
    var {visibleHeight} = this.state;

    return (
      <View style={{height: visibleHeight, borderBottomColor: Colors.gray, borderBottomWidth: 10}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        <ScrollView>
          {this.renderText()}
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});
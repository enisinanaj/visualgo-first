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
  ScrollView,
  Keyboard } from 'react-native';

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

  componentDidMount () {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  componentWillUnmount() {
      Keyboard.removeListener('keyboardWillShow');
      Keyboard.removeListener('keyboardWillHide');
  }

  keyboardWillShow (e) {
      this.setState({keyboardIsOpen: true});
      let newSize = height - e.endCoordinates.height
          this.setState({visibleHeight: newSize, k_visible: true})
  }

  keyboardWillHide (e) {
    this.setState({keyboardIsOpen: false});
      if(this.componentDidMount) {
          this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
      }
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{color: Colors.greyText, fontWeight: '700', fontSize: 18}}>Done</Text>
      </View>
    );
  }

  render() {
    var {visibleHeight} = this.state;
    var textInputHeight = visibleHeight - 80; //80 => renderHeader().height more or less (need to check on Android)
    
    return (
      <View style={{height: visibleHeight}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        <ScrollView>
          <TextInput autoFocus={true} height={textInputHeight}
                style={{fontSize: 22,
                  padding: 20,
                  fontWeight: '300'}}
                multiline = {true}
                underlineColorAndroid={'rgba(0,0,0,0)'} 
                placeholderTextColor={Colors.grayText} 
                placeholder={"Descrivi il Task"}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}/>
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    Platform,
    ScrollView,
    ListView,
    StyleSheet,
    StatusBar,
    TextInput,
    Image,
    TouchableOpacity,
    Button,
    KeyboardAvoidingView
} from 'react-native';

import Drawer from 'react-native-drawer'

import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';
import SearchBar from './common/search-bar';
import DefaultRow from './common/default-row';
import FilterBar from './common/filter-bar';
import NewGroup from './NewGroup';
import BlueMenu from './common/blue-menu';

import {EvilIcons} from '@expo/vector-icons';
import _ from 'lodash';

import moment from 'moment';
import locale from 'moment/locale/it'
import Router from '../navigation/Router';
import { withNavigation } from '@expo/ex-navigation';

const {width, height} = Dimensions.get('window');

@withNavigation
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        visibleHeight: height,
        canLogin: false,
        passTyped: false,
        emailTyped: false,
        email: '',
        pass: '',
        showPasswordLabel: 'Show password',
        secureEntryPassword: true
    };
  }

  _goToLanding = (messageId) => {
    this.props.navigator.push(Router.getRoute('landing'));
  }

  _renderHeader() {
    return (
        <View style={styles.headerView}>
            <View style={{flexDirection: 'row', justifyContent: 'center', width: width}}>
                <Text style={styles.viewTitle}>Login</Text>
            </View>
        </View>);
  }

  emailChanged(email) {
    if(email != ''){
      this.state.emailTyped = true;
    }else{
      this.state.emailTyped = false;
    }

    if(this.state.passTyped && this.state.emailTyped){
      this.state.canLogin = true;
      this.setState({canLogin: true});
    }else{
      this.setState({canLogin: false});
    }
  }

  passwordChanged(pass) {
    if(pass != ''){
      this.state.passTyped = true;
    }else{
      this.state.passTyped = false;
    }

    if (this.state.emailTyped && this.state.passTyped) {
      this.state.canLogin = true;
      this.setState({canLogin: true});
    } else {
      this.setState({canLogin: true});
    }
  }

  LogIn(){
    this.props.navigator.push('landing');
  }

  showPassword(){
    if (this.state.secureEntryPassword) {
      this._passInput.setNativeProps({secureTextEntry: false});
      this.setState({showPasswordLabel: 'Hide password', secureEntryPassword: false});
    } else {
      this._passInput.setNativeProps({secureTextEntry: true});
      this.setState({showPasswordLabel: 'Show password', secureEntryPassword: true});      
    }
  }

  render() {
    var {height, visibleHeight} = this.state;
        return (
          <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
            <Animated.View style={[Platform.OS === "ios" ? styles.containerIOS : styles.containerAndroid, {height}]}/>

            <View style={{flexDirection: 'column', backgroundColor: Colors.white}} resetScrollToCoords={{x: 0, y: 0}}>
              <ScrollView>
                          
                <DefaultRow renderChildren={() => this._renderHeader()} />

                <TouchableOpacity>
                  <View style={[styles.oAuthButton, styles.buttonStyleLinkedin, Shadow.filterShadow]}>
                    <Text style={[styles.oAuthButtonContent, Platform.OS == 'ios' ? styles.loginOauth : {} ]}>LOGIN WITH LINKEDIN</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={[styles.oAuthButton, styles.buttonStyleGoogle, Shadow.filterShadow]}>
                    <Text style={[styles.oAuthButtonContent, Platform.OS == 'ios' ? styles.loginOauth : {} ]}>LOGIN WITH GOOGLE</Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.OrText}>Or... </Text>

                <Text style={styles.grayText}>Enter your e-mail address </Text>

                <View style={[styles.textField]}>
                  <TextInput ref={component => this._emailInput = component} placeholderTextColor={Colors.main} placeholder={'Email'} 
                    style={styles.textFieldContent} onChangeText={(email) => this.emailChanged(email)}/>
                </View>

                <Text style={styles.grayText}>Enter your password </Text>

                <View style={[styles.textField]}>
                  <TextInput ref={component => this._passInput = component} secureTextEntry={true} placeholderTextColor={Colors.main} placeholder={'Password'} 
                    style={styles.textFieldContent} onChangeText={(pass) => this.passwordChanged(pass)}/>
                </View>

                <TouchableOpacity onPress={() => this.showPassword()}>
                  <Text style={styles.ShowPasswordText}>{this.state.showPasswordLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity ref={component => this._buttonLogin = component} disabled={!this.state.canLogin} onPress={() => this.LogIn()}>
                  <View style={[styles.buttonLoginDisabled, styles.oAuthButton, Shadow.filterShadow]}>
                    <Text style={[styles.oAuthButtonContent, styles.loginText]}>LOGIN</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.ForgottenText}>Forgotten your password?</Text>
                </TouchableOpacity>

              </ScrollView>
            
            </View>
            
          </KeyboardAvoidingView>

        )
    }
}

const drawerStyles = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  containerIOS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.main,
    paddingTop: 20,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: 1,
  },

  containerAndroid:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    backgroundColor: Colors.main,
    paddingTop: 24,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: 1,
  },

  oAuthButtonContent: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: '100',
    paddingTop: 5
  },

  oAuthButton: {
    flexDirection: 'column',
    borderRadius: 25,
    padding: 10,
    height: 50,
    marginRight: 40,
    marginLeft: 40, 
    minWidth: 75,
    marginTop: 20,
    alignItems: 'center'
  },

  buttonStyleLinkedin: {
      backgroundColor: '#2F77B0'
  },

  buttonStyleGoogle: {
    backgroundColor: '#4F86EC'
  },

  buttonLoginEnabled: {
    backgroundColor: Colors.main,
  },

  buttonLoginDisabled: {
    backgroundColor: Colors.borderGray,
  },

  loginText: {
    color: Colors.black
  },

  textField: {
    marginLeft: 40,
    marginRight: 40,
    borderBottomColor: Colors.grayText,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 5,
    paddingTop: 5,
    height: 55,
    marginTop: 0,
    marginBottom: 5
  },

  textFieldContent: {
    fontSize: 52,
    fontWeight: '100'
  },

  viewTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.main,
    justifyContent: 'center',
  },

  OrText:{
    fontSize: 16,
    fontWeight: '800',
    color: Colors.main,
    marginLeft: 40,
    marginTop: 20,
  },

  grayText:{
    fontSize: 14,
    fontWeight: '100',
    color: Colors.grayText,
    marginLeft: 40,
    marginTop: 20,
  },

  ShowPasswordText:{
    fontSize: 16,
    fontWeight: '800',
    color: Colors.main,
    marginLeft: 40,
    marginTop: 0,
    marginBottom: 15
  },

  ForgottenText:{
    fontSize: 16,
    fontWeight: '800',
    color: Colors.yellow,
    marginLeft: 40,
    marginTop: 25,
    marginBottom: 30
  },

  headerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 5,
    paddingBottom: 5,   
  }
});
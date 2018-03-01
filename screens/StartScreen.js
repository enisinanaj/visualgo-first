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
    Keyboard,
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
import {Font, AppLoading} from "expo";

import {EvilIcons} from '@expo/vector-icons';
import _ from 'lodash';
import {NavigationActions} from 'react-navigation';

import moment from 'moment';
import locale from 'moment/locale/it'

const {width, height} = Dimensions.get('window');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {isReady: false};
  }

  componentDidMount() {
    this.loadFonts();
  }

  async loadFonts() {
      await Font.loadAsync({
        'roboto': require('../assets/fonts/Roboto-Thin.ttf'),
        'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf')
      });

      this.setState({ isReady: true });
  }

  logIn() {
    this.props.navigation.push('Login');
  }

  render() {
    var {visibleHeight} = this.state;

    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.welcomeLabel, {marginTop: 50}]}>Welcome to VisualGo!</Text>

            <TouchableOpacity>
              <View style={[styles.oAuthButton, styles.buttonStyleEmail]}>
                <Text style={[styles.oAuthButtonContent, Platform.OS == 'ios' ? styles.loginOauth : {} ]}>REGISTER WITH EMAIL</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={[styles.oAuthButton, styles.buttonStyleLinkedin]}>
                <Text style={[styles.oAuthButtonContent, Platform.OS == 'ios' ? styles.loginOauth : {} ]}>CONTINUE WITH GOOGLE</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={[styles.oAuthButton, styles.buttonStyleGoogle]}>
                <Text style={[styles.oAuthButtonContent, Platform.OS == 'ios' ? styles.loginOauth : {} ]}>CONTINUE WITH GOOGLE</Text>
              </View>
            </TouchableOpacity>

            <Text style={[styles.welcomeLabel, {marginTop: 30}]}>OR</Text>

            <TouchableOpacity ref={component => this._buttonLogin = component} onPress={() => this.logIn()}>
              <View style={[styles.buttonLoginDisabled, styles.oAuthButton]}>
                <Text style={[styles.oAuthButtonContent, styles.loginText]}>LOGIN</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.notice}>By continuing you agree to VisualGo terms of service and privacy policy</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  welcomeLabel: {
    fontSize: 50,
    fontFamily: 'roboto',
    color: Colors.main,
    marginLeft: 40,
    marginRight: 40
  },
  notice:{
    fontFamily: 'roboto',
    color: Colors.main,
    marginLeft: 40,
    marginRight: 40,
    fontSize: 18,
    marginTop: 40
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    paddingTop: 3.5,
    backgroundColor: 'transparent'
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

  buttonStyleEmail: {
      backgroundColor: Colors.main,
      fontFamily: 'roboto'
  },

  buttonStyleLinkedin: {
    backgroundColor: '#2F77B0',
    fontFamily: 'roboto'
  },

  buttonStyleGoogle: {
    backgroundColor: '#4F86EC',
    fontFamily: 'roboto'
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
    fontFamily: 'roboto'
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
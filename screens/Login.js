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

import {Font, AppLoading} from 'expo';
import Drawer from 'react-native-drawer'

import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';
import DefaultRow from './common/default-row';

import {EvilIcons} from '@expo/vector-icons';
import _ from 'lodash';
import {NavigationActions} from 'react-navigation';

import moment from 'moment';
import locale from 'moment/locale/it'

const {width, height} = Dimensions.get('window');

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
        secureEntryPassword: true,
        keyboardIsOpen: false,
        isReady: false,
        emailFieldFocused: false,
        passwordFieldFocused: false
    };
  }

  componentDidMount () {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    this.loadFonts();
  }

  async loadFonts() {
      await Font.loadAsync({
        'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
        'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
        'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf'),
        'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf')
      });

      this.setState({ isReady: true });
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

  _goBack() {
    this.props.navigation.goBack();
  }

  _renderHeader() {
    return (
        <View style={styles.headerView}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: width}}>
              <EvilIcons name={"chevron-left"} size={30} onPress={() => this._goBack()} color={Colors.main} style={{width: 22}}/>
              <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                <Text style={styles.viewTitle}>Login</Text>
              </View>
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
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
          NavigationActions.push({routeName: 'Index'})
      ]
    });
    this.props.navigation.dispatch(resetAction);
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
    var {visibleHeight} = this.state;
    
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" backgroundColor={Colors.main}/>}
        <Animated.View style={[Platform.OS === "ios" ? styles.containerIOS : styles.containerAndroid, {height: 0}]}/>

        <View style={{flexDirection: 'column', backgroundColor: Colors.white, height: height - 20}} resetScrollToCoords={{x: 0, y: 0}}>
            <DefaultRow renderChildren={() => this._renderHeader()} />

            {!this.state.keyboardIsOpen? 
              <View>
                <TouchableOpacity>
                  <View style={[styles.oAuthButton, styles.buttonStyleLinkedin]}>
                    <Text style={[styles.oAuthButtonContent, Platform.OS == 'ios' ? styles.loginOauth : {} ]}>LOGIN WITH LINKEDIN</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={[styles.oAuthButton, styles.buttonStyleGoogle]}>
                    <Text style={[styles.oAuthButtonContent, Platform.OS == 'ios' ? styles.loginOauth : {} ]}>LOGIN WITH GOOGLE</Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.OrText}>Or... </Text>
              </View>
            : null}

            <Text style={styles.grayText}>Enter your e-mail address </Text>

            <View style={[styles.textField]}>
              <TextInput ref={component => this._emailInput = component} placeholderTextColor={Colors.main} placeholder={'Email'} 
                style={styles.textFieldContent} onChangeText={(email) => this.emailChanged(email)}
                onFocus={() => this.setState({emailFieldFocused: true})} onBlur={() => this.setState({emailFieldFocused: false})}/>
              {this.state.emailFieldFocused ? 
                <TouchableOpacity onPress={() => {this._emailInput.clear()}}>
                  <EvilIcons name={"close-o"} size={26} color={Colors.main} style={{position: 'absolute', right: 0, bottom: 10}}/>
                </TouchableOpacity>
                : null}
            </View>

            <Text style={styles.grayText}>Enter your password </Text>

            <View style={[styles.textField]}>
              <TextInput ref={component => this._passInput = component} secureTextEntry={true} placeholderTextColor={Colors.main} placeholder={'Password'} 
                style={styles.textFieldContent} onChangeText={(pass) => this.passwordChanged(pass)}
                onFocus={() => this.setState({passwordFieldFocused: true})} onBlur={() => this.setState({passwordFieldFocused: false})}/>
              {this.state.passwordFieldFocused ? 
                <TouchableOpacity onPress={() => {this._passInput.clear()}}>
                  <EvilIcons name={"close-o"} size={26} color={Colors.main} style={{position: 'absolute', right: 0, bottom: 10}}/>
                </TouchableOpacity>
                : null}
            </View>

            <TouchableOpacity onPress={() => this.showPassword()}>
              <Text style={styles.ShowPasswordText}>{this.state.showPasswordLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity ref={component => this._buttonLogin = component} disabled={!this.state.canLogin} onPress={() => this.LogIn()}>
              <View style={[styles.buttonLoginDisabled, styles.oAuthButton]}>
                <Text style={[styles.oAuthButtonContent, styles.loginText]}>LOGIN</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.ForgottenText}>Forgotten your password?</Text>
            </TouchableOpacity>
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
    marginTop: 17,
    alignItems: 'center',
    fontFamily: 'roboto-thin'
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
    fontSize: 50,
    fontFamily: 'roboto-thin'
  },

  viewTitle: {
    fontSize: 20,
    marginLeft: -11,
    color: Colors.main,
    justifyContent: 'center',
    fontFamily: 'roboto-bold'
  },

  OrText:{
    fontSize: 16,
    color: Colors.main,
    marginLeft: 40,
    marginTop: 20,
    fontFamily: 'roboto-bold'
  },

  grayText:{
    fontSize: 14,
    color: Colors.grayText,
    marginLeft: 40,
    marginTop: 20,
    fontFamily: 'roboto-thin'
  },

  ShowPasswordText:{
    fontSize: 16,
    color: Colors.main,
    marginLeft: 40,
    marginTop: 0,
    marginBottom: 15,
    fontFamily: 'roboto-bold'
  },

  ForgottenText:{
    fontSize: 16,
    color: Colors.yellow,
    marginLeft: 40,
    marginTop: 15,
    marginBottom: 30,
    fontFamily: 'roboto-bold'
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
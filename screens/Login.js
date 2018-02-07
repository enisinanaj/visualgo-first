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
export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
        visibleHeight: height,
        canLogin: false,
        passTyped: false,
        emailTyped: false
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

  emailChanged() {
    this.state.emailTyped = true;

    if(this.state.passTyped == true){
      this.state.canLogin = true;
      this._buttonLogin.setNativeProps({style: styles.buttonLoginEnabled});
      this.setState({canLogin: true});
      //this._buttonLogin.setNativeProps({disabled: false});

    }


  }

  passwordChanged() {
    this.state.passTyped = true;

    if(this.state.emailTyped == true){
      this.state.canLogin = true;
      this._buttonLogin.setNativeProps({style: styles.buttonLoginEnabled});
      this.setState({canLogin: true});
      //this._buttonLogin.setNativeProps({disabled: false});

    }

    

  }

  LogIn(){
    this.props.navigator.push('landing');
  }

  showPassword(){
    this._passInput.setNativeProps({secureTextEntry: false});
  }

  render() {
    var {height, visibleHeight} = this.state;
        return (
          <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
            <Animated.View style={[Platform.OS === "ios" ? styles.containerIOS : styles.containerAndroid, {height}]}/>
            <ScrollView>
            <View style={{flexDirection: 'column', backgroundColor: Colors.white}} resetScrollToCoords={{x: 0, y: 0}}>



                          
                          <DefaultRow renderChildren={() => this._renderHeader()} />

                          <TouchableOpacity style={styles.buttonStyleLinkedin}>
                            <Text style={styles.buttonContentStyleLinkedin}>LOGIN WITH LINKEDIN</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.buttonStyleGoogle}>
                            <Text style={styles.buttonContentStyleGoogle}>LOGIN WITH FACEBOOK</Text>
                          </TouchableOpacity>

                          <Text style={styles.OrText}>Or... </Text>

                          <Text style={styles.grayText}>Enter your e-mail address </Text>

                          <View style={styles.searchBarContainer}>
                            <TextInput placeholderTextColor={Colors.main} placeholder={'Email'} style={styles.searchBar} onChangeText={() => this.emailChanged()}/>
                          </View>

                          <Text style={styles.grayText}>Enter your password </Text>

                          <View style={styles.searchBarContainer}>
                            <TextInput ref={component => this._passInput = component} secureTextEntry={true} placeholderTextColor={Colors.main} placeholder={'Password'} style={styles.searchBar} onChangeText={() => this.passwordChanged()}/>
                          </View>

                          <TouchableOpacity onPress={() => this.showPassword()}>
                            <Text style={styles.ShowPasswordText}>Show Password</Text>
                          </TouchableOpacity>

                          <TouchableOpacity ref={component => this._buttonLogin = component} disabled={!this.state.canLogin} style={styles.buttonLoginDisabled} onPress={() => this.LogIn()}>
                            <Text style={styles.buttonContentStyleGoogle}>LOGIN</Text>
                          </TouchableOpacity>

                          <TouchableOpacity>
                            <Text style={styles.ForgottenText}>Forgotten your password?</Text>
                          </TouchableOpacity>

                 

                  
            
            
            </View>
            </ScrollView>
            
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

  buttonContentStyleLinkedin: {

    textAlign: 'center',
    color: Colors.white,
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: '100',
},

buttonContentStyleGoogle: {

  textAlign: 'justify',
  color: Colors.white,
  fontSize: 20,
  paddingBottom: 10,
  fontWeight: '100',
},

  buttonStyleLinkedin: {
    flexDirection: 'column',
    borderRadius: 25,
    padding: 10,
    height: 50,
    marginRight: 40,
    marginLeft: 40, 
    minWidth: 75,
    marginTop: 20,
  
    backgroundColor: '#2F77B0',
    alignItems: 'center'
    //fontFamily: 'Roboto-Light'
},

buttonStyleGoogle: {
  flexDirection: 'column',
  borderRadius: 25,
  padding: 10,
  height: 50,
  marginRight: 40,
  marginLeft: 40,
  minWidth: 75,
  marginTop: 20,
  
  backgroundColor: '#4F86EC',
  alignItems: 'center'
  //fontFamily: 'Roboto-Light'
},

buttonLoginEnabled: {
  flexDirection: 'column',
  borderRadius: 25,
  padding: 10,
  height: 50,
  marginRight: 40,
  marginLeft: 40,
  minWidth: 75,
  marginTop: 20,
  
  backgroundColor: '#4F86EC',
  alignItems: 'center'
  //fontFamily: 'Roboto-Light'
},

buttonLoginDisabled: {
  flexDirection: 'column',
  borderRadius: 25,
  padding: 10,
  height: 50,
  marginRight: 40,
  marginLeft: 40,
  minWidth: 75,
  marginTop: 20,
  
  backgroundColor: Colors.gray,
  alignItems: 'center'
  //fontFamily: 'Roboto-Light'
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
      marginTop: 30,

    },

    ShowPasswordText:{
      fontSize: 16,
      fontWeight: '800',
      color: Colors.main,
      marginLeft: 40,
      marginTop: 0,

    },

    ForgottenText:{
      fontSize: 16,
      fontWeight: '800',
      color: '#FBD54A',
      marginLeft: 40,
      marginTop: 20,

    },

    grayText:{
      fontSize: 14,
      fontWeight: '100',
      color: Colors.gray,
      marginLeft: 40,
      marginTop: 30,

    },

    headerView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingTop: 5,
      paddingBottom: 5,
      
  },
    selectableDisplayPicture: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    unreadMessage: {
        fontWeight: '800'
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'grey',
    },
    innerContainer: {
      alignItems: 'center',
    },
    rowContainer: {
      padding: 5,
      flex: 1,
      flexDirection: 'row'
    },
    textInRow: {
      marginLeft: 10,
      marginTop: 5,
      flex: 1,
      flexDirection: 'column',
    },
    rowTitle: {
      fontWeight: '400',
      fontSize: 18
    },
    rowSubTitle: {
      color: Colors.grayText,
      fontSize: 14
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        
    },
    messageDate: {
        paddingTop: 17
    },
    listView: {
      backgroundColor: Colors.white,
      flexDirection: 'column'
      
    },
    searchBarContainer: {
      alignItems: 'center',
      height: 60,
      marginLeft: 40,
      flexDirection: 'column',
      marginRight: 40,
      marginLeft: 40, 
      minWidth: 75,
    },
    searchBar: {
      flex: 1,
      color: Colors.main,
      fontSize: 28,
      marginLeft: 0,
      paddingBottom: 8,
      width: 314,
    }
  });
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

const {width, height} = Dimensions.get('window');
const messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                  {from: {name: 'Andy', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo', read: true, date: new Date()},
                  {from: {name: 'Ivan', image: require('./img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
        messages: ds.cloneWithRows(messages),
        createNewGroup: false,
        visibleHeight: height,
    };

    this._onDrawerOpen = this._onDrawerOpen.bind(this);
  }

  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };

  toggleMenu = () => {
      if(this._drawer.props.open){
          this._drawer.close()
      }else{
          this._drawer.open()
      }


  };

  
  renderDrawer() {
    return (
        <Drawer/>
    )
  }

  _onDrawerOpen(event) {
      const e = event.nativeEvent;
      const offset = e.contentOffset.x;
      this.offsetX.setValue(offset);
  }

  renderMessageRow(data) {
    return (
        <View style={styles.rowContainer}>
            <TouchableOpacity  onPress={() => this._goToConvo(1)} style={styles.rowContainer}>
                <Image source={data.from.image} style={styles.selectableDisplayPicture} />
                <View style={styles.textInRow}>
                    <Text style={[styles.rowTitle, !data.read ? styles.unreadMessage : {}]}>{data.from.name}</Text>
                    <Text style={styles.rowSubTitle}>{data.message}</Text>
                </View>
                <Text style={styles.messageDate}>{moment(data.date).locale("it").format("LT")}</Text>
            </TouchableOpacity>
        </View>);
  }

  _goToConvo = (messageId) => {
    this.props.navigator.push(Router.getRoute('conversation', {convTitle: 'Andy'}));
  }
  
  _renderRow(data) {
    return <DefaultRow arguments={data} noborder={true} renderChildren={() => this.renderMessageRow(data)} />
  }

  _goToNewGoup() {
    this.setState({createNewGroup: true});
  }

  renderNewGroupModal() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.createNewGroup}
        onRequestClose={() => this.setState({createNewGroup: false})}>
        <NewGroup closeModal={() => this.setState({createNewGroup: false})}/>
      </Modal>
    );
  }

  renderFilters() {
    filters = [{type: 'search', searchPlaceHolder: 'Search'},
          {title: 'All', selected: true, active: true},
          {title: 'Group', selected: false, active: true},
          {title: 'Active', selected: false, active: true},
          {title: 'New', active: false, onPress: () => this._goToNewGoup()}];
    return <View style={styles.filterBarContainer}><FilterBar data={filters} customStyle={{height: 100}} headTitle={"Messages"} /></View>
  }

  _renderHeader() {
    return (
        <View style={styles.headerView}>
            
            <View style={{flexDirection: 'row', justifyContent: 'center', width: width}}>
                <Text style={styles.viewTitle}>Login</Text>
                
            </View>
        </View>);
  }

  render() {
    var {height, visibleHeight} = this.state;
        return (
          <View style={{flex: 1}}>


                    <View style={{flexDirection: 'column', backgroundColor: Colors.white, height}}>
                        <Animated.View style={[Platform.OS === "ios" ? styles.containerIOS : styles.containerAndroid, {height}]}/>
                        <DefaultRow renderChildren={() => this._renderHeader()} />

                        <TouchableOpacity style={styles.buttonStyleLinkedin}>
                          <Text style={styles.buttonContentStyleLinkedin}>LOGIN WITH LINKEDIN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonStyleGoogle}>
                          <Text style={styles.buttonContentStyleGoogle}>LOGIN WITH FACEBOOK</Text>
                        </TouchableOpacity>

                        <Text style={styles.OrText}>Or... </Text>

                    </View>

                
          
          
          </View>

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
      marginLeft: 20,
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
      
    }
  });
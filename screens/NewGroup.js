import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Modal,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Image,
  TouchableOpacity,
  ListView,
  Dimensions,
    Platform } from 'react-native';

import DefaultRow from './common/default-row';
import FilterBar from './common/filter-bar';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

import {EvilIcons, SimpleLineIcons, MaterialIcons} from '@expo/vector-icons';
import _ from 'lodash';

import moment from 'moment';
import locale from 'moment/locale/it'
import Router from '../navigation/Router';

var messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                  {from: {name: 'me', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo', read: true, date: new Date()},
                  {from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {width, height} = Dimensions.get('window');

const people = [
    {title: 'Roseanne Font', subtitle: 'Milan Store', img: require('./img/elmo.jpg'), selected: false }, 
    {title: 'Denis Mcgraw', subtitle: 'Rome Store', img: require('./img/bob.png'), selected: false },
    {title: 'Love Guerette', subtitle: 'Paris Store', img: require('./img/cookiemonster.jpeg'), selected: false },
    {title: 'Marget Divers', subtitle: 'London Store', img: require('./img/elmo.jpg'), selected: false },
    {title: 'Moriah Fewell', subtitle: 'Shanghai Store', img: require('./img/me.png'), selected: false }];

export default class NewGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            convoMessages: ds.cloneWithRows(messages),
            visibleHeight: height,
            newMessage: '',
            contentLayout: {}
        }
    }

    _goBack() {
        this.props.navigator.pop();
    }

    renderHeader() {
        return (
            <View style={{backgroundColor: '#FFF', paddingTop: Platform.OS === 'ios' ? 36 : 16, borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                <TouchableOpacity onPress={this.props.closeModal}>
                    <Text>
                        <EvilIcons name={"close"} size={22} color={Colors.main}/>
                    </Text>
                </TouchableOpacity>
                <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>Select People</Text>
                <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Create</Text>
            </View>
        )
    }

    toggleRow(rowData) {
        rowData.selected = !rowData.selected;
    
        if(rowData.selected) {
          rowData.category = currentCategory;
          this.state.selectedTags.push(rowData);
        } else {
          this.setState({selectedTags: this.state.selectedTags.filter(value => value != rowData)});
        }
    
        this.setState({tagSource: ds.cloneWithRows(tagsToShow)});
      }
    
  renderTagRow(data) {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => this.toggleRow(data)} style={styles.rowContainer}>
          {this.renderSelectableComponent(data)}
          <View style={styles.textInRow}>
            <Text style={[styles.rowTitle, data.selected ? styles.rowSelected : {}]}>{data.title}</Text>
            <Text style={styles.rowSubTitle}>{data.subtitle}</Text>
          </View>
        </TouchableOpacity>
      </View>);
  }

  renderSelectableComponent(data) {
    if (data.img == undefined) {
      return (
        <Ionicons name={data.selected ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} 
              size={30} color={data.selected ? Colors.main : Colors.gray} />
      );
    }
    
    return (
      <Image source={data.img} style={[styles.selectableDisplayPicture,
        data.selected ? styles.selectedDisplayPicture : {}]} />
    );
  }

    _renderRow(data) {
        return <DefaultRow arguments={data} renderChildren={() => this.renderTagRow(data)} />
      }

    _addMessage() {
        if (this.state.newMessage == "") {
            return;
        }
        
        var {newMessage} = this.state;
        messages.push(
            {from: {name: 'me', image: require('./img/elmo.jpg')}, message: newMessage, read: false, date: new Date()}
        );

        this.setState({convoMessages: ds.cloneWithRows(messages)});
        this.refs['newMessageTextInput'].clear();
        this.setState({newMessage: ""}); 
        this.refs['conversationCollection'].scrollToEnd();
    }

    renderFilters() {
        filters = ['0'];
        return <View style={styles.filterBarContainer}><FilterBar data={filters} customStyle={{height: 100}} headTitle={"People"} /></View>
      }

    render() {
        var {height, visibleHeight} = this.state;
        return (
            <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}}>
                <View style={[Platform.OS === 'ios' ? styles.statusIOSBackground : styles.statusAndroidBackground]}/>
                <StatusBar barStyle={'light-content'} animated={true}/>

                    


                        {this.renderHeader()}

                        
                        <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />

                    
            </View>
        );
    }
}


const messageBoxStyle = StyleSheet.create({
    newMessageAreaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        paddingBottom: 10
    },
    attachmentBackground: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Colors.main,
        marginLeft: 10,
        marginRight: 10
    },
    attachmentButton: {
        padding: 0,
        marginTop: 8,
        marginLeft: 5,
        backgroundColor: 'transparent'
    },
    textBoxContainer: {
        width: width - 115,
        borderRadius: 22,
        backgroundColor: Colors.lightGray,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 40,
        marginRight: 10
    },
    textArea: {
        backgroundColor: 'transparent',
        color: Colors.black,
        width: width - 120 - 22,
        height: 40,
        paddingLeft: 15,
        paddingRight: 15
    },
    openEmoticons: {
        marginTop: 9,
        marginRight: 10,
        backgroundColor: 'transparent'
    },
    sendButton: {
        marginTop: 7,
        marginRight: 10
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    listView: {
        paddingTop: 10,
        flex: 1
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingTop: 5,
        paddingBottom: 5,
        height: 30,
    },
    statusIOSBackground: {
        backgroundColor: Colors.main,
        height: 20,
        width: width
    },
    statusAndroidBackground: {
        backgroundColor: Colors.main,
        height: 24,
        width: width
    },

    statusBlackBackground: {

    },
    viewTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2
    },
    displayPicture: {
        marginLeft: 10,
        marginRight: 5,
        height: 44,
        width: 44,
        borderRadius: 22
    },
    convoContainer: {
        flex: 1, 
        justifyContent: 'space-between', 
    },
    messageBubble: {
        backgroundColor: Colors.borderGray,
        padding: 10,
        borderRadius: 25,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-end'
    },
    fromBubble: {
        borderRadius: 25,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-start'
    },
    attachment: {
        backgroundColor: Colors.main,
        borderRadius: 22,
        margin: 5,
        height: 44
    },
    messageBox: {
        borderRadius: 22,
        backgroundColor: Colors.lightGray,
        borderWidth: 2,
        borderColor: Colors.borderGray,
    }
});
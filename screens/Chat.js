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
    StatusBar,
    Image,
    TouchableOpacity,
    Button
} from 'react-native';

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import DefaultRow from './common/default-row';
import FilterBar from './common/filter-bar';

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
    };
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

  renderFilters() {
    filters = ['0',
          {title: 'All', selected: true},
          {title: 'Group', selected: false},
          {title: 'Active', selected: false}];
    return <View style={styles.filterBarContainer}><FilterBar data={filters} customStyle={{height: 100}} headTitle={"Messages"} /></View>
  }

  render() {
        return (
            <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                <SearchBar ref='searchBar'/>
                <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />
                <ListView
                    style={styles.listView}
                    onScroll={this._onScroll}
                    dataSource={this.state.messages}
                    renderRow={(data) => this._renderRow(data)}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
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
    }
  });
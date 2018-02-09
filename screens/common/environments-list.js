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
  TextInput,
  Platform,
  Dimensions } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

import _ from 'lodash';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

const environment = [
  {title: 'Front Door', color: Colors.borderGray, id: 1},
  {title: 'Main window', color: Colors.chat_bg, id: 2},
  {title: 'Cash Desk', color: Colors.chat_line, id: 3},
  {title: 'Main window 2 Floor', color: Colors.gray, id: 4},
  {title: 'Entrance', color: Colors.liked, id: 5},
  {title: 'Entrance 2 Floor', color: Colors.main, id: 6},
  {title: 'Cash Desk 2 Floor', color: Colors.black, id: 7},
  {title: 'Windows', color: Colors.oldMain, id: 8},
  {title: '2 Floor', color: Colors.main, id: 9}];

var environmentsToShow = environment;
var currentCategory = "environment";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class EnvironmentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      environmentSource: ds.cloneWithRows(environmentsToShow),
      selectedEnvironments: []
    };

    this._onScroll = this._onScroll.bind(this);
    this.loadMore = _.debounce(this.loadMore, 300);
  }

  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
        this.setState({refreshing: false});
    }, 1500)
  }

  _onScroll(event) {
    const e = event.nativeEvent;
    const l_height = e.contentSize.height;
    const offset = e.contentOffset.y;

    this.offsetY = offset;

    if(offset + this.content_height >= l_height) {
        this.loadMore();
    }
  }

  loadMore() {
    this.setState({loading: true});
    this.setState({environmentSource: ds.cloneWithRows(environmentsToShow)});
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
            <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    );
  }

  renderFilters() {
    filters = [{type: 'search', searchPlaceHolder: 'Search Environments', fixedOpen: true, autoFocus: false}];
    return <View style={styles.filterBarContainer}><FilterBar data={filters} customStyle={{height: 100}} headTitle={"or Pick One"}/></View>
  }

  filterForEnvironments() {
    this.setState({environmentSource: ds.cloneWithRows(environments)});
    currentCategory = 'environments';
    environmentsToShow = environments;
  }

  renderCreateEnvironment() {
    return (
        <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row', height: 56,
                justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
            <TextInput autoFocus={false} style={{height: 30, fontSize: 18, textAlignVertical: 'center', 
                fontWeight: '300', width: width}}
                underlineColorAndroid={'rgba(0,0,0,0)'} 
                placeholderTextColor={Colors.grayText} 
                placeholder={"Create new Environment"}/>
        </View>
    )
  }

  toggleRow(rowData) {
    rowData.selected = !rowData.selected;

    if(rowData.selected) {
      rowData.category = currentCategory;
      this.state.selectedEnvironments.push(rowData);
    } else {
      this.setState({selectedEnvironments: this.state.selectedEnvironments.filter(value => value != rowData)});
    }

    this.setState({environmentSource: ds.cloneWithRows(environmentsToShow)});
  }

  renderSelectableComponent(data) {
    if (data.color != undefined) {
      return (
        <FontAwesome name={"circle"} 
              size={30} color={data.color} />
      );
    }
    
    return (
      <Image source={data.img} style={[styles.selectableDisplayPicture,
        data.selected ? styles.selectedDisplayPicture : {}]} />
    );
  }

  renderEnvironmentRow(data) {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => this.props.closeModal(this.state.selectedEnvironments)} style={styles.rowContainer}>
          {this.renderSelectableComponent(data)}
          <View style={styles.textInRow}>
            <Text style={[styles.rowTitle, data.selected ? styles.rowSelected : {}]}>{data.title}</Text>
          </View>
        </TouchableOpacity>
      </View>);
  }

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderEnvironmentRow(data)} />
  }

  _renderSelectedEnvironmentElement(data) {
    if (data.category != 'managers') {
      return (
      <TouchableOpacity onPress={() => this.toggleRow(data)}>
        <Text style={{color: Colors.white, marginRight: 13, marginTop: 10}}>{data.title}</Text>
      </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => this.toggleRow(data)}>
          <Image source={data.img} style={styles.selectedDisplayPictureInFooter} />
        </TouchableOpacity>
      ) 
    }
  }

  _renderSelectedEnvironments() {
    var dataSource = ds.cloneWithRows(this.state.selectedEnvironments);
    var result = <ListView
        dataSource={dataSource}
        horizontal={true}
        renderRow={(data) => this._renderSelectedEnvironmentElement(data)}
        
      />;

    return result;
  }

  render() {
    return (
      <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        {this.renderCreateEnvironment()}
        <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />
        <ListView
          style={styles.listView}
          onScroll={this._onScroll}
          dataSource={this.state.environmentSource}
          renderRow={(data) => this._renderRow(data)}
         
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInRow: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  rowTitle: {
    fontWeight: '200',
    fontSize: 24,
    color: Colors.grayText
  },
  rowSubTitle: {
    color: Colors.grayText,
    fontSize: 14
  },
  rowSelected: {
    color: Colors.main
  },
  selectedEnvironments: {
    backgroundColor: Colors.main,
    padding: 0,
    margin: 0,
  },
  selectableDisplayPicture: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  selectedDisplayPictureInFooter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 13
  },
  selectedDisplayPicture: {
    borderWidth: 3,
    borderColor: Colors.main
  },
  filterBarContainer: {
      backgroundColor: Colors.white
  }
});
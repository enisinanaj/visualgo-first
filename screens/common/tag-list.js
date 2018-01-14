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
  ListView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

import _ from 'lodash';

const clusters = [
  {title: 'Flagship', subtitle: '28 Negozi', selected: false }, 
  {title: 'Mall', subtitle: '28 Negozi', selected: false },
  {title: 'Fashion', subtitle: '47 Negozi', selected: false },
  {title: 'Luxury', subtitle: '20 Negozi', selected: false },
  {title: 'Popular', subtitle: '52 Negozi', selected: false },
  {title: 'Outlet', subtitle: '24 Negozi', selected: false },
  {title: 'Travel', subtitle: '24 Negozi', selected: false }];

const stores = [
  {title: 'Flagship', subtitle: '28 Negozi', selected: false }, 
  {title: 'Mall', subtitle: '28 Negozi', selected: false },
  {title: 'Fashion', subtitle: '47 Negozi', selected: false }];

const managers = [
  {title: 'Roseanne Font', subtitle: 'Milan Store', img: require('../img/elmo.jpg'), selected: false }, 
  {title: 'Denis Mcgraw', subtitle: 'Rome Store', img: require('../img/bob.png'), selected: false },
  {title: 'Love Guerette', subtitle: 'Paris Store', img: require('../img/cookiemonster.jpeg'), selected: false },
  {title: 'Marget Divers', subtitle: 'London Store', img: require('../img/elmo.jpg'), selected: false },
  {title: 'Moriah Fewell', subtitle: 'Shanghai Store', img: require('../img/me.png'), selected: false }];

var tagsToShow = clusters;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class TagList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagSource: ds.cloneWithRows(tagsToShow)
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

    if(offset > this.offsetY) {
        console.log('scrolling down');
    } else {
        console.log('scrolling up');
    }

    this.offsetY = offset;

    if(offset + this.content_height >= l_height) {
        console.log('end');
        console.log('moar!!!.....');
        this.loadMore();
    }
  }

  loadMore() {
    console.log('should load more');
    this.setState({loading: true});
    this.setState({tagSource: ds.cloneWithRows(tagsToShow)});
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Text>
              <EvilIcons name={"close"} size={22} color={Colors.main}/>
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>Tags</Text>
          <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Done</Text>
      </View>
    );
  }

  renderFilters() {
    filters = ['0', 
      {title: 'Clusters', selected: true, onSelected: () => this.filterForClusters()},
      {title: 'Store', selected: false, onSelected: () => this.filterForStores()},
      {title: 'Manager', selected: false, onSelected: () => this.filterForManagers()}];
    return <FilterBar data={filters} />
  }

  filterForClusters() {
    this.setState({tagSource: ds.cloneWithRows(clusters)});
    tagsToShow = clusters;
  }

  filterForManagers() {
    this.setState({tagSource: ds.cloneWithRows(managers)});
    tagsToShow = managers;
  }

  filterForStores() {
    this.setState({tagSource: ds.cloneWithRows(stores)});
    tagsToShow = stores;
  }

  toggleRow(rowData) {
    rowData.selected = !rowData.selected;
    this.setState({tagSource: ds.cloneWithRows(tagsToShow)});
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

  renderTagRow(data) {
    console.log("renderTagRow" + data);
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

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderTagRow(data)} />
  }

  render() {
    return (
      <View style={{height: this.state.visibleHeight}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        <DefaultRow renderChildren={() => this.renderFilters()} arguments={{}} />
        <ListView
          style={styles.listView}
          onScroll={this._onScroll}
          dataSource={this.state.tagSource}
          renderRow={(data) => this._renderRow(data)}
        />
        <View style={styles.selectedTags}></View>
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
    fontWeight: '400',
    fontSize: 18
  },
  rowSubTitle: {
    color: Colors.grayText,
    fontSize: 14
  },
  rowSelected: {
    color: Colors.main
  },
  selectedTags: {
    height: 0
  },
  selectableDisplayPicture: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  selectedDisplayPicture: {
    borderWidth: 3,
    borderColor: Colors.main
  }
});
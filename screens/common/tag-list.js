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
var currentCategory = "clusters";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class TagList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagSource: ds.cloneWithRows(tagsToShow),
      selectedTags: []
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
      {title: 'Clusters', selected: true, onSelected: () => this.filterForClusters(), headTitle: 'Clusters'},
      {title: 'Store', selected: false, onSelected: () => this.filterForStores(), headTitle: 'Stores'},
      {title: 'Manager', selected: false, onSelected: () => this.filterForManagers(), headTitle: 'Managers'}];
    return <View style={styles.filterBarContainer}><FilterBar data={filters} customStyle={{height: 100}} headTitle={"Clusters"}/></View>
  }

  filterForClusters() {
    this.setState({tagSource: ds.cloneWithRows(clusters)});
    currentCategory = 'clusters';
    tagsToShow = clusters;
  }

  filterForManagers() {
    this.setState({tagSource: ds.cloneWithRows(managers)});
    currentCategory = 'managers';
    tagsToShow = managers;
  }

  filterForStores() {
    this.setState({tagSource: ds.cloneWithRows(stores)});
    currentCategory = 'stores';
    tagsToShow = stores;
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

  _renderSelectedTagElement(data) {
    if (data.category != 'managers') {
      return <Text style={{color: Colors.white, marginRight: 13, marginTop: 10}}>{data.title}</Text>;
    } else {
      return <Image source={data.img} style={styles.selectedDisplayPictureInFooter} />;
    }
  }

  _renderSelectedTags() {
    var dataSource = ds.cloneWithRows(this.state.selectedTags);
    var result = <ListView
        dataSource={dataSource}
        horizontal={true}
        renderRow={(data) => this._renderSelectedTagElement(data)}
      />;

    return result;
  }

  render() {
    return (
      <View style={{height: this.state.visibleHeight, flex: 1, justifyContent: 'column'}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        <DefaultRow renderChildren={() => this.renderFilters()} />
        <ListView
          style={styles.listView}
          onScroll={this._onScroll}
          dataSource={this.state.tagSource}
          renderRow={(data) => this._renderRow(data)}
        />
        <View style={[styles.selectedTags, this.state.selectedTags.length > 0 ? {height: 60, padding: 10} : {}]}>
          {this._renderSelectedTags()}
        </View>
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
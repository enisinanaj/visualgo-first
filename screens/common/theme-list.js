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

const {width, height} = Dimensions.get('window');

const themes = [
  {title: '#SanValentino', img: require('../img/elmo.jpg'), id: 1},
  {title: '#SaldiFebbraio', img: require('../img/bob.png'), id: 2},
  {title: '#Sale', img: require('../img/cookiemonster.jpeg'), id: 3},
  {title: '#NewCollection', img: require('../img/elmo.jpg'), id: 4},
  {title: '#FlowersTheme', img: require('../img/elmo.jpg'), id: 5},
  {title: '#SanValentino', img: require('../img/elmo.jpg'), id: 6},
  {title: '#SaldiFebbraio', img: require('../img/bob.png'), id: 7},
  {title: '#Sale', img: require('../img/elmo.jpg'), id: 8},
  {title: '#NewCollection', img: require('../img/elmo.jpg'), id: 9}];

var themesToShow = themes;
var currentCategory = "themes";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ThemeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      themeSource: ds.cloneWithRows(themesToShow),
      selectedThemes: []
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
    this.setState({themeSource: ds.cloneWithRows(themesToShow)});
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
    filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Manager', fixedOpen: true, autoFocus: false}, 
      {title: 'Themes', selected: true, active: true, onPress: () => this.filterForThemes(), headTitle: 'Themes'}];
    return <View style={styles.filterBarContainer}><FilterBar data={filters} customStyle={{height: 100}} headTitle={"or Pick One"}/></View>
  }

  filterForThemes() {
    this.setState({themeSource: ds.cloneWithRows(themes)});
    currentCategory = 'themes';
    themesToShow = themes;
  }

  renderCreateTheme() {
    return (
        <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row', height: 56,
                justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
            <TextInput autoFocus={false} style={{height: 30, fontSize: 18, textAlignVertical: 'center', 
                fontWeight: '300', width: width}}
                underlineColorAndroid={'rgba(0,0,0,0)'} 
                placeholderTextColor={Colors.grayText} 
                placeholder={"Create new Theme"}/>
        </View>
    )
  }

  toggleRow(rowData) {
    rowData.selected = !rowData.selected;

    if(rowData.selected) {
      rowData.category = currentCategory;
      this.state.selectedThemes.push(rowData);
    } else {
      this.setState({selectedThemes: this.state.selectedThemes.filter(value => value != rowData)});
    }

    this.setState({themeSource: ds.cloneWithRows(themesToShow)});
    this.props.closeModal(this.state.selectedThemes);
  }

  renderSelectableComponent(data) {
    if (data.img == undefined) {
      return (
        <Ionicons name='ios-checkmark-circle-outline' 
              size={30} color={Colors.gray} />
      );
    }
    
    return (
      <Image source={data.img} style={styles.selectableDisplayPicture} />
    );
  }

  renderThemeRow(data) {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => this.toggleRow(data)} style={styles.rowContainer}>
          {this.renderSelectableComponent(data)}
          <View style={styles.textInRow}>
            <Text style={[styles.rowTitle, data.selected ? styles.rowSelected : {}]}>{data.title}</Text>
          </View>
        </TouchableOpacity>
      </View>);
  }

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderThemeRow(data)} />
  }

  _renderSelectedThemeElement(data) {
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

  _renderSelectedThemes() {
    var dataSource = ds.cloneWithRows(this.state.selectedThemes);
    var result = <ListView
        dataSource={dataSource}
        horizontal={true}
        renderRow={(data) => this._renderSelectedThemeElement(data)}
        
      />;

    return result;
  }

  render() {
    return (
      <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        {this.renderCreateTheme()}
        <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />
        <ListView
          style={styles.listView}
          onScroll={this._onScroll}
          dataSource={this.state.themeSource}
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
    marginLeft: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  rowTitle: {
    fontWeight: '400',
    fontSize: 18
  },
  rowSelected: {
    color: Colors.main
  },
  selectedThemes: {
    backgroundColor: Colors.main,
    padding: 0,
    margin: 0,
  },
  selectableDisplayPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10
  },
  selectedDisplayPictureInFooter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 13
  },
  selectedDisplayPicture: {
    borderWidth: 3,
    borderColor: Colors.main,
    marginLeft: 10
  },
  filterBarContainer: {
      backgroundColor: Colors.white
  }
});
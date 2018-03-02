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
  Dimensions,
  ScrollView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';
import ImageBrowser from '../ImageBrowser';
import SingleImage from './single-image';
import {EvilIcons, Ionicons} from '@expo/vector-icons';
import {Font, AppLoading} from 'expo';

import _ from 'lodash';
import Shadow from '../../constants/Shadow';
import ExtendedStatus from './ExtendedStatus';

const {width, height} = Dimensions.get('window');

const themes = [
  {title: '# SanValentino', img: require('../img/elmo.jpg'), id: 1},
  {title: '# SaldiFebbraio', img: require('../img/bob.png'), id: 2},
  {title: '# Sale', img: require('../img/cookiemonster.jpeg'), id: 3},
  {title: '# NewCollection', img: require('../img/elmo.jpg'), id: 4},
  {title: '# FlowersTheme', img: require('../img/elmo.jpg'), id: 5},
  {title: '# SanValentino', img: require('../img/elmo.jpg'), id: 6},
  {title: '# SaldiFebbraio', img: require('../img/bob.png'), id: 7},
  {title: '# Sale', img: require('../img/elmo.jpg'), id: 8},
  {title: '# NewCollection', img: require('../img/elmo.jpg'), id: 9}];

var themesToShow = themes;
var currentCategory = "themes";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ThemeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      themeSource: ds.cloneWithRows(themesToShow),
      selectedThemes: [],
      isReady: false,
      creatingNew: false,
      imageBrowserOpen: false,
      photos: [],
      themeDescription: ''
    };

    this._onScroll = this._onScroll.bind(this);
    this.loadMore = _.debounce(this.loadMore, 300);
  }

  componentDidMount() {
    this.loadFonts();
  }

  async loadFonts() {
    await Font.loadAsync({
      'roboto-light': '../../assets/fonts/Roboto-Light.ttf',
      'roboto-regular': '../../assets/fonts/Roboto-Regular.ttf',
      'roboto-bold': '../../assets/fonts/Roboto-Bold.ttf'
    });

    this.setState({isReady: true});
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
      <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: Colors.borderGray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
            <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    );
  }

  renderFilters() {
    var filters = [{type: 'search', searchPlaceHolder: 'Search Themes', fixedOpen: true, autoFocus: false}];
    return (<View style={styles.filterBarContainer}>
        <FilterBar data={filters} customStyle={{height: 100}} headTitle={"or Pick One"} />
      </View>);
  }

  filterForThemes() {
    this.setState({themeSource: ds.cloneWithRows(themes)});
    currentCategory = 'themes';
    themesToShow = themes;
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
    this.props.closeModal({themeName: rowData.title, photo: undefined});
  }

  renderSelectableComponent(data) {
    data.selected = false;

    if (data.img == undefined) {
      return (
        <Ionicons name='ios-checkmark-circle-outline' 
              size={24} color={Colors.gray} />
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
            <Text style={styles.rowTitle}>{data.title}</Text>
          </View>
        </TouchableOpacity>
      </View>);
  }

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderThemeRow(data)} noborder={true} />
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

  renderSaveBar() {
    if (this.state.photos.length == 0 || this.state.themeDescription == '' 
      || this.state.themeDescription == '#' || this.state.themeDescription == '# ') {
        return null;
    }

    return (
      <View style={[styles.bottomBar]}>
          <TouchableOpacity onPress={() => {this.props.closeModal({themeName: this.state.themeDescription, photo: this.state.photos[0]})}}>
              <Text style={styles.saveButton}>Save and Select</Text>
          </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />
    }

    return (
      <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column'}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        <ExtendedStatus onStateChange={(v) => this.setState({creatingNew: v})}
          onDone={(value, photos) => this.setState({photos: photos, themeDescription: value})} />
        <ScrollView>
          {!this.state.creatingNew ?  
            this.renderFilters() : null}
          {!this.state.creatingNew ? <ListView
            style={styles.listView}
            onScroll={this._onScroll}
            dataSource={this.state.themeSource}
            renderRow={(data) => this._renderRow(data)}
          /> : null}
        </ScrollView>
        {this.renderSaveBar()}
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
    fontFamily: 'roboto-bold',
    fontSize: 20,
    color: 'black'
  },
  selectedThemes: {
    padding: 0,
    margin: 0,
  },
  selectableDisplayPicture: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginLeft: 10
  },
  filterBarContainer: {
      backgroundColor: Colors.white
  },
  bottomBar: {
    backgroundColor: Colors.main,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    height: "auto"
  },
  saveButton: {
    fontFamily: 'roboto-bold',
    color: Colors.white,
    fontSize: 16,
    marginRight: 10,
    width: 180,
    textAlign: 'right'
  },
});
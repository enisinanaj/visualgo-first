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
    filters = [{type: 'search', searchPlaceHolder: 'Search Themes', fixedOpen: true, autoFocus: false}];
    return <View style={styles.filterBarContainer}>
        <FilterBar data={filters} customStyle={{height: 100}} headTitle={"or Pick One"}/>
      </View>
  }

  filterForThemes() {
    this.setState({themeSource: ds.cloneWithRows(themes)});
    currentCategory = 'themes';
    themesToShow = themes;
  }

  imageBrowserCallback = (callback) => {
    callback.then((photos) => {

      let newPhotos = [];
      photos.forEach(element => {
          newPhotos.push({url: element.uri != null ? element.uri : element.file});
      });

      this.setState({
        imageBrowserOpen: false,
        photos: newPhotos
      })
    }).catch((e) => console.log(e))
}

  _renderImagePickerModal() {
    return (
      <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.imageBrowserOpen}
          onRequestClose={() => this.setState({imageBrowserOpen: false})}>
          
          <ImageBrowser max={1} callback={this.imageBrowserCallback}/>
      </Modal>
    );
  }

  editThemeName(v) {
    if (v == undefined || v == '' ||  v == ' ' || v == '#') {
      v = '# ';
    }

    if (v.indexOf('#') < 0) {
      v = '# ' + v;
    }

    this.setState({themeDescription: v});
  }

  renderCreateTheme() {
    if (!this.state.creatingNew) {
      return (
        <TouchableOpacity onPress={() => this.setState({creatingNew: true})}>
          <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                  borderBottomColor: Colors.borderGray, flexDirection: 'row', height: 50,
                  justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
              <Text style={{height: 30, fontSize: 16, marginTop: 10, textAlignVertical: 'center', fontFamily: 'roboto-light'}}>
                  Create New #Theme
              </Text>
              <EvilIcons name={"chevron-right"} size={24} color={Colors.main} />
          </View>
        </TouchableOpacity>
      )
    } else {
      /**/
      return <View>
        <View style={{backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: Colors.borderGray, flexDirection: 'column', height: 'auto',
                  justifyContent: 'flex-start', padding: 0}}>
          {this.state.photos.length == 1 ? 
              <View style={{height: 250, width: width, position: 'relative', left: 0, zIndex: 10}}>
                <SingleImage image={{uri: this.state.photos[0].url}} removeSingleVisibile={false}/>
                <TextInput autoFocus={false} style={{height: 30, fontSize: 20, marginTop: 10, marginBottom: 10,
                    marginLeft: 20, 
                    position: 'absolute',
                    top: 100,
                    textAlign: 'center',
                    textShadowOffset: {width: 7, height: 7},
                    textShadowColor: '#000',
                    textShadowRadius: 10,
                    fontFamily: 'roboto-bold',
                    color: 'white', width: width - 70, zIndex: 15}}
                  placeholder={"New theme"} placeholderTextColor={Colors.gray}
                  underlineColorAndroid={'rgba(0,0,0,0)'}
                  value={this.state.themeDescription} onChangeText={(v) => this.editThemeName(v)} />
                <TouchableOpacity onPress={() => this.setState({themeDescription: '', photos: []})}
                  style={[{backgroundColor: Colors.white, height: 36, width: 36, borderRadius: 18, position: 'absolute',
                           top: 105, right: 20},
                  Shadow.filterShadow]}>
                  <EvilIcons name={"close"} size={22} color={Colors.main} style={{marginTop: 10, marginLeft: 7, zIndex: 17, backgroundColor: 'transparent'}}/>
                </TouchableOpacity>
              </View>
            :
            <View style={{flexDirection: 'row', height: 50, width: width, zIndex: 20, backgroundColor: 'transparent'}}>
              <TextInput autoFocus={false} style={{height: 30, fontSize: 16, marginTop: 10, marginBottom: 10,
                                  marginLeft: 20, 
                                  fontFamily: 'roboto-light',
                                  color: Colors.main, width: width - 60, zIndex: 15}}
                placeholder={"New theme"} placeholderTextColor={Colors.gray}
                underlineColorAndroid={'rgba(0,0,0,0)'}
                value={this.state.themeDescription} onChangeText={(v) => this.editThemeName(v)} />
                <TouchableOpacity onPress={() => this.setState({themeDescription: ''})}>
                  <EvilIcons name={"close"} size={22} color={Colors.main} style={{marginRight: 16, marginTop: 16, marginBottom: 10, zIndex: 17}}/>
                </TouchableOpacity>
            </View>}
        </View>
        <View style={{backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: Colors.borderGray, height: 50, padding: 16}}>
              <TouchableOpacity onPress={() => this.setState({imageBrowserOpen: true})} 
                style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Text style={{height: 30, fontSize: 16, marginTop: 10, textAlignVertical: 'center', fontFamily: 'roboto-light'}}>
                      {this.state.photos.length > 0 ? 'Choose #Theme Image' : 'Change #Theme Image'}
                  </Text>
                  <Text style={{color:'red', marginLeft: 3, marginTop: 7}}>*</Text>
                </View>
                <EvilIcons name={"chevron-right"} size={24} color={Colors.main} />
              </TouchableOpacity>
            </View>
      </View>
    }
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
        {this.renderCreateTheme()}
        <ScrollView>
          {!this.state.creatingNew ?  <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} noborder={true}/> : null}
          {!this.state.creatingNew ? <ListView
            style={styles.listView}
            onScroll={this._onScroll}
            dataSource={this.state.themeSource}
            renderRow={(data) => this._renderRow(data)}
          /> : null}
        </ScrollView>
        {this.renderSaveBar()}
        {this._renderImagePickerModal()}
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
    justifyContent: 'space-between',
    padding: 10,
    height: 40
  },
  saveButton: {
    fontFamily: 'roboto-bold',
    color: Colors.white,
    fontSize: 16,
    width: width,
    paddingRight: 20,
    textAlign: 'right'
  },
});
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
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  ListView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import NoOpModal from '../common/NoOpModal';
import Colors from '../../constants/Colors';
import {EvilIcons, Ionicons} from '@expo/vector-icons';

import {Font, AppLoading} from 'expo';

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
  {title: 'Roseanne Font', subtitle: 'Milan Store', img: require('../img/dp1.jpg'), selected: false }, 
  {title: 'Denis Mcgraw', subtitle: 'Rome Store', img: require('../img/dp2.jpg'), selected: false },
  {title: 'Love Guerette', subtitle: 'Paris Store', img: require('../img/dp1.jpg'), selected: false },
  {title: 'Marget Divers', subtitle: 'London Store', img: require('../img/dp3.jpg'), selected: false },
  {title: 'Moriah Fewell', subtitle: 'Shanghai Store', img: require('../img/dp2.jpg'), selected: false }];

var tagsToShow = managers;
var currentCategory = "managers";
  
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {width, height} = Dimensions.get('window');

export default class TagListTask extends Component {
  constructor(props) {
    super(props);

    const {clustersVisible, storeVisible, managerVisible} = this.props;

    if ((!clustersVisible) && (!storeVisible) && (managerVisible)) {
      tagsToShow = managers;
      currentCategory = "managers";
    }

    this.state = {
      tagSource: ds.cloneWithRows(tagsToShow),
      selectedTags: [],
      visibleHeight: height,
      isReady: false
    };

    this._onScroll = this._onScroll.bind(this);
    this.loadMore = _.debounce(this.loadMore, 300);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

    this.loadFonts();
  }

  async loadFonts() {
    await Font.loadAsync({
      'roboto-light': '../../assets/fonts/Roboto-Light.ttf',
      'roboto-bold': '../../assets/fonts/Roboto-Bold.ttf',
      'roboto-regular': '../../assets/fonts/Roboto-Regular.ttf'
    });

    this.setState({isReady: true});
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardWillShow');
    Keyboard.removeListener('keyboardWillHide');
  }

  keyboardWillShow (e) {
    this.setState({keyboardIsOpen: true});
    let newSize = height - e.endCoordinates.height;
    this.setState({visibleHeight: newSize, k_visible: true})
  }

  keyboardWillHide (e) {
    this.setState({keyboardIsOpen: false});
    if(this.componentDidMount) {
        this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
    }
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
      <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 30}}>
          <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
            <Text style={{fontSize: 16, color: 'black', fontFamily: 'roboto-light', color: Colors.main}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    );
  }

  renderFilters() {
    const {clustersVisible, storeVisible, managerVisible} = this.props;

    filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Manager'}, 
      {title: 'Clusters', selected: false, active: true, visible: clustersVisible, onPress: () => this._noOpClusters.toggleState(), headTitle: 'Clusters', disabled: true},
      {title: 'Store', selected: false, active: true, visible: storeVisible, onPress: () => this._noOpStores.toggleState(), headTitle: 'Stores', disabled: true},
      {title: 'Manager', selected: true, active: true, visible: managerVisible, onSelected: () => this.filterForManagers(), headTitle: 'Managers'}];
    return <View style={styles.filterBarContainer}>
      <FilterBar data={filters} customStyle={{height: 100}} headTitle={this.props.headTitle}/>
      <NoOpModal featureName={"Cluster Tagging"} ref={(noOpModal) => this._noOpClusters = noOpModal} />
      <NoOpModal featureName={"Stores Tagging"} ref={(noOpModal) => this._noOpStores = noOpModal} />
    </View>
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
              size={30} color={data.selected ? Colors.main : Colors.gray} style={{marginLeft: 10}} />
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
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    var {visibleHeight} = this.state;

    return (
      <KeyboardAvoidingView style={{height: visibleHeight, flex: 1, flexDirection: 'column'}} behavior={"padding"}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} />
        <ListView
          style={styles.listView}
          onScroll={this._onScroll}
          dataSource={this.state.tagSource}
          renderRow={(data) => this._renderRow(data)}
         
        />
        <View style={[styles.selectedTags, this.state.selectedTags.length > 0 ? {height: 60, padding: 10} : {}]}>
          {this._renderSelectedTags()}
          <TouchableOpacity  onPress={() => this.props.closeModal(this.state.selectedTags)}>
            {this.state.selectedTags.length > 0 ? 
              <Text style={{color: Colors.white, fontFamily: 'roboto-bold', fontSize: 18, paddingRight: 10, marginTop: 8}}>Done</Text> 
            : null }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    backgroundColor: Colors.main,
    padding: 0,
    margin: 0,
  },
  selectableDisplayPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    borderColor: Colors.main
  },
  filterBarContainer: {
      backgroundColor: Colors.white,
      height: 100
  }
});
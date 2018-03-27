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
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Dimensions,
  ScrollView } from 'react-native';

import {Font, AppLoading} from 'expo';

import DefaultRow from './default-row';
import FilterBar from './filter-bar';
import ExtendedStatusWithBackgroundColor from './ExtendedStatusWithBackgroundColor';
import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';
import {EvilIcons, Ionicons, FontAwesome} from '@expo/vector-icons';
import { isIphoneX } from '../helpers';

import _ from 'lodash';

const {width, height} = Dimensions.get('window');

const environment = [
  {title: '@Front Door', color: Colors.borderGray, id: 1},
  {title: '@Main window', color: Colors.chat_bg, id: 2},
  {title: '@Cash Desk', color: Colors.chat_line, id: 3},
  {title: '@Main window 2 Floor', color: Colors.gray, id: 4},
  {title: '@Entrance', color: Colors.liked, id: 5},
  {title: '@Entrance 2 Floor', color: Colors.main, id: 6},
  {title: '@Cash Desk 2 Floor', color: Colors.black, id: 7},
  {title: '@Windows', color: Colors.oldMain, id: 8},
  {title: '@2 Floor', color: Colors.main, id: 9}];

var environmentsToShow = environment;
var currentCategory = "environment";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class EnvironmentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      environmentSource: ds.cloneWithRows(environmentsToShow),
      background: '',
      environment: '',
      isReady: false,
      insertion: false,
      visibleHeight: height
    };

    this._onScroll = this._onScroll.bind(this);
    this.loadMore = _.debounce(this.loadMore, 300);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

    this.loadFonts();
  }

  async loadFonts() {
    await Font.loadAsync({
      "roboto-light": "../../assets/fonts/Roboto-Light.ttf",
      "roboto-bold": "../../assets/fonts/Roboto-Bold.ttf"
    });

    this.setState({isReady: true});
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardWillShow');
    Keyboard.removeListener('keyboardWillHide');
  }

  keyboardWillShow (e) {
    console.log("keyboard will showm");
    this.setState({keyboardIsOpen: true});
    let newSize = height - e.endCoordinates.height;
    this.setState({visibleHeight: newSize, k_visible: true})
  }

  keyboardWillHide (e) {
    console.log("keyboard will hide");
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

    //call service here
    this.setState({environmentSource: ds.cloneWithRows(environmentsToShow)});
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.borderGray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={() => {this.props.closeModal({})}}>
            <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    );
  }

  renderFilters() {
    var filters = [{type: 'search', searchPlaceHolder: 'Search Environments', fixedOpen: true, autoFocus: false}];
    return <View style={styles.filterBarContainer}>
      <FilterBar data={filters} customStyle={{height: 100}} headTitle={"or Pick One"}/>
    </View>
  }

  filterForEnvironments() {
    this.setState({environmentSource: ds.cloneWithRows(environments)});
    currentCategory = 'environments';
    environmentsToShow = environments;
  }

  renderSelectableComponent(data) {
      return (
        <View style={[{marginLeft: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: 'transparent', marginRight: 0, marginTop: 5}, 
                      Shadow.filterShadow]}>
          <FontAwesome name={"circle"} 
              size={30} color={data.color} />
        </View>
      );
  }

  renderEnvironmentRow(data) {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => this.props.closeModal({environmentName: data.title, background: data.color})} 
            style={styles.rowContainer}>
          {this.renderSelectableComponent(data)}
          <View style={styles.textInRow}>
            <Text style={[styles.rowTitle, data.selected ? styles.rowSelected : {}, {color: data.color}]}>{data.title}</Text>
          </View>
        </TouchableOpacity>
      </View>);
  }

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderEnvironmentRow(data)} noborder={true}/>
  }

  async pushEnvironment() {
    await fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/environments/createenvironment', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            environment: {
              environment: this.state.environment,
              description: "",
              mediaurl: this.state.background
            }
          })
      })
      .then((response) => {this.props.closeModal({environmentName: this.state.environment, background: this.state.background, id: response})})
      .catch(e => {
          console.error("error: " + e);
      })
  }

  renderSaveBar() {
    if (this.state.background == undefined || this.state.environment == '' 
      || this.state.environment == '@' || this.state.environment == '@ ') {
        return null;
    }

    return (
      <View style={[styles.bottomBar]}>
        <TouchableOpacity onPress={() => {this.pushEnvironment()}}>
            <Text style={styles.saveButton}>Save and Select</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onNewDone(text, backgroundColor) {
    this.setState({background: backgroundColor, environment: text});
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    var {visibleHeight} = this.state;

    return (
      <KeyboardAvoidingView style={{height: visibleHeight, flex: 1, flexDirection: 'column'}} behavior={"padding"}>
        <StatusBar barStyle={'light-content'} animated={true}/>
        { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 44, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, height: 20, top: 0, left: 0}}></View>}
        {this.renderHeader()}
        <ExtendedStatusWithBackgroundColor onDone={(text, color) => {this.onNewDone(text, color)}} 
            onStateChange={(state) => {this.setState({insertion: state})}} />
        <ScrollView>
          {!this.state.insertion ?
            <View>
              <DefaultRow renderChildren={() => this.renderFilters()} usePadding={false} noborder={true} />
              <ListView
                style={styles.listView}
                onScroll={this._onScroll}
                dataSource={this.state.environmentSource}
                renderRow={(data) => this._renderRow(data)}
              />
            </View>
          : null}
        </ScrollView>
        {this.renderSaveBar()}
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
    marginLeft: 5,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  rowTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 24,
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
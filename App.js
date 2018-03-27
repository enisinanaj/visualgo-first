
import React from 'react';
import {
  AppRegistry,
  Platform,
  Animated,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  NavigationProvider,
  StackNavigation,
} from '@expo/ex-navigation';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import {StackNavigator} from 'react-navigation';

import { AppLoading, Asset, Font } from 'expo';

import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import Drawer from 'react-native-drawer'

import BlueMenu from './screens/common/blue-menu';
import Colors from './constants/Colors';
import SearchBar from './screens/common/search-bar';
import Login from './screens/Login';
import StartScreen from './screens/StartScreen';

import AppSettings, {isIphoneX} from './screens/helpers';
import ApplicationConfig from './screens/helpers/appconfig';
import TaskDetail from './screens/common/task-detail';
import AlbumDetail from './screens/AlbumDetail';
import CollabView from './screens/CollabView';
import CreateAlbum from './screens/common/create-visual-guideline';
import CustomTabs from './CustomTabs';

const {width, height} = Dimensions.get('window');
const DRAWER_ANIMATION_DURATION = 750;

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    menuIsOpen: false,
    mainViewHeight: new Animated.Value(height),
    innerViewHeight: new Animated.Value(height - 69),
    marginTop: new Animated.Value(0),
    searchBarVisible: true,
    searchBarHeight: new Animated.Value(69)
  }

  componentWillMount() {
    this._loadAssetsAsync();
  }

  componentDidMount() {
    this.loadFontsAsync();
    ApplicationConfig.getInstance().index = this;
    AppSettings.appIndex = this;
  }

  async loadFontsAsync() {
    Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf'),
      'roboto-black': require('./assets/fonts/Roboto-Black.ttf'),
      'roboto-black-italic': require('./assets/fonts/Roboto-BlackItalic.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'roboto-bold-condensed': require('./assets/fonts/Roboto-BoldCondensed.ttf'),
      'roboto-bold-italic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
      'roboto-bold-italic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
    });
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [
          require('./screens/img/dp2.jpg'),
          require('./screens/img/elmo.jpg'),
          require('./screens/img/dp3.jpg'),
          require('./screens/img/shopping1.jpg'),
          require('./screens/img/shopping2.jpg'),
          require('./screens/img/shopping3.jpg'),
          require('./screens/img/shopping4.jpg'),
        ],
        fonts: [
            Ionicons.font,
        ]
      });
    } catch(e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({appIsReady: true});
    }
  }

  toggleMenu = () => {
    if(this._drawer.props.open){
      this._drawer.close()
      this.setState({menuIsOpen: false});
    }else{
      this._drawer.open()
      this.setState({menuIsOpen: true});

      Animated.parallel([
        Animated.timing(
          this.state.mainViewHeight,
          {
            toValue: height - 100,
            duration: DRAWER_ANIMATION_DURATION,
          }
        ),
        Animated.timing(
          this.state.marginTop,
          {
            toValue: 50,
            duration: DRAWER_ANIMATION_DURATION,
          }
        ),
        Animated.timing(
          this.state.innerViewHeight,
          {
            toValue: height - 160,
            duration: DRAWER_ANIMATION_DURATION,
          }
        )
      ]).start();
    }
  };

  closeMenu(c) {
    this.setState({menuIsOpen: false});
    Animated.parallel([
      Animated.timing(
        this.state.mainViewHeight,
        {
          toValue: height,
          duration: DRAWER_ANIMATION_DURATION,
        }
      ),
      Animated.timing(
        this.state.marginTop,
        {
          toValue: 0,
          duration: DRAWER_ANIMATION_DURATION,
        }
      ),
      Animated.timing(
        this.state.innerViewHeight,
        {
          toValue: height - 69,
          duration: DRAWER_ANIMATION_DURATION,
        }
      )
    ]).start();

    if (c != undefined) {
      c();
    }
  }

  hideSearchBar(direction) {
    Animated.parallel([
      Animated.timing(
        this.state.searchBarHeight, {
          toValue: 20,
          duration: 200,
        }
      ),
      Animated.timing(
        this.state.innerViewHeight,
        {
          toValue: height - 20,
          duration: 200,
        }
      )
    ]).start();

    this.removeSearchBar();
  }

  removeSearchBar() {
    this.setState({searchBarVisible: false});
  }

  showSearchBar() {
      Animated.parallel([
        Animated.timing(
          this.state.searchBarHeight, {
            toValue: 69,
            duration: 200,
          }
        ),
        Animated.timing(
          this.state.innerViewHeight, {
            toValue: height - 69,
            duration: 200,
          }
        )
      ]).start();

      this.setState({searchBarVisible: true});
  }

  render() {
    if (this.state.appIsReady) {
        return (
          <Drawer
            type="static"
            ref={(ref) => this._drawer = ref}
            content={<BlueMenu navigation={this.props.navigation}/>}
            openDrawerOffset={50} 
            styles={isIphoneX() ? drawerStylesX : Platform.OS === "ios" ? drawerStyles : drawerStyles}
            tweenEasing={"easeInOutBack"}
            tweenDuration={DRAWER_ANIMATION_DURATION}
            acceptTap={true}
            onCloseStart={() => this.closeMenu()}
            captureGestures={false}
            side="right">
            <View style={styles.container}>
              <Animated.View style={[{height: this.state.mainViewHeight, marginTop: this.state.marginTop}, {backgroundColor: Colors.white}]}>
                <Animated.View style={{height: this.state.searchBarHeight, zIndex: 999, backgroundColor: Colors.main, overflow: 'hidden'}}
                    removeClippedSubviews={true}>
                  <SearchBar ref='searchBar' openMenu={() => this.toggleMenu()}/>
                </Animated.View>
                <Animated.View style={{marginTop: 0,
                    bottom: 0,
                    height: this.state.innerViewHeight,
                    shadowColor: 'transparent',
                    shadowOffset: {height: 0}}}>
                  <NavigationProvider router={Router} >
                    <StackNavigation id="root" initialRoute={Router.getRoute('rootNavigation')} />
                  </NavigationProvider>
                </Animated.View>
                {Platform.OS === 'ios' && <StatusBar barStyle="light-content" backgroundColor={Colors.main}/>}
                {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
              </Animated.View>
              {this.state.menuIsOpen ? 
                <View style={{position: 'absolute', right: 0, left: 0, bottom: 0, top: 0, backgroundColor: 'transparent'}} /> 
              : null}
            </View>
          </Drawer>
        );
    } else {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ appIsReady: true })}
          onError={console.warn}
        />
      );
    }
  }
}

const MainAppNavigation = StackNavigator({
  StartScreen: {screen: StartScreen},
  Login: {screen: Login },
  Index: {screen: AppContainer},
  TaskSummary: {screen: TaskDetail},
  AlbumSummary: {screen: AlbumDetail},
  CollabView: {screen: CollabView},
  CreateVisualGuideline: {screen: CreateAlbum}
},
{
  initialRouteName: 'StartScreen',
  headerMode: 'none',
  navigationOptions: {
    header: {
      style: {
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
      },
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      }
    }
  }
});

//export default () => <MainAppNavigation ref={r => ApplicationConfig.getInstance().mainAppNavigation = r}/>;
export default CustomTabs;

const drawerStyles = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
}

const drawerStylesX = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0, paddingTop: 22},
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  drawer: {
    height,
    padding: 8,
    paddingTop: 20,
    width: width,
    position: 'absolute',
    backgroundColor: Colors.chat_bg,
    right: 0
}
});
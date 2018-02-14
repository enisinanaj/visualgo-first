
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

const {width, height} = Dimensions.get('window');
const DRAWER_ANIMATION_DURATION = 750;

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    menuIsOpen: false,
    mainViewHeight: new Animated.Value(height),
    innerViewHeight: new Animated.Value(height - 65),
    marginTop: new Animated.Value(0)
  }

  componentWillMount() {
    this._loadAssetsAsync();
  }

  componentDidMount() {
    this.loadFontsAsync();
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
          require('./screens/img/bob.png'),
          require('./screens/img/cookiemonster.jpeg'),
          require('./screens/img/elmo.jpg'),
          require('./screens/img/me.png'),
          require('./screens/img/1.jpg'),
          require('./screens/img/2.jpg'),
          require('./screens/img/3.jpg'),
          require('./screens/img/4.jpg'),
          require('./screens/img/5.jpg'),
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

  closeMenu() {
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
          toValue: height - 65,
          duration: DRAWER_ANIMATION_DURATION,
        }
      )
    ]).start();
  }

  render() {
    if (this.state.appIsReady) {
        return (
          <Drawer
            type="static"
            ref={(ref) => this._drawer = ref}
            content={<BlueMenu navigation={this.props.navigation}/>}
            openDrawerOffset={50}
            styles={drawerStyles}
            tweenEasing={"easeInOutBack"}
            tweenDuration={DRAWER_ANIMATION_DURATION}
            acceptTap={true}
            onCloseStart={() => this.closeMenu()}
            captureGestures={false}
            side="right">
            <View style={styles.container}>
              <Animated.View style={[{height: this.state.mainViewHeight, marginTop: this.state.marginTop}, {backgroundColor: Colors.white}]}>
                <SearchBar ref='searchBar' openMenu={() => this.toggleMenu()} style={{zIndex: 999}}/>
                  <Animated.View style={{marginTop: 0, bottom: 0, position: 'fixed', height: this.state.innerViewHeight}}>
                    <NavigationProvider router={Router}>
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
  Login: { screen: Login },
  Index: { screen: AppContainer}
},
{
  initialRouteName: 'Index',
  headerMode: 'none'
});

export default () => <MainAppNavigation />;

const drawerStyles = {
  drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
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

// Exponent.registerRootComponent(AppContainer);

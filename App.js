
import React from 'react';
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View,
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

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  }

  componentWillMount() {
    this._loadAssetsAsync();
  }

  componentDidMount() {
    Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
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
    }else{
        this._drawer.open()
    }

    /*Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 10000,              // Make it take a while
      }
    ).start();*/
  };

  render() {
    if (this.state.appIsReady) {
        return (
          <Drawer
            type="static"
            ref={(ref) => this._drawer = ref}
            content={<BlueMenu navigation={this.props.navigation}/>}
            openDrawerOffset={50}
            styles={drawerStyles}
            //tweenHandler={Drawer.tweenPresets.parallax}
            //tweenEasing={"easeInOutBounce"}
            tweenHandler={(ratio) => {
              var r0 = -ratio/6
              var r1 = 1-ratio/6
              var t = [
                         r1,  r0,  0,  0,
                         -r0, r1,  0,  0,
                         0,   0,   1,  0,
                         0,   0,   0,  1,
                      ]
              return {
                main: {
                  style: {
                    transformMatrix: t,
                    opacity: 1 - ratio/2,
                  },
                }
              }
            }}
            side="right"
            >
            <View style={styles.container}>
              <SearchBar ref='searchBar' openMenu={() => this.toggleMenu()} style={{zIndex: 999}}/>

              <View style={{marginTop: 0, bottom: 0, position: 'fixed', height: height - 65}}>
                <NavigationProvider router={Router}>
                  <StackNavigation id="root" initialRoute={Router.getRoute('rootNavigation')} />
                </NavigationProvider>
              </View>

              {Platform.OS === 'ios' && <StatusBar barStyle="light-content" backgroundColor={Colors.main}/>}
              {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
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
    backgroundColor: '#fff',
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

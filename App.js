
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
import {
  Ionicons,
  FontAwesome
} from '@expo/vector-icons';

import { AppLoading, Asset, Font } from 'expo';

import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import Drawer from 'react-native-drawer'

import BlueMenu from './screens/common/blue-menu';
import Colors from './constants/Colors';

const {width, height} = Dimensions.get('window');

export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  }

  componentWillMount() {
    this._loadAssetsAsync();
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

  render() {
    if (this.state.appIsReady) {
        return (
            <View style={styles.container}>
              <NavigationProvider router={Router}>
                <StackNavigation id="root" initialRoute={Router.getRoute('rootNavigation')} />
              </NavigationProvider>

              {Platform.OS === 'ios' && <StatusBar barStyle="light-content" backgroundColor="blue"/>}
              {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
            </View>
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
    width: width * 4/5,
    position: 'absolute',
    backgroundColor: Colors.chat_bg,
    right: 0
}
});

// Exponent.registerRootComponent(AppContainer);

import React from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@expo/ex-navigation';
import {
  Ionicons,
} from '@expo/vector-icons';

import Colors from '../constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {MenuIcons} from '../screens/helpers/index';

export default class RootNavigation extends React.Component {

  render() {
    return (
      <TabNavigation
        style={styles.tabNvigation}
        tabBarHeight={54}
        initialTab="landing">
        <TabNavigationItem
          id="links" style={styles.tabNavigationItem}
          renderIcon={isSelected => this._renderIcon('album', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

        <TabNavigationItem
          id="landing" style={styles.tabNavigationItem}
          renderIcon={isSelected => this._renderIcon('bacheca', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

        <TabNavigationItem
          id="mainCalendar" style={styles.tabNavigationItem}
          renderIcon={isSelected => this._renderIcon('calendar', isSelected)}>
          <StackNavigation initialRoute="mainCalendar" />
        </TabNavigationItem>

        <TabNavigationItem
            id="chat" style={styles.tabNavigationItem}
            renderIcon={isSelected => this._renderIcon('chat', isSelected)}>
          <StackNavigation initialRoute="chat" />
        </TabNavigationItem>
        
        <TabNavigationItem
            id="settings" style={styles.tabNavigationItem}
            renderIcon={isSelected => this._renderIcon('notification', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

      </TabNavigation>

      
    );
  }

  _renderIcon(name, isSelected) {
    let image;
    switch(name) {
      case 'chat':
        image = MenuIcons.CHAT_IMAGE
        break;
      case 'album':
        image = MenuIcons.ALBUM_IMAGE
        break;
      case 'calendar':
        image = MenuIcons.CALENDAR_IMAGE
        break;
      case 'notification':
        image = MenuIcons.NOTIFICATION_IMAGE
        break;
      case 'bacheca':
        image = MenuIcons.BACHECA_IMAGE
        break;
    }

    if (!isSelected) {
      return <View style={styles.mainIcon}>
          <Image
            style={{flex: 1, width: undefined, height: undefined}}
            source={image}
            resizeMode="contain"/>
        </View>;
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
          <View style={{height: 26, width: 26}}>
            <Image
              style={{flex: 1, width: undefined, height: undefined}}
              source={image}
              resizeMode="contain"/>
          </View>
          <FontAwesome name={'circle'}
            style={styles.activeSignIcon}
            size={4} color={Colors.main} />
        </View>
      );
    }

    return null;
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
  },
  mainIcon: {
    height: 26,
    width: 26,
    marginTop: -10
  },
  activeSignIcon: {
    marginTop: 2,
    marginBottom: 2
  },
  tabNavigationItem: {
    
  },
  tabNvigation: {
    paddingTop: 16,
    paddingBottom: 6,
    paddingLeft: 20,
    paddingRight: 20,
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
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

export default class RootNavigation extends React.Component {

  render() {
    return (
      <TabNavigation
        tabBarHeight={40}
        initialTab="landing">
        <TabNavigationItem
          id="links"
          renderIcon={isSelected => this._renderIcon('ios-bowtie-outline', isSelected)}>
          <StackNavigation initialRoute="links" />
        </TabNavigationItem>

        <TabNavigationItem
          id="landing"
          renderIcon={isSelected => this._renderIcon('ios-card-outline', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => this._renderIcon('ios-calendar-outline', isSelected)}>
          <StackNavigation initialRoute="settings" />
        </TabNavigationItem>

        <TabNavigationItem
            id="settings"
            renderIcon={isSelected => this._renderIcon('ios-chatbubbles-outline', isSelected)}>
          <StackNavigation initialRoute="settings" />
        </TabNavigationItem>
        
        <TabNavigationItem
            id="settings"
            renderIcon={isSelected => this._renderIcon('ios-checkmark-circle-outline', isSelected)}>
          <StackNavigation initialRoute="settings" />
        </TabNavigationItem>
      </TabNavigation>
    );
  }

  _renderIcon(name, isSelected) {
    return (
      <Ionicons
        name={name}
        size={24}
        color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
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
});

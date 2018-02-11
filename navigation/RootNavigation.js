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
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default class RootNavigation extends React.Component {

  render() {
    return (
      <TabNavigation
        style={styles.tabNvigation}
        tabBarHeight={54}
        initialTab="landing">
        <TabNavigationItem
          id="links" style={styles.tabNavigationItem}
          renderIcon={isSelected => this._renderIcon('ios-bowtie-outline', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

        <TabNavigationItem
          id="landing" style={styles.tabNavigationItem}
          renderIcon={isSelected => this._renderIcon('ios-card-outline', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

        <TabNavigationItem
          id="tasks" style={styles.tabNavigationItem}
          renderIcon={isSelected => this._renderIcon('ios-calendar-outline', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

        <TabNavigationItem
            id="chat" style={styles.tabNavigationItem}
            renderIcon={isSelected => this._renderIcon('ios-chatbubbles-outline', isSelected)}>
          <StackNavigation initialRoute="chat" />
        </TabNavigationItem>
        
        <TabNavigationItem
            id="settings" style={styles.tabNavigationItem}
            renderIcon={isSelected => this._renderIcon('ios-checkmark-circle-outline', isSelected)}>
          <StackNavigation initialRoute="landing" />
        </TabNavigationItem>

      </TabNavigation>

      
    );
  }

  _renderIcon(name, isSelected) {
    if (!isSelected) {
      return (<Ionicons
        name={name}
        size={24}
        color={Colors.main}
      />);
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center'}}>
          <Ionicons
            name={name}
            size={24}
            color={Colors.main}
            style={styles.mainIcon}
          />
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
    marginTop: 16
  },
  activeSignIcon: {
    marginBottom: 6
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

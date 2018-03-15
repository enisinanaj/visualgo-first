import React, { Component } from 'react';
import {
  Text,
  View,
  ViewPager,
  StyleSheet,
  Platform
} from 'react-native';

import Colors from '../constants/Colors';

export default class TaskSummaryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: ["asd","qwe"]
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[Platform.OS === "ios" ? styles.containerIOS : styles.containerAndroid, { height: 0 }]} />
        <View style={styles.toolbar}>
          <Text style={styles.textField}>Task#Theme@Ambiente</Text>
        </View>
        <ViewPager
          style={styles.viewPager}
          dataSource={this.state.dataSource}
          renderPage={this._renderPage} />
      </View>
    );
  }
};

_renderPage() {
  return (
    <View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },

  containerIOS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.main,
    paddingTop: 20,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: 1,
  },

  containerAndroid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    backgroundColor: Colors.main,
    paddingTop: 24,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: 1,
  },

  toolbar: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.yellow
  },

  textField: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  viewPager: {
    flex: 4,
    backgroundColor: '#FFF'
  }
});
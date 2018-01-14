import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Modal,
  StyleSheet,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  ListView } from 'react-native';

import DefaultRow from '../common/default-row';
import FilterBar from '../common/filter-bar';
import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';

const tags = ['Flagship', 'Mall'];
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class TagList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagSource: ds.cloneWithRows(tags)
    };
  }

  state = {
    modalVisible: false,
  };

  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
        this.setState({refreshing: false});
    }, 1500)
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
          borderBottomColor: Colors.gray, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
          <TouchableOpacity onPress={this.props.closeModal}>
              <Text>
                  <EvilIcons name={"close"} size={22} color={Colors.main}/>
              </Text>
          </TouchableOpacity>
          <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>Tags</Text>
          <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Done</Text>
      </View>
    );
  }

  renderFilters() {
    filters = ['0', 'Clusters', 'Store', 'Manager'];
    return <FilterBar data={filters} />
  }

  renderTagRow(data) {
    return (
      <DefaultRow renderChildren={() => function() {
        return (<Text>{data}</Text>)
      }} />
    );
  }

  _renderRow(data) {
    return <DefaultRow arguments={data} renderChildren={() => this.renderTagRow(data)} />
  }

  render() {
    return (
      <View style={{height: this.state.visibleHeight}}>
        <StatusBar barStyle={'default'} animated={true}/>
        {this.renderHeader()}
        <DefaultRow renderChildren={() => this.renderFilters()} arguments={{}} />
        <ListView
          refreshControl={
              <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
              />
          }
          style={styles.listView}
          onScroll={this._onScroll}
          dataSource={this.state.tagSource}
          renderRow={(data) => this._renderRow(data)}
        />
      </View>
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
});
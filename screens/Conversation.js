import {EvilIcons} from '@expo/vector-icons';
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    ScrollView,
    ListView,
    StyleSheet,
    StatusBar,
    Image,
    TouchableOpacity,
    Button,
    TextInput
} from 'react-native';

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import DefaultRow from './common/default-row';
import FilterBar from './common/filter-bar';

import {EvilIcons, SimpleLineIcons, MaterialIcons} from '@expo/vector-icons';
import _ from 'lodash';

import moment from 'moment';
import locale from 'moment/locale/it'
import Router from '../navigation/Router';

const messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                  {from: {name: 'me', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo', read: true, date: new Date()},
                  {from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {width, height} = Dimensions.get('window');

export default class Conversation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            convoMessages: ds.cloneWithRows(messages)
        }
    }

    _goBack() {
        this.props.navigator.pop();
    }

    _renderHeader() {
        return (
            <View style={styles.headerView}>
                <EvilIcons name={"chevron-left"} size={22} onPress={() => this._goBack()} style={{width: 22}}/>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', width: width - 22}}>
                    <Text style={styles.viewTitle}>{this.props.route.params.convTitle}</Text>
                    <EvilIcons name={"chevron-right"} size={22} style={{width: 22}}/>
                </View>
            </View>);
    }

    _renderRow(data) {
        if (data.from.name != 'me') {
            return (
                <View style={styles.fromBubble}>
                    <Image source={data.from.image} style={styles.displayPicture} />
                    <View style={styles.messageBubble}>
                        <Text>{data.message}</Text>
                    </View>
                </View>);
        }

        return (
            <View style={styles.messageBubble}>
                <Text>{data.message}</Text>
            </View>);
    }


    render() {
        return (
            <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                <View style={styles.statusBlackBackground}/>
                <DefaultRow renderChildren={() => this._renderHeader()} />
                <ListView
                    style={styles.listView}
                    onScroll={this._onScroll}
                    dataSource={this.state.convoMessages}
                    renderRow={(data) => this._renderRow(data)}/>
                <View style={mesageBoxStyle.newMessageAreaContainer}>
                    <TouchableOpacity style={mesageBoxStyle.attachmentBackground}>
                        <EvilIcons name={"chevron-right"} size={30} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={mesageBoxStyle.textBoxContainer}>
                        <TextInput style={mesageBoxStyle.textArea}></TextInput>
                        <SimpleLineIcons name={"emotsmile"} size={22} color={Colors.yellow} />
                    </View>
                    <TouchableOpacity>
                        <MaterialIcons name={"send"} size={30} color={Colors.main} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const mesageBoxStyle = StyleSheet.create({
    newMessageAreaContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60
    },
    attachmentBackground: {
        height: 44,
        width: 44,
        borderRadius: 22,
        backgroundColor: Colors.main,
        marginLeft: 10,
        marginRight: 10
    },
    textBoxContainer: {
        width: width - 108,
        borderRadius: 22,
        backgroundColor: Colors.lightGray,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    textArea: {
        backgroundColor: 'transparent',
        color: Colors.black,
        width: width - 108 - 30
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    listView: {
        paddingTop: 10
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingTop: 5,
        paddingBottom: 5,
        height: 25,
    },
    statusBlackBackground: {
        backgroundColor: Colors.black,
        height: 20,
        width: width
    },
    viewTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    displayPicture: {
        marginLeft: 10,
        marginRight: 5,
        height: 44,
        width: 44,
        borderRadius: 22
    },
    messageBubble: {
        backgroundColor: Colors.borderGray,
        padding: 10,
        borderRadius: 25,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-end'
    },
    fromBubble: {
        borderRadius: 25,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        maxWidth: width * 0.7,
        alignSelf: 'flex-start'
    },
    attachment: {
        backgroundColor: Colors.main,
        borderRadius: 22,
        margin: 5,
        height: 44
    },
    messageBox: {
        borderRadius: 22,
        backgroundColor: Colors.lightGray,
        borderWidth: 2,
        borderColor: Colors.borderGray,
    }
});
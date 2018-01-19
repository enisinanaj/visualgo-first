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
                <EvilIcons name={"chevron-left"} size={30} onPress={() => this._goBack()} style={{width: 22}}/>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', width: width - 22}}>
                    <Text style={styles.viewTitle}>{this.props.route.params.convTitle}</Text>
                    <EvilIcons name={"chevron-right"} size={22} style={{width: 22, marginTop: 3}}/>
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
            <View style={{height: this.state.visibleHeight, flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                <View style={styles.statusBlackBackground}/>
                <DefaultRow renderChildren={() => this._renderHeader()} />
                <ScrollView>
                    <ListView
                        style={styles.listView}
                        onScroll={this._onScroll}
                        dataSource={this.state.convoMessages}
                        renderRow={(data) => this._renderRow(data)}/>
                </ScrollView>
                <View>
                    <View style={messageBoxStyle.newMessageAreaContainer}>
                        <View style={messageBoxStyle.attachmentBackground}>
                            <EvilIcons name={"chevron-right"} size={30} color={Colors.white} style={messageBoxStyle.attachmentButton}/>
                        </View>
                        <View style={messageBoxStyle.textBoxContainer}>
                            <TextInput style={messageBoxStyle.textArea}></TextInput>
                            <SimpleLineIcons name={"emotsmile"} size={22} color={Colors.yellow} style={messageBoxStyle.openEmoticons} />
                        </View>
                        <TouchableOpacity style={messageBoxStyle.sendButton}>
                            <MaterialIcons name={"send"} size={30} color={Colors.main} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}


const messageBoxStyle = StyleSheet.create({
    newMessageAreaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        heihgt: 60,
        paddingBottom: 10
    },
    attachmentBackground: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Colors.main,
        marginLeft: 10,
        marginRight: 10
    },
    attachmentButton: {
        padding: 0,
        marginTop: 8,
        marginLeft: 5,
        backgroundColor: 'transparent'
    },
    textBoxContainer: {
        width: width - 115,
        borderRadius: 22,
        backgroundColor: Colors.lightGray,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 40,
        marginRight: 10
    },
    textArea: {
        backgroundColor: 'transparent',
        color: Colors.black,
        width: width - 120 - 22,
        height: 40,
        paddingLeft: 15,
        paddingRight: 15
    },
    openEmoticons: {
        marginTop: 9,
        marginRight: 10,
        backgroundColor: 'transparent'
    },
    sendButton: {
        marginTop: 7,
        marginRight: 10
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    listView: {
        paddingTop: 10,
        flex: 1
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingTop: 5,
        paddingBottom: 5,
        height: 30,
    },
    statusBlackBackground: {
        backgroundColor: Colors.black,
        height: 20,
        width: width
    },
    viewTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2
    },
    displayPicture: {
        marginLeft: 10,
        marginRight: 5,
        height: 44,
        width: 44,
        borderRadius: 22
    },
    convoContainer: {
        flex: 1, 
        justifyContent: 'space-between', 
        height: height
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
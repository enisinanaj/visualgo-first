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
    TouchableHighlight,
    TouchableOpacity,
    Button,
    Keyboard,
    TextInput,
    Image,
    Platform,
    StatusBar,
    KeyboardAvoidingView
} from 'react-native';

import Drawer from 'react-native-drawer'
import {Font, AppLoading} from 'expo';
import {EvilIcons, Entypo} from '@expo/vector-icons';
import { withNavigation } from '@expo/ex-navigation';

import Colors from '../constants/Colors';
import CommentBar from '../constants/commentBar';
import Shadow from '../constants/Shadow';
import Router from '../navigation/Router';
import DefaultRow from './common/default-row';
import AppSettings, { getProfile } from './helpers/index';
import ApplicationConfig from './helpers/appconfig';

import _ from 'lodash';
const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const messages = [{from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                {from: {name: 'Andy', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo', read: true, date: new Date()},
                {from: {name: 'Ivan', image: require('./img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo Lorem', read: false, date: new Date()},
                {from: {name: 'John', image: require('./img/elmo.jpg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()},
                {from: {name: 'Andy', image: require('./img/bob.png')}, message: 'Lorem Ipsum Dolo Lorem Ipsum Dolo Lorem Dolo', read: true, date: new Date()},
                {from: {name: 'Ivan', image: require('./img/cookiemonster.jpeg')}, message: 'Lorem Ipsum Dolo', read: false, date: new Date()}];

@withNavigation
export default class CollabView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            showTaskComment: false,
            commentsEnabled: false,
            messages: ds.cloneWithRows(messages)
        };
    }

    componentDidMount() {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.loadFonts();
    }
    
    async loadFonts() {
        await Font.loadAsync({
            'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
            'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
            'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
            'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf')
        });

        this.setState({isReady: true});
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardWillShow');
        Keyboard.removeListener('keyboardWillHide');
    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
            this.setState({visibleHeight: newSize, k_visible: true})
    }

    keyboardWillHide (e) {
        if(this.componentDidMount) {
            this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
        }

    }

    goBack() {
        //AppSettings.appIndex.showSearchBar();
        ApplicationConfig.getInstance().index.showSearchBar();
        this.props.navigator.pop();
    }

    _renderRow(data) {
        return <DefaultRow style={{padding: 0}} arguments={data} noborder={true}>
            {this.renderMessageRow(data)}
        </DefaultRow>
    }

    renderMessageRow(data) {
        return (
            <View style={CommentBar.rowContainer}>
                <TouchableOpacity style={CommentBar.rowContainer}>
                    <Image source={data.from.image} style={CommentBar.selectableDisplayPicture} />
                    <View style={CommentBar.textInRow}>
                        <Text style={[CommentBar.rowTitle, !data.read ? CommentBar.unreadMessage : {}]}>{data.from.name}
                            <Text style={CommentBar.rowSubTitle}> {data.message}</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>);
    }

    renderCommentBar() {
        var {height, visibleHeight} = this.state;

        if (this.state.showTaskComment) {
            return (
                    <Modal
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {}}>
                        <KeyboardAvoidingView style={{flex: 1, height: visibleHeight}} behavior={"padding"}>
                            <TouchableHighlight
                            style={CommentBar.taskCommentVisibleContainer}
                            onPress={() => {
                                this.setState({showTaskComment: false});
                            }}>
                            <View style={[CommentBar.commentContainer, Shadow.cardShadow]}>
                                <View style={[CommentBar.rowCommentContainer, Shadow.filterShadow]}>
                                    <View>
                                        <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>Store ID</Text>
                                    </View>
                                    <View>
                                        <Entypo name={"chevron-thin-up"} color={"#FFFFFF"} size={16} style={{marginTop: 14, marginLeft: 25}} />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                        <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>1 Comment</Text>
                                        <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                                            <Image style={styles.taskThumbnail} source={{uri: 'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                                        </View>
                                    </View>
                                </View>
                                <ListView
                                    style={CommentBar.listView}
                                    onScroll={this._onScroll}
                                    dataSource={this.state.messages}
                                    renderRow={(data) => this._renderRow(data)}
                                    enableEmptySections={true}/>
                                <View style={[CommentBar.newMessageAreaContainer, Shadow.filterShadow]}>
                                    <View style={CommentBar.textBoxContainer}>
                                        <TextInput style={CommentBar.textArea} ref='newMessageTextInput'
                                            onChangeText={(arg) => this.setState({newMessage: arg})}
                                            placeholder={'Scrivi un commento...'}
                                            value={this.state.newMessage}
                                            underlineColorAndroid={'rgba(0,0,0,0)'} />
                                        <View style={{height: 26, width: 26, marginTop: 5, marginRight: 10}}>
                                            <Image
                                                style={{flex: 1, width: undefined, height: undefined}}
                                                source={require('../assets/images/icons/camera.png')}
                                                resizeMode="contain"/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            </TouchableHighlight>
                        </KeyboardAvoidingView>
                    </Modal>
            )    
        } else {
            return (
                <TouchableOpacity onPress={() => {this.setState({showTaskComment: true})}} >
                    <View style={[CommentBar.taskCommentContainer, Shadow.cardShadow]}>
                        <View>
                            <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>Store ID</Text>
                        </View>
                        <View>
                            <Entypo name={"chevron-thin-up"} color={"#FFFFFF"} size={16} style={{marginTop: 14, marginLeft: 25}} />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text style={[CommentBar.taskTextStyle, {backgroundColor: 'transparent'}]}>1 Comment</Text>
                            <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                                <Image style={styles.taskThumbnail} source={{uri: 'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    renderHeader() {
        return (
            <View style={{flexDirection: 'row', height: 48, alignItems: 'center', paddingLeft: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray}}>
                <View style={{flex:1}}>
                    <Image style={{flex: 1, height: 48, width: width, 
                                    position:'absolute', resizeMode: 'center', top: -12, left: 0, opacity: 0.1}} 
                                    source={{uri:'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 4, paddingTop: 5}}>
                            <TouchableOpacity onPress={() => this.goBack()}>
                                <EvilIcons name={"chevron-left"} size={22} color={Colors.main}/>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                                <Text style={styles.name}>Task #Theme</Text>
                                <Text style={[styles.environment, {color: '#3FD1EB'}]}>
                                    @Ambiente
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        }

        return (
            <View style={[{flex: 1}, styles.container]}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                {Platform.os === 'ios' ? 
                    <View style={{height: 20, top: 0, left: 0, backgroundColor: Colors.main}}></View> 
                : null}
                {this.renderHeader()}
                <View style={{flex: 1, paddingBottom: 45}}>
                    <ScrollView pagingEnabled={true} indicatorStyle={'default'} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <Image source={{uri: 'https://media.timeout.com/images/103399489/image.jpg'}} style={{height: null, width: width}} resizeMode={'cover'}/>
                        <Image source={{uri: 'https://amp.businessinsider.com/images/55a6caf42acae716008b7018-750-562.jpg'}} style={{height: null, width: width}} resizeMode={'cover'}/>
                        <Image source={{uri: 'http://retaildesignblog.net/wp-content/uploads/2012/11/VILA-Clothes-shop-by-Riis-Retail-Copenhagen.jpg'}} style={{height: null, width: width}} resizeMode={'cover'}/>
                    </ScrollView>
                </View>
                {this.renderCommentBar()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },

    name: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'roboto-bold',
        height: 16
    },
    
    environment: {
        fontSize: 14,
        height: 16,
        color: 'black',
        fontFamily: 'roboto-bold',
        marginLeft: 4
    },

    taskThumbnailContainer: {
        height: 30,
        width: 30,
        borderRadius: 4,
        borderColor: Colors.white,
        borderWidth: 2,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 5,
        marginRight: 6
    },

    taskThumbnail: {
        backgroundColor: 'transparent',
        height: 26,
        width: 26,
        borderRadius: 4,    
    },
});
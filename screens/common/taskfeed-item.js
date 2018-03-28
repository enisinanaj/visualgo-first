import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    Switch
} from 'react-native';

import {AppLoading, Font} from 'expo';
import {Ionicons, Octicons} from '@expo/vector-icons';
import moment from 'moment';
import locale from 'moment/locale/it'
import {getProfile, MenuIcons} from '../helpers';

import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';
import DisabledStyle from '../../constants/DisabledStyle';

import ImagePost from './image-post';
import TaskDetail from './task-detail';
import Button from './button';
import NoOpModal from './NoOpModal';
import ContextualActionsMenu from './ContextualActionsMenu';

const {width, height} = Dimensions.get('window');

export default class TaskFeedItem extends Component {
    constructor(props) {
        super(props);

        /*this.props.data.theme = {
            name: '#Theme'
        };

        this.props.data.environment = {
            name: '@Ambiente',
            color: '#FC9D9D'
        };*/

        console.log("data: " + JSON.stringify(this.props));

        this.state = {
            time: moment(this.props.data.timestamp).locale("it").format("D MMMM [alle ore] hh:mm"),
            buttons: [{title: 'Comment', iconImage: require("../../assets/images/icons/comment.png"), 
                        onPress: () => {}}, 
                      {title: 'Stats', id: 'statsButton', iconImage: require("../../assets/images/icons/stats-outlined.png"), 
                        onPress: () => {this['statsButton'].toggleState()}, disabled: true}],
            likes: 0,
            isReady: false,
            comments: this.props.data.comments == undefined ? 0 : this.props.data.comments.length,
            taskModal: false,
            contextualMenuActions: [{title: 'Elimina Task', image: MenuIcons.DELETE_TASK, onPress: () => {}}, 
                                    {title: 'Modifica Task', image: MenuIcons.EDIT_TASK, onPress: () => {}}, 
                                    {title: 'Archivia Task', image: MenuIcons.ARCHIVE_TASK, disabled: true, onPress: () => {}},
                                    {advanced: true, renderContent: () => this.renderAdvancedMenuContent(), onPress: () => {}}]
        };
    }

    componentWillMount() {
        this.loadEnvironment();
        this.loadTheme();
    }

    loadEnvironment() {

    }

    loadTheme() {
        
    }

    renderAdvancedMenuContent() {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'roboto-light'}}>
                        Commenti 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.commentsEnabled} onValueChange={(v) => this.setState({commentsEnabled: v})}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'roboto-light'}}>
                        Notification 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.notificationsEnabled} onValueChange={(v) => this.setState({notificationsEnabled: v})}/>
                </View>
                <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={{color: Colors.black, fontSize: 14, marginRight: 5, fontFamily: 'roboto-light', marginTop: 6}}>
                            Tutti
                        </Text>
                        <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 6}} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto': require('../../assets/fonts/Roboto-Thin.ttf'),
            'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
            'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf'),
            'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf')
        });

        this.setState({ isReady: true });
    }

    renderAvatar() {
        const {time} = this.state;
        let profile = {};
        try {
             profile = this.props.data.profile[0];
        } catch(e) {
            return null;
        }

        return (
            <View style={[styles.avatarContainer]}>
                <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                    <Image style={styles.taskThumbnail} source={{uri: this.props.data.medias[0].url}} />
                </View>
                <View style={[styles.avatarPhotoContainer, Shadow.filterShadow]}>
                    <Image style={styles.profile} source={{uri: profile.media.url}}/>
                </View>
                <TouchableOpacity onPress={() => {this.openTaksDetail()}} style={styles.nameContainer}> 
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16}}>
                        <Text style={styles.name}>Task {this.props.data.theme.name}</Text>
                        <Text style={[styles.environment, {color: this.props.data.environment.color}]}>
                            {this.props.data.environment.name}
                        </Text>
                    </View>
                    <Text style={styles.time}>50% - {time}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.contextualMenu.toggleState()} style={{position: 'absolute', right: 0, top: -10}}>
                    <Ionicons name="ios-more-outline" color={Colors.main} size={30} />
                </TouchableOpacity>
            </View>
        )
    }

    renderLikesAndComments() {
        const {likes, comments} = this.state;

        if(likes == 0 && comments == 0) {
            return
        }

        return null;
    }

    renderLikeBar() {
        const {buttons} = this.state;
        return buttons.map((button, i) => {
            return (
                <TouchableOpacity key={i} onPress={() => {button.onPress()}} style={button.disabled ? DisabledStyle.disabled : {}}>
                    <Image source={button.iconImage} style={{width: 20, height: 16}} resizeMode={"center"} />
                    {button.disabled ?
                        <NoOpModal featureName={button.title} ref={(noOpModal) => this[button.id] = noOpModal} />    
                    : null}
                </TouchableOpacity>
            )
        })
    }

    renderContent() {
        const {data} = this.props;
        if(data.media != undefined && data.media.length > 0) {
            return (
                <Image source={{ uri: data.media[0].url}} style={{height: 180, width: null, resizeMode: 'center'}} />
            )
        }
    }

    openTaksDetail() {
        var {data} = this.props;
        ApplicationConfig.getInstance().index.props.navigation.navigate("TaskSummary", {data});
    }

    renderTaskModal(data) {
        return (
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.taskModal}
            onRequestClose={() => this.setState({taskModal: false})}>
            <TaskDetail data={data} closeModal={() => this.setState({taskModal: false})}/>
          </Modal>
        );
      }

    render() {
        if (!this.state.isReady) {
          return <AppLoading />;
        }
        const {data} = this.props;
        if(data.medias != undefined && data.medias.length > 0) {
            return (
                <View style={[styles.container, Shadow.cardShadow]}>
                    <View>
                        {this.renderAvatar()}
                        <View style={{margin: 0, padding: 0, marginTop: 9}}>
                            {this.renderContent()}
                        </View>
                        {this.renderLikesAndComments()}
                        <View style={styles.buttonContainer}>
                            {this.renderLikeBar()}
                        </View>
                    </View>
                    {this.renderTaskModal(data)}
                    <ContextualActionsMenu ref={e => this.contextualMenu = e} buttons={this.state.contextualMenuActions} />
                </View>
            )
        }

        return null
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 6,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 5,
    },

    content: {
        padding: 15,
        paddingTop: 0,
        paddingBottom: 15
    },

    line: {
        margin: 16,
        marginBottom: 0,
        borderColor: '#ddd'
    },

    avatarContainer: {
        paddingBottom: 0,
        flexDirection: 'row',
        marginBottom: 10,
        marginRight: 15,
        marginLeft: 15,
        marginTop: 15
    },

    nameContainer: {
        marginLeft: 8,
        marginTop: 3.20,
        justifyContent: 'flex-start',
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

    time: {
        color: '#999999',
        fontSize: 12,
        fontFamily: 'roboto-light',
        marginTop: 3
    },

    taskThumbnailContainer: {
        height: 38,
        width: 38,
        borderRadius: 4,
        borderColor: Colors.white,
        borderWidth: 2.5,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    taskThumbnail: {
        backgroundColor: 'transparent',
        height: 33,
        width: 33,
        borderRadius: 4
    },
    profile: {
        backgroundColor: 'transparent',
        height: 24,
        width: 24,
        borderRadius: 12,
    },
    avatarPhotoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'absolute',
        top: 15,
        left: 15,
        height: 28,
        width: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.white
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.borderGray,
        height: 44,
        paddingTop: 14,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        borderTopWidth: 1,
    },

    buttonItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
        color: Colors.main
    },

    likeText: {
        fontSize: 12,
        color: Colors.grayText
    },

    likesComments: {
        padding: 16,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    imageStyle: {
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14
    },
    switchAndroid:{
        height: 24, 
        marginLeft: 5, 
        marginBottom: 5,
        
    }
})

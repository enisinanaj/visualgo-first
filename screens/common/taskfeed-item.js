/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal
} from 'react-native';

import {AppLoading, Font} from 'expo';

import Colors from '../../constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import {getProfile} from '../helpers';
import moment from 'moment';
import locale from 'moment/locale/it'
import ImagePost from './image-post';
import TaskDetail from './task-detail';

import Button from './button';
import Shadow from '../../constants/Shadow';

const {width, height} = Dimensions.get('window');

export default class TaskFeedItem extends Component {
    constructor(props) {
        super(props);


        this.state = {
            //profile: getProfile(this.props.data.creator),
            time: moment(this.props.data.timestamp).locale("it").format("D MMMM [alle ore] hh:mm"),
            buttons: ['Comment', 'Stats'],
            icons: ['comment', 'ios-podium-outline'],
            iconTypes: ["evilicon"],
            iconColors: [Colors.main, Colors.yellow],
            likes: 0,
            isReady: false,
            comments: this.props.data.comments == undefined ? 0 : this.props.data.comments.length,
            taskModal: false
        };
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

    buttonOnPress(name) {
        console.log(name);
        switch(name) {
            case 'Like':
                this.setState({likes: this.state.likes + 1});
                break;
            case 'Dislike':
                this.setState({likes: this.state.likes - 1});
                break;
            case 'Comment':
                this.setState({comments: this.state.comments + 1});
                break;
            default:
                return
        }
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
            <View style={styles.avatarContainer}>
                <Image style={styles.profile} source={{uri: profile.media.url}}/>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{profile.name} #Task @Ambiente</Text>
                    <Text style={styles.time}>50% - {time}</Text>
                </View>
                <Ionicons name="ios-more-outline" color={Colors.main} size={30} style={{position: 'absolute', right: 0, top: -10}} />
            </View>
        )
    }

    renderLikesAndComments() {
        const {likes, comments} = this.state;

        if(likes == 0 && comments == 0) {
            return
        }

        return null 
    }

    renderLikeBar() {
        const {buttons, icons, iconTypes, iconColors} = this.state;
        return buttons.map((button, i) => {
            return (
                <Button key={i} name={button} onPress={this.buttonOnPress.bind(this)} icon={icons[i]} 
                    iconType={iconTypes[i]} iconColor={iconColors[i]} />
            )
        })
    }

    renderContent() {
        const {data} = this.props;
        if(data.media != undefined && data.media.length > 0) {
            return (
                <TouchableOpacity onPress={() => {this.openTaksDetail()}}>
                    <ImagePost imageCount={1} images={data.media} style={styles.imageStyle}
                        onPress={() => {}}/>
                </TouchableOpacity>
            )
        }
    }

    openTaksDetail() {
        this.setState({taskModal: true});
    }

    renderTaskModal() {
        return (
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.taskModal}
            onRequestClose={() => this.setState({taskModal: false})}>
            <TaskDetail closeModal={() => this.setState({taskModal: false})}/>
          </Modal>
        );
      }

    render() {
        if (!this.state.isReady) {
          return <AppLoading />;
        }
        const {data} = this.props;
        if(data.media != undefined && data.media.length > 0) {
            return (
                <View style={[styles.container, Shadow.cardShadow]}>
                    <View>
                        {this.renderAvatar()}
                        {this.renderContent()}
                        {this.renderLikesAndComments()}
                        <View style={styles.buttonContainer}>
                            {this.renderLikeBar()}
                        </View>
                    </View>
                    {this.renderTaskModal()}
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
        justifyContent: 'space-around'
    },

    name: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'roboto-light'
    },

    time: {
        color: '#999999',
        fontSize: 12,
        fontFamily: 'roboto-light'
    },

    profile: {
        backgroundColor: 'transparent',
        height: 40,
        width: 40,
        borderRadius: 20
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.borderGray,
        height: 44,
        paddingTop: 14,
        paddingBottom: 14,
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
    }
})

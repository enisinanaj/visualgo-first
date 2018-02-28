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
    TouchableOpacity
} from 'react-native';

import {AppLoading, Font} from 'expo';

import Colors from '../../constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import {getProfile} from '../helpers';
import moment from 'moment';
import locale from 'moment/locale/it'
import ImageVisualGuideline from './image-visual-guideline';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Button from './button';
import Shadow from '../../constants/Shadow';

const {width, height} = Dimensions.get('window');

export default class VisualGuidelineItem extends Component {
    constructor(props) {
        super(props);


        this.state = {
            time: moment(this.props.data.timestamp).locale("it").format("D MMMM [alle ore] hh:mm"),
            buttons: ['Comment'],
            icons: ['comment'],
            iconTypes: ["evilicon"],
            iconColors: [Colors.main],
            likes: 0,
            isReady: false,
            comments: this.props.data.comments == undefined ? 0 : this.props.data.comments.length
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
                    <Text style={styles.title}>{profile.name} #Theme @Ambiente</Text>
                    <Text style={styles.subtitle}>Andy - {time}</Text>
                </View>
                <Ionicons name="ios-more-outline" color={Colors.main} size={30} style={{position: 'absolute', right: 0, top: -10}} />
            </View>
        )
    }

    renderAddButton() {
        
    }

    renderLikeBar() {
            return (
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity style={[styles.filterButtons, styles.buttonNewGroupStyle]}>
                        <MaterialCommunityIcons style={[styles.plusIcon, Shadow.filterShadow]} name={"plus-circle"} size={30} color={Colors.main} />
                    </TouchableOpacity>
                </View>
            )
    }

    renderContent() {
        const {data} = this.props;
        if(data.media != undefined && data.media.length > 0) {
            return (
                <ImageVisualGuideline imageCount={data.media.length} images={data.media} style={styles.imageStyle} onPress={() => {}}/>
            )
        }

        return (
            <View style={styles.content}>
                <Text style={{fontFamily: 'roboto-light'}}>{this.props.data.content}</Text>
            </View>
        )
    }

    render() {
        if (!this.state.isReady) {
          return <AppLoading />;
        }

        return (
            <View style={[styles.container, Shadow.cardShadow]}>
                <View>
                    {this.renderAvatar()}
                    {this.renderContent()}
                    {this.renderAddButton()}
                    <View style={styles.buttonContainer}>
                        {this.renderLikeBar()}
                    </View>
                </View>
            </View>
        )
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

    title: {
        fontSize: 14,
        color: 'black',
        fontWeight: '800',
        fontFamily: 'roboto-bold'
    },

    subtitle: {
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
        height: 44
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

    filterButtons: {
        backgroundColor: Colors.borderGray,
    },

    buttonNewGroupStyle: {
        borderRadius: 22,
        height: 44,
        width: 44,
        backgroundColor: 'transparent'
    },

    plusIcon: {
        borderRadius: 15,
        height: 30,
        width: 30,
        backgroundColor: 'transparent',
        marginLeft: 6,
        paddingTop: 2
    }
})

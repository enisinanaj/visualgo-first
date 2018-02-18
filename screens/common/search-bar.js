/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Modal,
    Image
} from 'react-native';

import { ImagePicker, Font, AppLoading } from 'expo';
import ImageBrowser from '../ImageBrowser';

import Colors from '../../constants/Colors';
import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';

const {width, height} = Dimensions.get('window');

export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = {
            height: null,
            animating: false,
            open: false,
            hiddenBar: false,
            imageBrowserOpen: false,
            isReady: false
        };

        this.measureView = this.measureView.bind(this);
    }

    componentDidMount() {
        this.loadFonts(() => {setTimeout(() => {this.measureView()}, 0)});
    }

    async loadFonts(onLoaded) {
        await Font.loadAsync({
            'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf'),
            'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
            'roboto': require('../../assets/fonts/Roboto-Regular.ttf'),
            'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf')
        });

        this.setState({isReady: true});
        onLoaded();
    }

    measureView() {
        this.refs.container.measure((a, b, w, h, x, y) => {
           this.setState({height: new Animated.Value(h), original: h});
        });
    }

    hide() {
        if(this.state.animating) {
            return;
        }

        this.setState({animating: true});
        Animated.timing(
            this.state.height,
            {toValue: 0, duration: 500}
        ).start();

        this.setState({hiddenBar: true});
    }

    show() {
        if(!this.state.animating) {
            return;
        }

        this.setState({animating: false});
        Animated.timing(
            this.state.height,
            {toValue: this.state.original, duration: 500}
        ).start();

        setTimeout(() => this.setState({hiddenBar: false}), 350);
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
          console.log(photos)
          this.setState({
            imageBrowserOpen: false,
            photos
          })
        }).catch((e) => console.log(e))
    }

    _renderImagePickerModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.imageBrowserOpen}
                onRequestClose={() => this.setState({imageBrowserOpen: false})}>
                
                <ImageBrowser max={4} callback={this.imageBrowserCallback}/>
            </Modal>
        );
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }

        const {height} = this.state;
        let styleProps = this.props.style != undefined ? this.props.style : {};
        //<Ionicons name='ios-menu-outline' size={24} color={Colors.main}/>
        //<Feather name="camera" size={20} color={Colors.main}/>
        return (
            <View ref='container' style={styleProps}>
                <Animated.View style={[Platform.OS === "ios" ? styles.containerIOS : styles.containerAndroid, {height}]}>
                    { this.state.hiddenBar ? null :
                    <View style={[styles.searchBarOuterContainer, {height: height - 18}]} ref='realSearchBar'>
                        <TouchableOpacity style={styles.icon} onPress={this.props.openMenu}>
                            <View style={{height: 26, width: 26}}>
                                <Image
                                    style={{flex: 1, width: undefined, height: undefined}}
                                    source={require('../../assets/images/icons/menu.png')}
                                    resizeMode="contain"/>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.searchBarContainer}>
                            <View style={styles.searchIcon}>
                                <Ionicons name='ios-search' color='#b2B2B2' size={18} />
                            </View>

                            <TextInput placeholderTextColor={'#B2B2B2'} placeholder={'Search'} style={styles.searchBar}/>
                        </View>

                        <TouchableOpacity style={styles.icon} onPress={() => {this.setState({imageBrowserOpen: true})}}>
                            <View style={{height: 26, width: 26}}>
                                <Image
                                    style={{flex: 1, width: undefined, height: undefined}}
                                    source={require('../../assets/images/icons/camera.png')}
                                    resizeMode="contain"/>
                            </View>
                        </TouchableOpacity>
                    </View>}
                </Animated.View>
                {this._renderImagePickerModal()}
            </View>
        )

    }
}

const styles = StyleSheet.create({
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

    containerAndroid:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
        backgroundColor: Colors.main,
        paddingTop: 24,
        borderBottomColor: Colors.borderGray,
        borderBottomWidth: 1,
    },

    searchBarOuterContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 9,
        paddingTop: 9,
        backgroundColor: Colors.white
    },

    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        height: 26,
        marginTop: 3
    },

    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        width: 239,
        backgroundColor: Colors.borderGray,
        borderColor: Colors.main,
        borderRadius: 15,
        padding: 8,
    },

    searchIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginLeft: 2
    },

    searchBar: {
        flex: 1,
        color: "#B2B2B2",
        fontSize: 12,
        marginLeft: 8,
        fontFamily: 'roboto-light'
    }
})
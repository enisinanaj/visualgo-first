/**
 * Created by ggoma on 12/21/16.
 */
import React, {Component} from 'react';
import {
    View,
    Dimensions,
    ListView,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
import Router from '../../navigation/Router';

const {width, height} = Dimensions.get('window');
import Colors from '../../constants/Colors';
import ChatSearchBar from './chat-search-bar';
import DefaultRow from './default-row';
import NoOpModal from './NoOpModal';
import {Feather, Ionicons, EvilIcons} from '@expo/vector-icons';
import Login from '../Login';
import {NavigationActions} from 'react-navigation';
import {Font, AppLoading} from "expo";

import {MenuIcons} from '../helpers/index';
import DisabledStyle from '../../constants/DisabledStyle';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class BlueMenu extends Component {
    constructor(props) {
        super(props);

        console.log(JSON.stringify(props.tabNavigation));

        const menus = [ 
                {name: 'Report', icon: 'report', onPress: () => {this['report'].toggleState()}, disabled: true, id: 'report'},
                {name: 'Visual Guideline', icon: 'album', onPress: () => {this.props.source.navigateTo('visualGuidelines')}, id: 'visual_guideline'},
                {name: 'Wall', icon: 'bacheca', onPress: () => {}, id: 'wall'},
                {name: 'Calendar', icon: 'calendar', onPress: () => {this['calendar'].toggleState()}, disabled: true, id: 'calendar'},
                {name: 'Messages', icon: 'chat', onPress: () => {this['messages'].toggleState()}, disabled: true, id: 'messages'},
                {name: 'To Do List', icon: 'notification', onPress: () => {}, id: 'to_do_list'},
                {name: 'Anagrafiche', onPress: () => {this['anagrafiche'].toggleState()}, style: {marginTop: 40}, disabled: true, id: 'anagrafiche'},
                {name: 'Gestisci Negozi, cluster e contatti', isSubtitle: true, disabled: true, id: 'anagrafiche'},
                {name: 'Logout', icon: 'log-out', iconPosition: 'right', iconType: 'Feather', onPress: () => {this.logOut()}, style: {marginTop: 15}, id: 'logout'}];

        this.state = {
            dataSource: ds.cloneWithRows(menus),
            menus: menus,
            isReady: false
        }
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
          'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf')
        });

        this.setState({ isReady: true });
    }

    logOut() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'StartScreen'})
            ]
          });
          this.props.navigation.dispatch(resetAction);
    }

    _renderIcon(data) {
        let image;
        switch(data.icon) {
            case 'chat':
                image = data.disabled ? MenuIcons.MESSAGES_MENU_DISABLED : MenuIcons.CHAT_W_IMAGE
                break;
            case 'album':
                image = MenuIcons.ALBUM_W_IMAGE
                break;
            case 'calendar':
                image = data.disabled ? MenuIcons.CALENDAR_MENU_DISABLED : MenuIcons.CALENDAR_W_IMAGE
                break;
            case 'notification':
                image = MenuIcons.NOTIFICATION_W_IMAGE
                break;
            case 'bacheca':
                image = MenuIcons.BACHECA_W_IMAGE
                break;
            case 'report':
                image = data.disabled ? MenuIcons.REPORT_MENU_DISABLED : MenuIcons.REPORT_W_IMAGE
                break;
        }

        if (data.iconType != undefined && data.iconType == 'Feather') {
            return <View style={[styles.mainIcon, {marginLeft: 10, marginTop: 7}]}>
                <Feather name={data.icon} 
                    size={20}
                    color={Colors.white}/>
            </View>
        }

        if (data.icon == undefined) {
            return null;
        }
        
        return <View style={[styles.mainIcon, {marginRight: 10}]}>
            <Image
                style={[{flex: 1, width: undefined, height: undefined}]}
                source={image}
                resizeMode="contain"/>
        </View>;
    }

    renderMenuItem(data) {
        return (
            <TouchableOpacity onPress={() => data.onPress != undefined ? data.onPress() : {}} 
                style={[{flexDirection: 'row'}, data.style != undefined ? data.style : {marginTop: 5}]}>
                {data.iconPosition == undefined || data.iconPosition == "left" ? this._renderIcon(data) : null}
                <Text style={[data.isSubtitle ? styles.subtitle : styles.menuItemLarge, data.disabled ? styles.disabledMenu : {}]}>
                    {data.name}
                </Text>
                {data.iconPosition == "right" ? this._renderIcon(data) : null}
                {data.disabled ?
                    <NoOpModal featureName={data.name} ref={(noOpModal) => this[data.id] = noOpModal} />
                : null}
            </TouchableOpacity>
        )
    }

    _renderMenuItems() {
        return this.state.menus.map((menu, i) => {
            return this.renderMenuItem(menu);
        })
    }

    render() {
        if (!this.state.isReady) {
          return <AppLoading />;
        }

        return (
            <View style={styles.drawer}>
                <Image source={require('../img/dp1.jpg')} style={styles.selectableDisplayPicture} />
                <Text style={styles.accountName}>Daniela Contessa</Text>
                <Text style={styles.accountEmail}>daniela.contessa@warda.it</Text>

                <View style={{flex: 1, flexDirection: 'column', marginTop: 40, justifyContent: 'flex-start'}}>
                    {this._renderMenuItems()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    drawer: {
        height,
        paddingTop: 70,
        paddingLeft: 95, 
        width: width,
        position: 'absolute',
        backgroundColor: Colors.main,
        right: 0
    },

    mainIcon: {
        height: 26,
        width: 26,
        marginTop: 2 
    },

    selectableDisplayPicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 0,
        marginLeft: 10,
    },

    menuItemLarge: {
        fontFamily: 'roboto-thin',
        color: Colors.white,
        fontSize: 28,
    },

    menuItemAndroid: {
        fontSize: 24,
        height: 30
    },

    subtitle: {
        fontSize: 16,
        height: 'auto',
        marginTop: 0,
        width: 165,
        color: Colors.white,
        fontFamily: 'roboto-thin'
    },

    accountName: {
        color: Colors.white,
        fontSize: 28,
        margin: 0,
        padding: 0,
        marginTop: 7,
        marginLeft: 10,
        fontFamily: 'roboto-thin',
    },

    accountEmail: {
        color: Colors.white,
        fontSize: 16,
        marginLeft: 10,
        fontFamily: 'roboto-thin',
    },

    disabledMenu: {
        color: Colors.black
    }
});
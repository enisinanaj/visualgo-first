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

import {
    StackNavigator,
  } from 'react-navigation';

import Router from '../../navigation/Router';

const {width, height} = Dimensions.get('window');
import {EvilIcons} from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import ChatSearchBar from './chat-search-bar';
import DefaultRow from '../common/default-row';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { withNavigation } from '@expo/ex-navigation';

const data = ['Report', 'Visual Guideline', 'Wall', 'Calendar', 'Messages', 'To Do List', ' ', 'Anagrafiche', 'Logout'];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

@withNavigation
export default class BlueMenu extends Component {
    constructor() {
        super();

        

        const menus = [ 
                {name: 'Report', icon: 'ios-podium-outline', onPress: () => {}},
                {name: 'Visual Guideline', icon: 'ios-bowtie-outline', onPress: () => {}},
                {name: 'Wall', icon: 'ios-card-outline', onPress: () => {}},
                {name: 'Calendar', icon: 'ios-calendar-outline', onPress: () => {}},
                {name: 'Messages', icon: 'ios-chatbubbles-outline', onPress: () => {}},
                {name: 'To Do List', icon: 'ios-checkmark-circle-outline', onPress: () => {}},
                {name: ''},
                {name: 'Anagrafiche', onPress: () => {}},
                {name: 'Gestisci negozi, Cluster e contatti', isSubtitle: true},
                {name: 'Logout', icon: 'log-out', iconPosition: 'right', iconType: 'Feather', onPress: () => {this.logOut()}},
                {name: ''}];

        this.state = {
            dataSource: ds.cloneWithRows(menus)
        }
    }

    logOut() {   
        this.props.navigator.push('login');
    }

    _renderRow(data) {
        return (
            <DefaultRow arguments={data} noborder={true} renderChildren={() => this.renderMenuItem(data)}/>
        )
    }

    _renderIcon(data) {
        if (data.iconType != undefined && data.iconType == 'Feather') {
            return <Feather name={data.icon} 
            size={20}
            style={{marginTop: 7, marginLeft: 10, height: 30}}
            color={Colors.white}/>
        }

        return <Ionicons
            name={data.icon}
            size={26}
            style={{marginTop: 3, marginLeft: 10, height: 30}}
            color={Colors.white}
        />;
    }

    renderMenuItem(data){
        return (
            <TouchableOpacity onPress={() => data.onPress()}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', height: Platform.OS == 'ios' ? 10 : 36}} >
                    {data.iconPosition == undefined || data.iconPosition == "left" ? this._renderIcon(data) : null}
                    <Text
                        style={[styles.menuItem, data.iconPosition == 'left' || (data.iconPosition == undefined && data.icon != undefined) 
                            ? {marginLeft: 10, padding: 0} : {},
                            data.iconPosition == 'right' ? {marginLeft: 10, padding: 0} : {},
                            data.isSubtitle != undefined && data.isSubtitle ? styles.subtitle : Platform.OS == 'ios' ? styles.menuItemLarge : styles.menuItemAndroid]}>
                            {data.name}
                    </Text>
                    {data.iconPosition == "right" ? this._renderIcon(data) : null}
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        return (
            <View style={styles.drawer}>
                <Image source={require('../img/elmo.jpg')} style={styles.selectableDisplayPicture} />
                <Text style={styles.accountName}>Giannino De Gianni</Text>
                <Text style={styles.accountEmail}>giannino@warda.it</Text>

                <ListView
                    dataSource={this.state.dataSource}
                    
                    renderRow={Platform.OS == 'ios' ? (data) => this._renderRow(data) : (data) => this.renderMenuItem(data)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    drawer: {
        height,
        paddingTop: 20,
        width: width * 4/5,
        paddingLeft: 40,
        position: 'absolute',
        backgroundColor: Colors.main,
        right: 0
    },

    selectableDisplayPicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 10,
    },

    menuItem: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '100',
        padding: 0,
        margin: 0
    },

    menuItemLarge: {
        fontSize: 28,
        height: 30
    },

    menuItemAndroid: {
        fontSize: 24,
        height: 30
    },

    subtitle: {
        fontSize: 16,
        height: 30
    },

    accountName: {
        color: Colors.white,
        fontSize: 30,
        fontWeight: '100',
        margin: 0,
        padding: 0,
        marginLeft: 10
    },

    accountEmail: {
        color: Colors.white,
        fontSize: 20,
        marginBottom: 30,
        fontWeight: '200',
        marginLeft: 10
    }
});
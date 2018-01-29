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
    Image
} from 'react-native';

const {width, height} = Dimensions.get('window');
import {EvilIcons} from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import ChatSearchBar from './chat-search-bar';
import DefaultRow from '../common/default-row';

const data = ['Report', 'Visual Guideline', 'Wall', 'Calendar', 'Messages', 'To Do List', ' ', 'Anagrafiche', 'Logout'];

const menus = [ {name: 'Report', image: require('../img/elmo.jpg')},
                {name: 'Visual Guideline', image: require('../img/elmo.jpg')},
                {name: 'Wall', image: require('../img/elmo.jpg')},
                {name: 'Calendar', image: require('../img/elmo.jpg')},
                {name: 'Messages', image: require('../img/elmo.jpg')},
                {name: 'To Do List', image: require('../img/elmo.jpg')} ];



const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Drawer extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: ds.cloneWithRows(data)
        }
    }

    _renderRow(data) {
        return <DefaultRow arguments={data} noborder={true} renderChildren={() => this.renderMenuItem(data)}/>
    }

    renderMenuItem(data){

            return (<Text style={styles.menuItem}>{data}</Text>)
        
    }


    render() {
        return (
            <View style={styles.drawer}>
                <Image source={require('../img/elmo.jpg')} style={styles.selectableDisplayPicture} />
                <Text style={styles.accountName}>Giannino De Gianni</Text>
                <Text style={styles.accountEmail}>giannino@warda.it</Text>


                <ListView

                    dataSource={this.state.dataSource}
                    renderRow={(data) => this._renderRow(data)}
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
        marginBottom: 10,
    },

    menuItem: {
        color: Colors.white,
        fontSize: 22,
        paddingLeft: 40,
        
    },

    accountName: {
        color: Colors.white,
        
        fontSize: 22
    },

    accountEmail: {
        color: Colors.white,
        fontSize: 18,
        marginBottom: 30

    }
});
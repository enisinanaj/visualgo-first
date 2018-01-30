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
    TouchableOpacity
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
        return (
        
            <DefaultRow arguments={data} noborder={true} renderChildren={() => this.renderMenuItem(data)}/>

        )
    }

    goToReport = () => {
        console.log("Report");
    }

    goToGuidelines = () => {
        console.log("Guidelines");
    }

    goToWall = () => {
        console.log("Wall");
    }

    goToCalendar = () => {
        console.log("Calendar");
    }

    goToMessages = () => {
        console.log("Messages");
    }

    goToDoList = () => {
        console.log("ToDoList");
    }

    goToAnagrafiche = () => {
        console.log("Anagrafiche");
    }

    goToLogout = () => {
        console.log("Logout");
    }

    


    renderMenuItem(data){

        return (
            <TouchableOpacity onPress={data == 'Report' ? this.goToReport.bind(this) : data == 'Visual Guideline' ? this.goToGuidelines.bind(this) : data == 'Wall' ? this.goToWall.bind(this) : data == 'Calendar' ? this.goToCalendar.bind(this) : data == 'Messages' ? this.goToMessages.bind(this) : data == 'To Do List' ? this.goToDoList.bind(this) : data == 'Anagrafiche' ? this.goToAnagrafiche.bind(this) : data == 'Logout' ? this.goToLogout.bind(this) : null}>
                <Text style={styles.menuItem}>{data}</Text>
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
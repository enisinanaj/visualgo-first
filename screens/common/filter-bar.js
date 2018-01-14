import React, { Component } from 'react';
import { Text, 
    View, 
    Button, 
    Modal, 
    StyleSheet, 
    Dimensions, 
    ListView, 
    TouchableOpacity} from 'react-native';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';
import Shadow from '../../constants/Shadow';

export default class FitlerBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filtersSource: ds.cloneWithRows(this.props.data)
        }
    }

    drawElements(data) {
        if (data == 0) {
            return (
                <TouchableOpacity style={[styles.filterButtonItem, Shadow]}>
                    <EvilIcons name={'search'} size={22} color={Colors.main}/>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity style={[data.selected ? styles.filterButtonsSelected : styles.filterButtons, Shadow]}
                onPress={() => this.setSelected(data)}>
                <Text style={data.selected ? styles.filterButtonSelected : styles.filterButton}>{data.title}</Text>
            </TouchableOpacity>
        )
    }

    setSelected(b) {
        var buttons = this.props.data;

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].selected = false;

            if (buttons[i].title === b.title) {
                buttons[i].selected = true;
            }
        }

        b.onSelected();
        this.setState({filtersSource: ds.cloneWithRows(buttons)});
    }

    render() {
        return <ListView
            horizontal={true}
            style={styles.filtersListView}
            dataSource={this.state.filtersSource}
            renderRow={(data) => this.drawElements(data)}/>;
    }
};

const styles = StyleSheet.create({
    filtersListView: {
        flex: 1,
        height: 60,
        paddingTop: 10,
        width: width * 4.9/5
    },
    filterButtonItem: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 30,
        padding: 17,
        paddingTop: 15,
        height: 44,
        color: Colors.main,
        marginLeft: (width - (width * 4.9/5)) / 2,
    },
    filterButtons: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 17,
        paddingTop: 5,
        height: 44,
        color: Colors.main,
        marginLeft: (width - (width * 4.9/5)) / 2,
    }, 
    filterButton: {
        padding: 0,
        paddingTop: 10,
        margin: 0,
        color: Colors.main
    },
    filterButtonsSelected: {
        flex: 1,
        backgroundColor: Colors.main,
        borderRadius: 20,
        padding: 17,
        paddingTop: 5,
        height: 44,
        color: Colors.white,
        marginLeft: (width - (width * 4.9/5)) / 2,
    }, 
    filterButtonSelected: {
        padding: 0,
        paddingTop: 10,
        margin: 0,
        color: Colors.white
    }
});
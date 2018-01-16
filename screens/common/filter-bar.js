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
                <TouchableOpacity style={[styles.searchButtonContainer, Shadow.filterShadow]}>
                    <EvilIcons name={'search'} size={22} color={Colors.main}/>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity style={[data.selected ? styles.filterButtonsSelected : styles.filterButtons, styles.buttonStyle, Shadow.filterShadow]}
                onPress={() => this.setSelected(data)}>
                <Text style={[data.selected ? styles.filterButtonSelected : styles.filterButton, styles.buttonContentStyle]}>{data.title}</Text>
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

        if (b.onSelected != undefined) {
            b.onSelected();
        }

        this.setState({filtersSource: ds.cloneWithRows(buttons)});
    }

    render() {
        var {customStyle} = this.props || {};

        return <View style={[styles.filterBarContainer, customStyle]}>
                <Text style={styles.filterBarHeader}>Search e filtri contestuali</Text>
                <ListView
                    horizontal={true}
                    style={styles.filtersListView}
                    dataSource={this.state.filtersSource}
                    renderRow={(data) => this.drawElements(data)}/>
            </View>;
    }
};

const styles = StyleSheet.create({
    filterBarContainer: {
        paddingTop: 14,
        paddingLeft: 0,
    },
    filterBarHeader: {
        fontSize: 14,
        fontWeight: '800',
        paddingLeft: 20,
        fontFamily: 'Roboto-Bold'
    },
    filtersListView: {
        flex: 1,
        height: 68,
        paddingBottom: 14,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 14
    },
    searchButtonContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 22,
        padding: 10,
        paddingTop: 14,
        height: 44,
        width: 44,
        marginRight: 8,
        marginBottom: 14,
    },

    filterButtons: {
        backgroundColor: Colors.white,
    },
    filterButtonsSelected: {
        backgroundColor: Colors.main
    },  
    filterButton: {
        color: Colors.main,
    },
    filterButtonSelected: {
        color: Colors.white,
    },

    buttonContentStyle: {
        padding: 0,
        paddingTop: 10,
        margin: 0,
        textAlign: 'center',
    },
    buttonStyle: {
        flex: 1,
        borderRadius: 22,
        padding: 17,
        paddingTop: 5,
        height: 44,
        marginRight: 8,
        minWidth: 75,
        fontFamily: 'Roboto-Light'
    }
});
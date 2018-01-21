import React, { Component } from 'react';
import { Text, 
    View, 
    Button, 
    Modal, 
    StyleSheet, 
    Dimensions, 
    ListView, 
    TouchableOpacity,
    ScrollView} from 'react-native';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';
import Shadow from '../../constants/Shadow';
import { Font } from 'expo';

export default class FitlerBar extends Component {
    constructor(props) {
        super(props);

        var filters = this.props.data;
        filters.push('last-padding');

        this.state = {
            headTitle: this.props.headTitle,
            filtersSource: ds.cloneWithRows(filters),
            searchWidth: 44
        }
    }

    _toggleSearch() {
        if (this.state.searchWidth == 44) {
            this.setState({searchWidth: 250});
        } else {
            this.setState({searchWidth: 44});
        }

        var filters = this.props.data;
        filters.push('last-padding');
        this.setState({filtersSource: ds.cloneWithRows(filters)});
    }

    drawElements(data) {
        if (data == 0) {
            return (
                <TouchableOpacity style={[styles.searchButtonContainer, Shadow.filterShadow, {width: this.state.searchWidth}]} onPress={() => this._toggleSearch()}>
                    <EvilIcons name={'search'} size={22} color={Colors.main}/>
                </TouchableOpacity>
            )
        }

        if (data == 'last-padding') {
            return (
                <View style={{width: 30, backgroundColor: 'transparent'}}></View>
            );
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

        if (b.headTitle) {
            this.setState({headTitle: b.headTitle})
        }
        this.setState({filtersSource: ds.cloneWithRows(buttons)});
    }

    render() {
        var {customStyle} = this.props || {};

        return <View style={styles.filterBarContainer}>
                <Text style={styles.filterBarHeader}>{this.state.headTitle}</Text>

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
        paddingBottom:0,
        height:110
    },
    filterBarHeader: {
        fontSize: 14,
        fontWeight: '800',
        paddingLeft: 20,
        //fontFamily: 'Roboto-Bold'
    },
    filtersListView: {
        flex: 1,
        height: 72,
        paddingBottom: 14,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 0,
        right: 0
    },
    searchButtonContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 22,
        padding: 10,
        paddingTop: 14,
        height: 44,
        //width: 44,
        margin: 8,
        marginBottom: 14,
        marginTop: 2
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
        marginTop: 2
        //fontFamily: 'Roboto-Light'
    }
});
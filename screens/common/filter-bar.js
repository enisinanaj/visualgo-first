import React, { Component } from 'react';
import { Text, 
    View, 
    Button, 
    Modal, 
    StyleSheet, 
    Dimensions, 
    ListView, 
    TouchableOpacity,
    ScrollView,
    TextInput} from 'react-native';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';
import Shadow from '../../constants/Shadow';
import { Font } from 'expo';
import Router from '../../navigation/Router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default class FitlerBar extends Component {
    constructor(props) {
        super(props);

        var filters = this.props.data;
        filters.push('last-padding');

        this.state = {
            headTitle: this.props.headTitle,
            filtersSource: ds.cloneWithRows(filters),
            searchWidth: 44,
            searchQuery: ''
        }
    }

    _toggleSearch() {
        if (this.state.searchWidth == 44) {
            this.setState({searchWidth: width - 50});
        } else {
            this.setState({searchWidth: 44});
        }

        var filters = this.props.data;
        filters.push('last-padding');
        this.setState({filtersSource: ds.cloneWithRows(filters)});

        $this = this;
    }

    _setQuery(q) {
        this.setState({searchQuery: q});
    }

    drawElements(data) {
        if (data.visible === true || data.visible == undefined) {
            if (data.type === 'search' ) {
                return (
                    <TouchableOpacity style={[
                            styles.searchButtonContainer, 
                            Shadow.filterShadow, 
                            {width: data.fixedOpen ? width - 50 : this.state.searchWidth}
                        ]} onPress={() => this._toggleSearch()}>
                        <EvilIcons name={'search'} size={22} color={Colors.main} style={{left: 2, width: 22, marginRight: 10}}/>
                        {this.state.searchWidth > 44 || data.fixedOpen
                            ? 
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextInput underlineColorAndroid={'rgba(0,0,0,0)'} 
                                    placeholder={data.searchPlaceHolder}
                                    autoFocus={data.autoFocus != undefined ? data.autoFocus : true}
                                    style={{backgroundColor: 'transparent', width: 200}}
                                    onChangeText={(arg) => {this._setQuery(arg); data.onType(arg)} }
                                    ref="searchTextBox" value={this.state.searchQuery}/> 
                                {!data.fixedOpen ?
                                    <TouchableOpacity onPress={() => this._toggleSearch()}>
                                        <EvilIcons name={"close"} size={20} color={Colors.main} />
                                    </TouchableOpacity>
                                : null}
                            </View>
                            : null}
                    </TouchableOpacity>
                )
            }

            if (data == 'last-padding') {
                return (
                    <View style={{width: 30, backgroundColor: 'transparent'}}></View>
                );
            }

            if(data.active){

                if(data.title ===  'New'){
                    return (
                        <TouchableOpacity style={[styles.filterButtons, styles.buttonNewGroupStyle, Shadow.filterShadow]}
                            onPress={data.onPress}>
                            <Text style={[styles.filterButton, styles.buttonNewGroupContentStyle]}>{data.title}</Text>
                            <MaterialCommunityIcons style={styles.plusIcon} name={"plus-circle"} size={22} color={Colors.main} />
                        </TouchableOpacity>
                    )
                }else{

                    return (
                        <TouchableOpacity style={[data.selected ? styles.filterButtonsSelected : styles.filterButtons, styles.buttonStyle, Shadow.filterShadow]}
                            onPress={() => this.setSelected(data)}>
                            <Text style={[data.selected ? styles.filterButtonSelected : styles.filterButton, styles.buttonContentStyle]}>{data.title}</Text>
                        </TouchableOpacity>
                    )

                }


            }
        }

        return null;


    }

    setSelected(b) {
        var buttons = this.props.data;

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].selected = false;

            if (buttons[i].title === b.title) {
                buttons[i].selected = true;
            }

            
            if (b.title === 'Group'){
                if(buttons.length > 4){

                    if(buttons[4].title === 'New'){
                        buttons[4].active = true;
                    }
                    
                }

            }else{
                if(buttons.length > 4){

                    if(buttons[4].title === 'New'){
                        buttons[4].active = false;
                    }
                    
                }
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
        height:110,
        width: width
    },
    plusIcon: {
        marginLeft: 15,
        width: 22,
        borderRadius: 11,
        backgroundColor: 'transparent'
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
        flexDirection: 'row',
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
    buttonNewGroupContentStyle: {
        padding: 0,
        paddingTop: 10,
        margin: 0,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
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
    },
    buttonNewGroupStyle: {
        flex: 1,
        borderRadius: 22,
        padding: 8,
        paddingTop: 5,
        height: 44,
        marginRight: 8,
        width: 44,
        marginTop: 2
        
        //fontFamily: 'Roboto-Light'
    }
});
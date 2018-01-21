import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';

export default class DefaultRow extends Component {

    constructor(props) {
        super(props);
        var usePadding = true;

        if (this.props.usePadding != undefined) {
            usePadding = this.props.usePadding;
        }

        this.state = {
            drawBorder: !this.props.noborder,
            usePadding: usePadding
        }
    }

    render() {
        return (
            <View style={[styles.defaultRow, this.state.drawBorder ? styles.border : {},
                this.state.usePadding ? styles.padding : {}]}>
                {this.props.renderChildren(this.props.arguments)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    defaultRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    padding: {
        padding: 10
    },
    border: {
        backgroundColor: '#FFF',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor: Colors.borderGray,
    }
});
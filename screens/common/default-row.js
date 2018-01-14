import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import {EvilIcons} from '@expo/vector-icons';

export default class DefaultRow extends Component {

    render() {
        console.log("defaultRow + " + this.props.arguments);
        return (
            <View style={styles.defaultRow}>
                {this.props.renderChildren(this.props.arguments)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    defaultRow: {
        backgroundColor: '#FFF',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor: Colors.gray,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    }
});
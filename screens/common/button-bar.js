/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {Font, AppLoading} from 'expo';

import {Ionicons} from '@expo/vector-icons'
import Colors from '../../constants/Colors';

export default class ButtonBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: props.buttons,
            isReady: false
        };
    }
    
    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf'),
            'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
            'roboto': require('../../assets/fonts/Roboto-Regular.ttf'),
            'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf')
        });

        this.setState({isReady: true});
    }

    renderButtons() {
        const {buttons, icons} = this.state;
        return buttons.map((button, i) => {
            return (
                <View key={i} style={styles.buttonItem}>
                    <TouchableOpacity onPress={button.onPress}>
                        <Text style={styles.text}>{button.title}</Text>
                    </TouchableOpacity>
                </View>
            )
        })

    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }

        return (
            <View ref='container'>
                <Animated.View style={[styles.container]}>
                    {this.renderButtons()}
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderColor: Colors.borderGray,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },

    buttonItem: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0
    },

    text: {
        fontSize: 14,
        backgroundColor: 'transparent',
        fontWeight: '200',
        marginLeft: 8,
        color: Colors.main,
        fontFamily: 'roboto-Light'
    }
});
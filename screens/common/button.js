/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import Colors from '../../constants/Colors';
import {Ionicons, EvilIcons} from '@expo/vector-icons';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
            name: props.name,
            icon: props.icon,
            iconType: props.iconType,
            iconColor: props.iconColor
        }
    }

    pressed(name) {
        if(name == 'Like') {
            this.setState({pressed: !this.state.pressed});
            if(!this.state.pressed) {
                this.props.onPress('Like');
            } else {
                this.props.onPress('Dislike');
            }
        }
    }

    renderIcon(icon, iconType, pressed, iconColor) {
        if (iconType == undefined || iconType == "ionicon") {
            return (<Ionicons name={icon} size={22} color={pressed ? Colors.liked : iconColor}/>);
        } else if (iconType == "evilicon") {
            return (<EvilIcons name={icon} size={22} color={pressed ? Colors.liked : iconColor} style={styles.evilIcon}/>)
        }
    }

    render() {
        const {pressed, name, icon, iconType, iconColor} = this.state;

        //<Text style={[styles.text, {color: pressed ? Colors.liked : Colors.like}]}>{name}</Text>

        return (
            <TouchableOpacity onPress={() => this.pressed(name)} style={styles.buttonItem}>
                {this.renderIcon(icon, iconType, pressed, iconColor)}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        height: 36,
        borderBottomWidth: StyleSheet.hairlineWidth
    },


    buttonItem: {
            
    },

    text: {
        backgroundColor: 'transparent',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },

    evilIcon: {
        color: Colors.main,
        fontWeight: 800
    }
})
/**
 * Created by ggoma on 1/2/17.
 */
import React, {Component} from 'react';
import {
    Animated,
    PanResponder,
    View,
    Dimensions,
    Image,
    Text,
    Modal,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';

import {getImage} from '../helpers';
import Main from '../../App';
const {width, height} = Dimensions.get('window');

export default class SingleImage extends Component {
    state = {
        pan: new Animated.ValueXY(),
        open: false,

    };

    render() {
        const {image} = this.props;
        return (
            <View ref="view" style={{flex: 1}}>
                <Image style={{flex: 1, height: null, width: null}} source={image} />
            </View>
        )
    }
}
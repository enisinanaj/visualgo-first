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
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {getImage} from '../helpers';
import Main from '../../App';
import EvilIcons from '@expo/vector-icons/EvilIcons';
const {width, height} = Dimensions.get('window');
import Colors from '../../constants/Colors';
import Shadow from '../../constants/Shadow';

export default class SingleImage extends Component {
    state = {
        pan: new Animated.ValueXY(),
        open: false,

    };

    render() {
        const {image} = this.props;

        return (
            <View ref="view" style={{flex: 1}}>
                {this.props.removeSingleVisibile != undefined && this.props.removeSingleVisibile ?
                    <TouchableOpacity onPress={() => this.props.removeSinglePhotoCallack()}
                        style={[styles.removeIconStyle, Shadow.cardShadow]}>
                        <EvilIcons name={"close"} size={22} color={Colors.main} style={{backgroundColor: 'transparent'}}/>
                    </TouchableOpacity>
                : null}
                <Image style={{flex: 1, height: null, width: null}} source={image} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    removeIconStyle: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 99999999,
        borderRadius: 14,
        width: 28,
        height: 28,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: 3,
        paddingTop: 3,
        backgroundColor: Colors.white
    }
});
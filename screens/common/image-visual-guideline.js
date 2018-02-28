/**
 * Created by ggoma on 1/1/17.
 */
import React, {Component} from 'react';
import {
    View,
    Dimensions,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Modal,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import {Font, AppLoading} from 'expo';

import {getImage} from '../helpers';
const {width, height} = Dimensions.get('window');

import _ from 'lodash';
import SingleImage from './single-image';
import ImageScreen from '../imageScreen';
import Router from '../../navigation/Router';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Colors from '../../constants/Colors';

export default class ImageVisualGuideline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imagesScreen: false,
            isReady: false
        }
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto': require('../../assets/fonts/Roboto-Thin.ttf'),
            'roboto-light': require('../../assets/fonts/Roboto-Light.ttf'),
            'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf'),
            'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf')
        });

        this.setState({isReady: true});
    }

    renderImages() {
        const {imageCount, images} = this.props;

        return(
            <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                <View style={styles.imageContainer}>
                    <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
                        <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[0].url}}/>
                        <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[0].url}}/>
                        <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[0].url}}/>
                        <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[0].url}}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
                
        );
    }

    openImages() {
        this.props.onPress()
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }

        const {imageCount} = this.props;
        return (
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.textContent}>{this.props.textContent}</Text>
                </View>
                {this.renderImages()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        height: height/2.5,
    },
    img: {
        flex: 1,
        width: null,
        height: null
    },
    textContainer: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 8
    },
    textContent: {
        fontFamily: 'roboto-light',
        fontSize: 14
    }
});
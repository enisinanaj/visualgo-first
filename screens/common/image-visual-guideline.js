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
import Shadow from '../../constants/Shadow';

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
            <View>
                <ScrollView style={styles.imagesContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={[styles.imageContainer, Shadow.filterShadow]}>
                        <Image style={styles.img} source={{uri: 'http://www.thesimplesociety.com/wordpress/wp-content/uploads/happy_shop_window_12AW_01.jpg'}} resizeMode={"cover"}/>
                    </View>
                    <View style={[styles.imageContainer, Shadow.filterShadow]}>
                        <Image style={styles.img} source={{uri: 'https://image.slidesharecdn.com/learn-the-best-way-to-be-romantic-with-text-the-romance-back-1414463779183-141027213645-conversion-gate01/95/text-the-romance-back-download-pdf-1-638.jpg?cb=1414445823'}} resizeMode={"cover"}/>
                    </View>
                    <View style={[styles.imageContainer, Shadow.filterShadow]}>
                        <Image style={styles.img} source={{uri: 'http://www.oltrefrontieraprogetti.it/en/wp-content/uploads/2015/05/shop_window_ferragamo_autumn_winter_2014.jpg'}} resizeMode={"cover"}/>
                    </View>
                    <View style={[styles.imageContainer, Shadow.filterShadow]}>
                        <Image style={styles.img} source={{uri: 'http://thebwd.com/wp-content/uploads/2013/12/best-window-displays_armani-exchange_2013_christmas_shop-studios_01-960x579.jpg'}} resizeMode={"cover"}/>
                    </View>
                    <View style={[styles.imageContainer, Shadow.filterShadow]}>
                        <Image style={styles.img} source={{uri: 'http://www.oltrefrontieraprogetti.it/en/wp-content/uploads/2015/05/shop_windows_autumn_winter_la_perla_2014.jpg'}} resizeMode={"cover"}/>
                    </View>
                </ScrollView>
            </View>
                
        );
    }

    openImages() {
        this.props.onPress()
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }

        return this.renderImages();
    }
}

const styles = StyleSheet.create({
    imagesContainer: {
        height: 180,
        width: width,
        positition: 'absolute',
        top: -210,
        zIndex: 9999
    },
    imageContainer: {
        width: 110,
        height: 170,
        marginRight: 4,
        marginLeft: 4,
        borderRadius: 10
    },
    img: {
        flex: 1,
        width: 110,
        height: 170,
        borderRadius: 10
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
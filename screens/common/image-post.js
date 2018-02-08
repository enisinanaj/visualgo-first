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
    Modal
} from 'react-native';

import {getImage} from '../helpers';
const {width, height} = Dimensions.get('window');

import _ from 'lodash';
import SingleImage from './single-image';
import ImageScreen from '../imageScreen';
import Router from '../../navigation/Router';

export default class ImagePost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imagesScreen: false
        }
    }

    renderImages() {
        const {imageCount, images} = this.props;

        switch(imageCount) {
            //1 image
            case 1:
                return (
                    <View style={styles.imageContainer}>
                        <SingleImage image={{uri: images[0].url}}/>
                    </View>
                );
                break;

            case 2:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <Image style={[styles.img, {marginBottom: 4}]} source={{uri: images[0].url}}/>
                            <Image style={styles.img} source={{uri: images[1].url}}/>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            case 3:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <Image style={[styles.img, {marginBottom: 4}]} source={{uri: images[0].url}}/>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <Image style={[styles.img, {marginRight: 2}]} source={{uri: images[1].url}}/>
                                <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[2].url}}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            case 4:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
                                <Image style={[styles.img, {marginRight: 2}]} source={{uri: images[0].url}}/>
                                <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[1].url}}/>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <Image style={[styles.img, {marginRight: 2}]} source={{uri: images[2].url}}/>
                                <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[3].url}}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            case 5:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
                                <Image style={[styles.img, {marginRight: 2}]} source={{uri: images[0].url}}/>
                                <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[1].url}}/>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <Image style={[styles.img, {marginRight: 2}]} source={{uri: images[2].url}}/>
                                <Image style={[styles.img, {marginLeft: 2, marginRight: 2}]} source={{uri: images[3].url}}/>
                                <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[4].url}}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            default:
                return(
                    <TouchableWithoutFeedback onPress={this.openImages.bind(this)}>
                        <View style={styles.imageContainer}>
                            <View style={{flexDirection: 'row', flex: 1, marginBottom: 4}}>
                                <Image style={[styles.img, {marginRight: 2}]} source={{uri: images[0].url}}/>
                                <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[1].url}}/>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <Image style={[styles.img, {marginRight: 2}]} source={{uri: images[2].url}}/>
                                <Image style={[styles.img, {marginLeft: 2, marginRight: 2}]} source={{uri: images[3].url}}/>
                                <Image style={[styles.img, {marginLeft: 2}]} source={{uri: images[4].url}} />
                                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.7)', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 18, color: 'white', fontWeight: '700'}}>
                                        + {imageCount - 5}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
        }
    }

    openImages() {
        this.props.onPress()
    }

    render() {
        const {imageCount} = this.props;
        return (
            <View>
                <View style={styles.textContainer}>
                    <Text>{this.props.textContent}</Text>
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
    }
});
/**
 * Created by ggoma on 1/1/17.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageView,
    Dimensions
} from 'react-native';

import Colors from '../constants/Colors';
import Router from '../navigation/Router';

const {width, height} = Dimensions.get('window');

export default class ImageScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    _renderImages() {
        let objs = this.props.images;

        return objs.map((o, i) => {
            return (
                <ImageView key={i} style={styles.image} source={{uri: o.url}}/>
            )
        })
    }

    render() {
        return (
            <View style={{backgroundColor: 'rgba(0,0,0,.5)'}}>
                <ScrollView>
                    {this._renderImages()}
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    imageStyle: {
        flexDirection: 'row',
        height: width,
        width: width,
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: 10,
        borderTopColor: Colors.gray,
        borderTopWidth: StyleSheet.hairlineWidth
    }
});
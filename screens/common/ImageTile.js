import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ImagePicker } from 'expo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window')

export default class ImageTile extends React.PureComponent {

  async openCamera(callback) {

    let options = {
      allowsEditing: true,
      quality: 1,
      base64: true
    };

    let image = await ImagePicker.launchCameraAsync(options);
    callback(image);
  };

  render() {
    let { item, index, selected, selectImage } = this.props;
    if (!item) return null;

    if (item == 'camera') {
      return (
        <TouchableOpacity onPress={() => this.openCamera(selectImage)}>
          <View style={styles.cameraSelection}>
            <FontAwesome name="camera" size={50} color={"#AAAAAA"} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableHighlight
        style={{opacity: selected ? 0.5 : 1}}
        underlayColor='transparent'
        onPress={() => selectImage(index)}
      >
        <View>
          <Image
            style={{width: width/3 - 5, height: width/3 - 5, margin: 2.5}}
            source={{uri: item}}
          />
          <Ionicons name={selected ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} 
                size={30} color={selected ? Colors.main : Colors.gray} style={{position: 'absolute', bottom: 10, right: 10}}/>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  cameraSelection: {
    width: width/3 - 5,
    height: width/3 - 5,
    margin: 2.5,
    backgroundColor: '#DDDDDD',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
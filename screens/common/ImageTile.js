import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Modal
} from 'react-native';

import Colors from '../../constants/Colors';
import { ImagePicker } from 'expo';
import {MaterialCommunityIcons, EvilIcons, FontAwesome, Ionicons} from '@expo/vector-icons';

const { width } = Dimensions.get('window')

export default class ImageTile extends React.PureComponent {

  constructor (props) {
    super(props);

    this.state = {
      cameraModal: false
    }
  }

  async openCamera(callback) {

    let options = {
      allowsEditing: false,
      quality: 1,
      base64: true,
      exif: true
    };

    let image = await ImagePicker.launchCameraAsync(options);
    callback(image);
  };

  renderCameraModal() {
    var {selectImage} = this.props;

    return (<Modal
        animationType={"fade"}
        transparent={false}
        visible={this.state.cameraModal}
        onRequestClose={() => this.setState({cameraModal: false})}>
        {this.openCamera(selectImage)}
      </Modal>)
  }

  render() {
    let { item, index, selected, selectImage } = this.props;
    if (!item) return null;

    if (item == 'camera') {
      return (
        <TouchableOpacity onPress={() => this.setState({cameraModal: true})}>
          <View style={styles.cameraSelection}>
            <FontAwesome name="camera" size={50} color={"#AAAAAA"} />
          </View>
          {this.renderCameraModal()}
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
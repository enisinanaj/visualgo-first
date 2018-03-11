import React, {Component} from 'react';
import {
    View,
    Image,
    Dimensions,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Switch,
    ListView,
    Platform,
    Modal,
    ScrollView
} from 'react-native';
import {Font, AppLoading, Camera, Permissions, ImagePicker} from 'expo';
import {Ionicons, SimpleLineIcons, Feather, Octicons, EvilIcons, FontAwesome, Entypo} from '@expo/vector-icons';
import moment from 'moment';
import locale from 'moment/locale/it'

import DefaultRow from './default-row';
import NoOpModal from './NoOpModal';

import ImageBrowser from '../ImageBrowser';
import Colors from '../../constants/Colors';
import DisabledStyle from '../../constants/DisabledStyle';
import Shadow from '../../constants/Shadow';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class NewAlbum extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            cameraOpen: false,
            imageBrowserOpen: false
        }
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    componentDidMount() {
        this.loadFonts()
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf'),
            'roboto-bold': require('../../assets/fonts/Roboto-Bold.ttf'),
            'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf')
        });

        this.setState({isReady: true});
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
          console.log(photos)
          this.setState({
            imageBrowserOpen: false,
            photos
          })
        }).catch((e) => console.log(e))
    }

    _renderImagePickerModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.imageBrowserOpen}
                onRequestClose={() => this.setState({imageBrowserOpen: false})}>
                
                <ImageBrowser max={4} callback={this.imageBrowserCallback}/>
            </Modal>
        );
    }

    _getDocuments() {
        try {
            Expo.DocumentPicker.getDocumentAsync({});
        } catch (e) {
            
        }
    }

    renderHeader() {
        return (
          <View style={{backgroundColor: '#FFF', paddingTop: 16, borderBottomWidth:StyleSheet.hairlineWidth,
              borderBottomColor: Colors.borderGray, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
              <TouchableOpacity onPress={() => {this.props.closeModal({})}}>
                <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>Cancel</Text>
              </TouchableOpacity>
          </View>
        );
    }

    renderThemeRow() {
        var {theme} = this.props;

        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={[styles.themePhotoContainer, Shadow.smallCardShadow]}>
                    <Image source={{uri: theme.photo.url}} style={{width: 26, height: 26, borderRadius: 4}} />
                </View>
                <Text style={styles.themeName}>{theme.themeName}</Text>
            </View>
        )
    }

    renderEnvironmentRow() {
        var {environment} = this.props;

        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={[styles.environmentCircle, Shadow.filterShadow]}>
                    <FontAwesome name={"circle"} size={30} color={environment.background} />
                </View>
                <Text style={[styles.themeName, {color: environment.background}]}>
                    {environment.environmentName}
                </Text>
            </View>
        )
    }

    async openCamera() {
        let options = {
          allowsEditing: true,
          quality: 1,
          base64: true
        };
    
        let image = await ImagePicker.launchCameraAsync(options);
        this.setState({pictureTaken: image});
    };

    async _getDocuments() { 
        try { 
            let doc = await Expo.DocumentPicker.getDocumentAsync({}); 
            this.setState({docs: docs});
        } catch (e) { 
             
        }
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }
        
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                <View style={styles.statusBarBackground} />
                {this.renderHeader()}
                <View style={{marginLeft: 30, marginRight: 30, flex: 1}}>
                    <Text style={styles.largeTitle}>
                        New Visual Guideline Album for
                    </Text>
                    <DefaultRow renderChildren={() => this.renderThemeRow()} noborder={true} style={{marginTop: 20, paddingLeft: 0}} />
                    <DefaultRow renderChildren={() => this.renderEnvironmentRow()} noborder={true} style={{paddingLeft: 0}} />
                    <Text style={styles.infoText}>
                        A new Visual Guideline Album will be created and linked to the #Theme and the @Environemnt selected. After that the album will be available in the visual guideline area under the name "
                        {this.props.theme.themeName} - <Text style={{color: this.props.environment.background}}>{this.props.environment.environmentName}</Text>"
                    </Text>
                </View>
                <View style={[styles.optionsMenu, Shadow.cardShadow]}>
                    <DefaultRow style={{backgroundColor: 'transparent', padding: 12}}>
                        <TouchableOpacity onPress={() => {this.setState({imageBrowserOpen: true})}} style={{flex: 1}}>
                            <Text style={styles.menuElement}>Photos and Videos</Text>
                        </TouchableOpacity>
                    </DefaultRow>
                    <DefaultRow style={{backgroundColor: 'transparent', padding: 12}}>
                        <TouchableOpacity onPress={() => this.openCamera()}  style={{flex: 1}}>
                            <Text style={styles.menuElement}>Take Picture</Text>
                        </TouchableOpacity>
                    </DefaultRow>
                    <DefaultRow style={{backgroundColor: 'transparent', padding: 12}}>
                        <TouchableOpacity style={{flexDirection: 'row', flex: 1, height: 20, justifyContent: 'space-between'}} 
                            onPress={() => this._getDocuments()}>
                            <Text style={styles.menuElement}>Browse</Text>
                            <Entypo name={"dots-three-horizontal"} size={22} color={Colors.main} style={{marginBottom: 5}}/>
                        </TouchableOpacity>
                    </DefaultRow>
                </View>
                <View style={[styles.optionsMenu, Shadow.cardShadow]}>
                    <DefaultRow style={{backgroundColor: 'transparent', padding: 12}}>
                        <TouchableOpacity onPress={() => this.props.closeModal({})} style={{flex: 1}}>
                            <Text style={[styles.menuElement, {textAlign: 'center', color: Colors.main}]}>Cancel</Text>
                        </TouchableOpacity>
                    </DefaultRow>
                </View>
                {this._renderImagePickerModal()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.white
    },
    statusBarBackground: {
        backgroundColor: Colors.main,
        height: 20,
    },
    largeTitle: {
        fontSize: 30,
        fontFamily: 'roboto-bold',
        marginTop: 14,
        color: Colors.main
    },
    environmentCircle: {
        backgroundColor: 'transparent',
        borederRadius: 15,
        height: 30,
        width: 30,
        marginRight: 12,
        padding: 0
    },
    themePhotoContainer: {
        height: 30,
        width: 30,
        backgroundColor: Colors.white,
        borderRadius: 4,
        padding: 2,
        marginRight: 12
    },
    themeName: {
        color: Colors.black,
        fontSize: 22,
        fontFamily: 'roboto-bold',
        marginTop: 3
    },
    infoText: {
        fontSize: 18,
        fontFamily: 'roboto-light',
        marginTop: 20
    },
    optionsMenu: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: Colors.white,
        borderRadius: 15,
        marginBottom: 15
    },
    menuElement: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
    }
});
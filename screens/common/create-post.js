/**
 * Created by ggoma on 12/21/16.
 */
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


const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const backgroundColorsArray = ['0', '1', '2', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14', '15'];

import Colors from '../../constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Octicons from '@expo/vector-icons/Octicons';
import TagList from './tag-list';
import PostPrivacy from './privacy';
import ImageBrowser from '../ImageBrowser';
import ImagePost from './image-post';
import ImageScreen from '../imageScreen';

export default class CreatePost extends Component{
    constructor() {
        super();
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            k_visible: false,
            backgroundColors: ds.cloneWithRows(backgroundColorsArray),
            tagModal: false,
            privacyModal: false,
            allTags: [],
            imageBrowserOpen: false,
            photos: [],
            imagesListModal: false
        }
    }

    componentDidMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardWillShow');
        Keyboard.removeListener('keyboardWillHide');
    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({visibleHeight: newSize, k_visible: true})
    }

    keyboardWillHide (e) {
        if(this.componentDidMount) {
            this.setState({visibleHeight: Dimensions.get('window').height, k_visible: false})
        }

    }

    post() {
        this.props.closeModal({reload: true})
    }

    renderHeader() {
        return (
            <View style={{backgroundColor: '#FFF', paddingTop: Platform.OS === 'ios' ? 36 : 16, borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                <TouchableOpacity onPress={this.props.closeModal}>
                    <Text>
                        <EvilIcons name={"close"} size={22} color={Colors.main}/>
                    </Text>
                </TouchableOpacity>
                <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>Nuovo Post</Text>
                <TouchableOpacity onPress={() => this.post()}>
                    <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Post</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderPrivacyModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.privacyModal}
                onRequestClose={() => this.setState({privacyModal: false})}>
                <PostPrivacy closeModal={() => this.setState({privacyModal: false})} />
            </Modal>
        );
    }

    renderCommentSwitchRow() {

        if(Platform.OS === 'ios'){
            return (
                <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                    borderBottomColor: Colors.gray, flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', padding: 13}}>
                    <View>
                        <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14}}>
                            Commenti <Switch color={Colors.main} style={{height: 24, marginLeft: 5, marginBottom: 5}}/>
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                        <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14, marginRight: 5}}>
                            Tutti <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 10}} />
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                    borderBottomColor: Colors.gray, flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', padding: 13}}>
                    <View style={styles.viewAndroid}>
                        <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14}}>
                        Commenti 
                        </Text>
                        <Switch color={Colors.main} style={styles.switchAndroid}/>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                        <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14, marginRight: 5}}>
                            Tutti <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 10}} />
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }


    }

    renderPostType() {
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row',
                justifyContent: 'flex-start', alignItems: 'center', padding: 13}}>
                <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14, marginRight: 30, height: 18, marginLeft: 5}}>
                    Task
                </Text>
                <Text style={{color: Colors.black, fontWeight: '800', fontSize: 14, marginRight: 30, height: 18}}>
                    Post
                </Text>
                <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14, height: 18}}>
                    Survey
                </Text>
            </View>
        )
    }

    renderAvatar() {
        return (
            <View style={{flexDirection: 'row', padding: 16, alignItems: 'center'}}>
                <Image source={require('../img/me.png')} style={styles.img}/>
                <View style={{paddingLeft: 8}}>
                    <Text style={{color: 'black', fontWeight: '600'}}>Sung Woo Park</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{padding: 2, paddingLeft: 4, paddingRight: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        marginTop: 4, borderColor: Colors.gray, borderWidth: 1, borderRadius: 5}}>
                            <Ionicons name='md-globe' color={'gray'}/>
                            <Text style={{color: 'gray', marginLeft: 4, marginRight: 4}}>Public</Text>
                            <Ionicons name='md-arrow-dropdown' color={'gray'} size={16}/>
                        </View>
                        <View style={{padding: 2, paddingLeft: 4, paddingRight: 4, marginLeft: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            marginTop: 4, borderColor: Colors.gray, borderWidth: 1, borderRadius: 5}}>
                            <Ionicons name='md-navigate' color={'gray'}/>
                            <Text style={{color: 'gray', marginLeft: 4, marginRight: 4}}>Seoul</Text>
                            <Ionicons name='ios-close' color={'gray'} size={16}/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderText() {
        return (
            <View style={{flex: 1, padding: 16}}>
                <TextInput autoFocus={true} style={{height: Platform.OS === 'ios' ? 50 : 30, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', 
                    fontWeight: '300'}}
                    underlineColorAndroid={'rgba(0,0,0,0)'} 
                    placeholderTextColor={Colors.grayText} 
                    placeholder={"What's on your mind?"}/>
            </View>
        )
    }

    renderColorBox() {
        return (
            <TouchableOpacity style={styles.backgroundColorsItem} />
        );
    }

    renderBackgroundColors() {
        return (
            <View style={{height: 40}}>
                <ListView
                    horizontal={true}
                    contentContainerStyle={styles.backgroundColors}
                    dataSource={this.state.backgroundColors}
                    renderRow={(data) => this.renderColorBox(data)}/>
            </View>
        )
    }

    finishTags(tags) {
        console.log("received tags: " + tags.length);
        this.setState({allTags: tags, tagModal: false});
    }

    renderTaggingModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.tagModal}
                onRequestClose={() => this.setState({tagModal: false})}>
                
                <TagList closeModal={(tags) => this.finishTags(tags)} />
            </Modal>
        );
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {

          let newPhotos = [];
          photos.forEach(element => {
              newPhotos.push({url: element.uri != null ? element.uri : element.file});
          });

          this.setState({
            imageBrowserOpen: false,
            photos: newPhotos
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
                
                <ImageBrowser max={6} callback={this.imageBrowserCallback}/>
            </Modal>
        );
    }

    renderMenu() {
        const objs =
            [
                {
                    name: 'Tagga Cluster, Negozi, Utenti',
                    onPress: () => this.setState({tagModal: true})
                },
                {
                    name: 'Foto/Video',
                    onPress: () => {this.setState({imageBrowserOpen: true})}
                }
            ];

        var {allTags} = this.state;
        if (allTags.length > 0) {
            var clustersLength = allTags.filter((row) => row.category == 'clusters').length;
            var managersLength = allTags.filter((row) => row.category == 'managers').length;
            var storesLength = allTags.filter((row) => row.category == 'stores').length;

            var clustersLabel = '', managersLabel = '', storesLabel = '';

            if (clustersLength > 1) {
                clustersLabel = clustersLength + " Clusters";
            } else if (clustersLength == 1) {
                clustersLabel = allTags.filter((row) => row.category == 'clusters')[0].title;
            }

            if (managersLength > 1) {
                managersLabel = clustersLength > 0 ? ', ' : '';
                managersLabel += managersLength + " Managers";
            } else if (managersLength == 1) {
                managersLabel = clustersLength > 0 ? ', ' : '';
                managersLabel += allTags.filter((row) => row.category == 'managers')[0].title;
            }

            if (storesLength > 1) {
                storesLabel = managersLength > 0 || clustersLength > 0 ? ', ' : '';
                storesLabel += storesLength + " Stores";
            } else if (storesLength == 1) {
                storesLabel = managersLength > 0 || clustersLength > 0 ? ', ' : '';
                storesLabel += allTags.filter((row) => row.category == 'stores')[0].title;
            }

            objs[0].name = "Tag";
            objs[0].innerName = clustersLabel + managersLabel + storesLabel;
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5}}>{o.name}</Text>
                        {o.innerName != undefined && o.innerName != '' ? 
                            <Text style={{color: Colors.main, fontSize: 16, fontWeight: '500', paddingLeft: 5, paddingTop: 5}}>{o.innerName}</Text>
                        : null}
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    renderImagesListModal() {
        return (
            <Modal 
                animationType={"slide"}
                transparent={false}
                visible={this.state.imagesListModal}
                onRequestClose={(images) => this.resetImages(images)}>
                <ImageScreen images={this.state.photos} onClose={(images) => this.resetImages(images)} />
            </Modal>
        );
    }

    resetImages(images) {
        this.setState({photos: images});
        this.setState({imagesListModal: false});
    }

    renderSelectedImages() {
        return this.state.photos.length > 0 && 
            <View style={{marginTop: - 20, backgroundColor: 'transparent'}}>
                <ImagePost imageCount={this.state.photos.length} images={this.state.photos} style={{}} onPress={() => {this.setState({imagesListModal: true})}}/>
            </View>
    }

    render() {
        return (
            <View style={{height: this.state.visibleHeight}}>
                <StatusBar barStyle={'default'} animated={true}/>
                {this.renderHeader()}
                <ScrollView>
                    {this.renderCommentSwitchRow()}
                    {this.renderPostType()}
                    {this.renderText()}
                    {this.renderSelectedImages()}
                    <View style={{bottom: Platform.OS === 'ios' ? 0 : 20}}>
                        {this.renderBackgroundColors()}
                        {this.renderMenu()}
                    </View>
                </ScrollView>
                {this.renderTaggingModal()}
                {this.renderPrivacyModal()}
                {this._renderImagePickerModal()}
                {this.renderImagesListModal()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundColorsItem: {
        height: 20,
        width: 20,
        backgroundColor: Colors.tintColor,
        margin: 4,
        borderRadius: 4
    },

    backgroundColors: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        paddingRight: 10,
        backgroundColor: Colors.white,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.gray,
    }, 

    img: {
        width: 40,
        height: 40
    },

    icon: {
        marginLeft: 10
    },

    switchAndroid:{
        height: 24, 
        marginLeft: 5, 
        marginBottom: 5
    },

    viewAndroid:{
        flexDirection: 'row'
    }
});
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
const backgroundColorsArray = ['#6923b6', '#7c71de', 
                               '#f7d6f0', '#0e3efb', '#d8b96a',
                               '#c32ebd', '#e488f1', '#3f075d',
                               '#198ab8', '#70d384'];

import {Ionicons, SimpleLineIcons, EvilIcons, Octicons} from '@expo/vector-icons';
import {Font, AppLoading} from 'expo';
import Colors from '../../constants/Colors';
import TagList from './tag-list';
import PostPrivacy from './privacy';
import ImageBrowser from '../ImageBrowser';
import ImagePost from './image-post';
import ImageScreen from '../imageScreen';
import NoOpModal from './NoOpModal';
import DisabledStyle from '../../constants/DisabledStyle';
import { isIphoneX, getFileExtension } from '../helpers';
import {AWS_OPTIONS} from '../helpers/appconfig';
import {RNS3} from 'react-native-aws3';
import * as Progress from 'react-native-progress';
import ApplicationConfig from '../helpers/appconfig';

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
            imagesListModal: false,
            text: '',
            postBackgroundColor: '#fff',
            allowComments: false,
            isReady: false,
            fileprogress: [],
            files: [],
            filesUploaded: false,
            publishDisabled: false
        }
    }

    componentDidMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto-light': '../../assets/fonts/Roboto-Light.ttf',
            'roboto-regular': '../../assets/fonts/Roboto-Regular.ttf'
        });

        this.setState({isReady: true});
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
        if (!this.state.filesUploaded && this.state.photos.length > 1) {
            this.uploadFiles();
        } else {
            this.setState({publishDisabled: true});

            let filesToPost = [];
            this.state.files.map((f, i) => {
                let tmp = {
                    id: f.md5 + '.' + getFileExtension(f),
                    type: 'image/' + getFileExtension(f)
                };
                
                filesToPost.push(tmp);
            });

            fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/postmanage', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postvg: {
                      message: this.state.text,
                      backgroundmediaurl: this.state.postBackgroundColor,
                      idauthor: ApplicationConfig.getInstance().me.id,
                      ispublic: 1,
                      mediaurl: filesToPost,
                      store: this.state.allTags.filter(v => {return v.category === 'stores'}),
                      user: this.state.allTags.filter(v => {return v.category === 'managers'})
                    }
                })
            })
            .then((response) => {
                console.debug("Create post result: " + JSON.stringify(response));
                this.props.closeModal({reload: true})
            })
            .catch(e => {
                console.error("error: " + e);
            })
        }
    }

    renderHeader() {
        return (
            <View style={{backgroundColor: '#FFF', paddingTop: Platform.OS === 'ios' ? 36 : 16, borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.borderGray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                {Platform.OS === 'ios' ? 
                    <View style={{position: 'absolute', top: 0, height: 20, width: width, backgroundColor: Colors.main}} />
                : null}
                <TouchableOpacity onPress={this.props.closeModal}>
                    <Text>
                        <EvilIcons name={"close"} size={22} color={Colors.main}/>
                    </Text>
                </TouchableOpacity>
                <View style={{paddingLeft: 20}}>
                    <Text style={{fontSize: 14, color: 'black', fontFamily: 'roboto-bold'}}>New Post</Text>
                </View>
                <TouchableOpacity onPress={() => this.post()} disabled={this.state.photos.length > 0 || this.state.text != '' || this.state.publishDisabled ? false : true}>
                    <Text style={{color: this.state.photos.length > 0 || this.state.text != '' ? Colors.main : Colors.gray, fontSize: 16, fontFamily: 'roboto-light'}}
                        >Pubblica
                    </Text>
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
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.borderGray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 13}}>
                <View style={styles.viewAndroid}>
                    <Text style={{color: Colors.black, fontFamily: 'roboto-light', fontSize: 14, marginTop: 6}}>
                        Commenti 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid} value={this.state.allowComments} 
                        onValueChange={(v) => this.setState({allowComments: v}) }/>
                </View>
                <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                    <Text style={{color: Colors.black, fontFamily: 'roboto-light', fontSize: 14, marginRight: 5}}>
                        Tutti <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 10}} />
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderPostType() {
        return (
            <View style={{backgroundColor: Colors.borderGray, borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.borderGray, flexDirection: 'row',
                justifyContent: 'flex-start', alignItems: 'center', padding: 13, paddingTop: 16}}>
                <TouchableOpacity onPress={() => {this.props.handleTypeChange != undefined ? this.props.handleTypeChange('task') : {}}}>
                    <Text style={{color: Colors.black, fontFamily: 'roboto-light', fontSize: 14, marginRight: 30, height: 18, marginLeft: 5}}>
                        Task
                    </Text>
                </TouchableOpacity>
                
                <Text style={{color: Colors.main, fontFamily: 'roboto-regular', fontSize: 14, marginRight: 30, height: 18}}>
                    Post
                </Text>
                <TouchableOpacity onPress={() => this._noOpSurvey.toggleState()} style={DisabledStyle.disabled}>
                    <Text style={{color: Colors.black, fontFamily: 'roboto-light', fontSize: 14, height: 18}}>
                        Survey
                    </Text>
                    <NoOpModal featureName={"Survey "} ref={(noOpModal) => this._noOpSurvey = noOpModal} />
                </TouchableOpacity>
            </View>
        )
    }

    renderText() {
        return (
            <View style={{flex: 1, padding: 16, backgroundColor: this.state.postBackgroundColor}}>
                <TextInput autoFocus={true} style={{height: Platform.OS === 'ios' ? 50 : 30, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', 
                    fontFamily: 'roboto-light'}}
                    underlineColorAndroid={'rgba(0,0,0,0)'} 
                    placeholderTextColor={Colors.grayText} 
                    placeholder={"What's on your mind?"}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}/>
            </View>
        )
    }

    renderColorBox(data) {
        return (
            <TouchableOpacity style={[styles.backgroundColorsItem, {backgroundColor: data}]} 
                onPress={() => {this.setState({postBackgroundColor: data})}} />
        );
    }

    renderBackgroundColors() {
        return (
            <View style={{height: 40, justifyContent: 'center',
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: Colors.borderGray}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start',
                                  paddingLeft: 10, 
                                  borderRightWidth: StyleSheet.hairlineWidth, 
                                  borderRightColor: Colors.gray}}>
                        
                        <View style={{height: 26, width: 26, marginRight: 10, alignSelf: 'center'}}>
                            <Image
                                style={{flex: 1, width: undefined, height: undefined}}
                                source={require('../../assets/images/icons/camera.png')}
                                resizeMode="contain"/>
                        </View>
                        <SimpleLineIcons name={"emotsmile"} size={17} color={Colors.main} 
                            style={{marginRight: 10, marginTop: 2, alignSelf: 'center'}} />
                    </View>
                    <ListView
                        horizontal={true}
                        contentContainerStyle={styles.backgroundColors}
                        dataSource={this.state.backgroundColors}
                        renderRow={(data) => this.renderColorBox(data)}/>
                </View>
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
            photos: newPhotos,
            files: photos
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
                <View key={i} style={[{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth},
                    i == objs.length - 1 ? {borderBottomColor: Colors.borderGray, borderBottomWidth: StyleSheet.hairlineWidth}: {}]}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.rowTextStyle}>{o.name}</Text>
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
                <ImagePost imageCount={this.state.photos.length} images={this.state.photos} 
                    style={{}} onPress={() => {this.setState({imagesListModal: true})}}
                    removeSinglePhotoCallack={() => this.resetImages([])}
                    removeSingleVisibile={true}/>
            </View>
    }

    async uploadFiles() {
        await this.state.files.map((file, i) => {
            const fileObj = {
                // `uri` can also be a file system path (i.e. file://)
                uri: file.uri != null ? file.uri : file.file,
                name: file.md5 + '.' + getFileExtension(file),
                type: "image/" + getFileExtension(file)
            }
            console.log("uploading file" + JSON.stringify(fileObj) + getFileExtension(file));
            RNS3.put(fileObj, AWS_OPTIONS)
            .progress((e) => {
                let progress = this.state.fileprogress;
                progress[i] = e.percent;
                this.setState({fileprogress: progress});
            })
            .then(response => {
                if (response.status !== 201) {
                    throw new Error("Failed to upload image to S3");
                }
                
                if (i == this.state.files.length - 1) {
                    //siamo arrivati a fine upload files
                    this.setState({filesUploaded: true});
                    this.post();
                }

                //TODO: non si chiude qua il modal
                //this.props.closeModal({reload: true});               
            })
            .catch(function(error) {
                console.log(error);
            });
        });
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        }

        return (
            <View style={{height: this.state.visibleHeight}}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                { isIphoneX() ? <View style={{backgroundColor: Colors.main, height: 22, top: 0, left: 0}}></View>
                        : Platform.OS === 'ios' ? <View style={{backgroundColor: Colors.main, top: 0, left: 0}}></View>
                        : <View style={{backgroundColor: Colors.main, top: 0, left: 0}}></View>}
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
        paddingBottom: 5,
        paddingRight: 10,
        backgroundColor: Colors.white,
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
    },

    rowTextStyle: {
        fontFamily: 'roboto-light',
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 4,
        paddingTop: 5
    }
});
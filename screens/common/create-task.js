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
import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Octicons from '@expo/vector-icons/Octicons';
import ThemesList from './themes-list';
import EnvironmentsList from './environments-list';
import PostPrivacy from './privacy';

export default class CreateTask extends Component{
    constructor() {
        super();
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            k_visible: false,
            backgroundColors: ds.cloneWithRows(backgroundColorsArray),
            themeModal: false,
            environmentModal: false,
            privacyModal: false,
            allThemes: [],
            allEnvironments: [],
            photosCount: 0,
            videosCount: 0,
            count360: 0
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
                <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}></Text>
                <TouchableOpacity onPress={() => this.post()}>
                    <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Pubblica</Text>
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
                    <View>
                        <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14}}>
                            Notification <Switch color={Colors.main} style={{height: 24, marginLeft: 5, marginBottom: 5}}/>
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                        <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14, marginRight: 5}}>
                            Tutti <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 10}} />
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
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
                    <View style={styles.viewAndroid}>
                        <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14}}>
                        Notification 
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
            <View style={{backgroundColor: '#FFF', flexDirection: 'row',
                justifyContent: 'flex-start', alignItems: 'center', padding: 13}}>
                <Text style={{color: Colors.black, fontWeight: '800', fontSize: 14, marginRight: 30, height: 18, marginLeft: 5}}>
                    Task
                </Text>
                <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14, marginRight: 30, height: 18}}>
                    Post
                </Text>
                <Text style={{color: Colors.black, fontWeight: '300', fontSize: 14, height: 18}}>
                    Survey
                </Text>
            </View>
        )
    }

    renderTaskDescription() {
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                    borderBottomColor: Colors.gray, flexDirection: 'row', height: 56,
                    justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                <TextInput autoFocus={false} style={{height: 30, fontSize: 18, textAlignVertical: 'center', 
                    fontWeight: '300', width: width}}
                    underlineColorAndroid={'rgba(0,0,0,0)'} 
                    placeholderTextColor={Colors.grayText} 
                    placeholder={"Descrivi Task"}/>
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

    renderTheme() {
        const objs =
            [
                {
                    name: '#Theme',
                    onPress: () => this.setState({themeModal: true})
                }
            ];

        var {allThemes} = this.state;
        if (allThemes.length > 0) {
            var themesLength = allThemes.filter((row) => row.category == 'themes').length;

            var themesLabel = '';

            if (themesLength > 1) {
                themesLabel = themesLength + " Themes";
            } else if (themesLength == 1) {
                themesLabel = allThemes.filter((row) => row.category == 'themes')[0].title;
            }

            objs[0].name = "Themes";
            objs[0].innerName = themesLabel;
        }

        return objs.map((o, i) => {
            return (
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

    renderColorBox() {
        return (
            <TouchableOpacity style={styles.backgroundColorsItem} />
        );
    }

    renderBackgroundColors() {
        return (
            <View style={{height: 40}}>
                <View style={{flexDirection: 'row', alignContent: 'flex-end', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray}}>
                    <View style={{flexDirection: 'row', alignContent: 'center', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Colors.gray}}>
                        <SimpleLineIcons name={"emotsmile"} size={22} color={Colors.main} style={{marginLeft: 10, alignSelf: 'center'}} />
                        <EvilIcons name={"camera"} color={Colors.main} size={32} style={{marginLeft: 10, marginRight: 10, alignSelf: 'center'}} />
                    </View>
                    <ListView style={{flexGrow: 8}}
                        horizontal={true}
                        contentContainerStyle={styles.backgroundColors}
                        dataSource={this.state.backgroundColors}
                        renderRow={(data) => this.renderColorBox(data)}/>
                </View>
            </View>
        )
    }

    finishThemes(themes) {
        console.log("received themes: " + themes.length);
        this.setState({allThemes: themes, themeModal: false});
    }

    renderThemesModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.themeModal}
                onRequestClose={() => this.setState({themeModal: false})}>
                
                <ThemesList closeModal={(themes) => this.finishThemes(themes)} />
            </Modal>
        );
    }

    renderEnvironment() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this.setState({environmentModal: true})} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5}}>Ambiente</Text>
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    finishEnvironments(environments) {
        console.log("received environments: " + environments.length);
        this.setState({allEnvironments: environments, environmentModal: false});
    }

    renderEnvironmentsModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.environmentModal}
                onRequestClose={() => this.setState({environmentModal: false})}>
                
                <EnvironmentsList closeModal={(environments) => this.finishEnvironments(environments)} />
            </Modal>
        );
    }

    renderVisualGuideline() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => {Expo.DocumentPicker.getDocumentAsync({})}} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5}}>Visual Guideline</Text>
                    <Ionicons name={"ios-attach"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    renderStartDueDate() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5}}>Start/Due Date</Text>
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    renderPhoto() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        {this.state.photosCount > 0 ?
                        <Ionicons name={"ios-checkmark-circle"} color={Colors.main} size={32} style={{marginRight: 0, alignSelf: 'center'}} />
                        : <Ionicons name={"ios-checkmark-circle-outline"} color={Colors.main} size={32} style={{marginRight: 0, alignSelf: 'center'}} /> }
                        <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5, alignSelf: 'center'}}>Foto</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => {this.setState({photosCount: --this.state.photosCount})}} style={{alignSelf: 'center'}}>
                            <EvilIcons name={"minus"} color={Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 21, color: Colors.black}}>{this.state.photosCount}</Text>
                        <TouchableOpacity onPress={() => {this.setState({photosCount: ++this.state.photosCount})}} style={{alignSelf: 'center'}}>
                            <EvilIcons name={"plus"} color={Colors.main} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderVideo() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        {this.state.videosCount > 0 ?
                        <Ionicons name={"ios-checkmark-circle"} color={Colors.main} size={32} style={{marginRight: 0, alignSelf: 'center'}} />
                        : <Ionicons name={"ios-checkmark-circle-outline"} color={Colors.main} size={32} style={{marginRight: 0, alignSelf: 'center'}} /> }
                        <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5, alignSelf: 'center'}}>Video</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => {this.setState({videosCount: --this.state.videosCount})}} style={{alignSelf: 'center'}}>
                            <EvilIcons name={"minus"} color={Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 21, color: Colors.gray}}>{this.state.videosCount}</Text>
                        <TouchableOpacity onPress={() => {this.setState({videosCount: ++this.state.videosCount})}} style={{alignSelf: 'center'}}>
                            <EvilIcons name={"plus"} color={Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render360() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        {this.state.count360 > 0 ?
                        <Ionicons name={"ios-checkmark-circle"} color={Colors.main} size={32} style={{marginRight: 0, alignSelf: 'center'}} />
                        : <Ionicons name={"ios-checkmark-circle-outline"} color={Colors.main} size={32} style={{marginRight: 0, alignSelf: 'center'}} /> }
                        <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5, alignSelf: 'center'}}>360°</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => {this.setState({count360: --this.state.count360})}} style={{alignSelf: 'center'}}>
                            <EvilIcons name={"minus"} color={Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 21, color: Colors.gray}}>{this.state.count360}</Text>
                        <TouchableOpacity onPress={() => {this.setState({count360: ++this.state.count360})}} style={{alignSelf: 'center'}}>
                            <EvilIcons name={"plus"} color={Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderAssignTo() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5}}>Assegna a...</Text>
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    renderTaskAdmins() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16, paddingTop: 5}}>Amministratori del Task</Text>
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={{height: this.state.visibleHeight}}>
                <StatusBar barStyle={'default'} animated={true}/>
                {this.renderHeader()}
                <ScrollView>
                    {this.renderCommentSwitchRow()}
                    {this.renderPostType()}
                    {this.renderTheme()}
                    <View style={{bottom: Platform.OS === 'ios' ? 0 : 20}}>
                        {this.renderBackgroundColors()}
                    </View>
                    {this.renderTaskDescription()}
                    {this.renderEnvironment()}
                    {this.renderVisualGuideline()}
                    {this.renderStartDueDate()}
                    {this.renderPhoto()}
                    {this.renderVideo()}
                    {this.render360()}
                    {this.renderAssignTo()}
                    {this.renderTaskAdmins()}
                </ScrollView>
                {this.renderThemesModal()}
                {this.renderEnvironmentsModal()}
                {this.renderPrivacyModal()}
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
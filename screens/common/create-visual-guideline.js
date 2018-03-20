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
    ScrollView,
    DefaultRow
} from 'react-native';

const {width, height} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const backgroundColorsArray = ['#6923b6', '#7c71de', 
                               '#f7d6f0', '#0e3efb', '#d8b96a',
                               '#c32ebd', '#e488f1', '#3f075d',
                               '#198ab8', '#70d384'];

import {Font, AppLoading} from 'expo';
import Colors from '../../constants/Colors';
import {Ionicons, SimpleLineIcons, Feather, Octicons, EvilIcons, FontAwesome} from '@expo/vector-icons';
import ThemeList from './theme-list';
import EnvironmentsList from './environments-list';
import CalendarView from './calendar';
import PostPrivacy from './privacy';
import TagListTask from './tag-list-task';
import TaskDescription from './task-description';
import moment from 'moment';
import locale from 'moment/locale/it';
import Shadow from '../../constants/Shadow';

export default class CreateVisualGuideline extends Component {
    constructor() {
        super();
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            k_visible: false,
            backgroundColors: ds.cloneWithRows(backgroundColorsArray),
            themeModal: false,
            tagListTastModal: false,
            environmentModal: false,
            privacyModal: false,
            guidelineDescriptionModal: false,
            addPhotoSelected: true,
            addVideoSelected: false,
            add360Selected: false,
            selectedTheme: {},
            allEnvironments: [],
            allNotify: [],
            allShared: [],
            allContributors: [],
            countPhoto: 1,
            countVideo: 0,
            count360: 0,
            start: undefined,
            due: undefined,
            clustersVisible: false,
            storeVisible: false,
            managerVisible: false,
            assignTo: false,
            headTitle: 'Clusters',
            taskDescription: '',
            commentsEnabled: false,
            notificationsEnabled: false,
            isReady: false,
            environment: {},
            sharedClicked: false,
            notifyClicked: false,
            contributorsClicked: false
        }
    }

    componentDidMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto-thin': require('../../assets/fonts/Roboto-Thin.ttf'),
            'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf'),
            'roboto-light': require('../../assets/fonts/Roboto-Light.ttf')
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
        this.props.closeModal({reload: true})
    }

    renderHeader() {
        return (
            <View style={{backgroundColor: '#FFF', paddingTop: 16, 
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                <TouchableOpacity onPress={this.props.closeModal}>
                    <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>
                        <EvilIcons name={"close"} size={22} color={Colors.main}/>
                    </Text>
                </TouchableOpacity>
                <View>
                    <Text style={{fontSize: 14, color: 'black', fontFamily: 'roboto-bold'}}>New Guideline Album</Text>
                </View>
                <TouchableOpacity onPress={() => this.post()}>
                    <Text style={{color: this.state.taskDescription != '' ? 
                            Colors.main : Colors.gray, 
                        fontFamily: 'roboto-light', fontSize: 16}}></Text>
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

    renderGuidelineDescriptionModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.guidelineDescriptionModal}
                onRequestClose={() => this.setState({guidelineDescriptionModal: false})}>
                <TaskDescription closeModal={() => this.setState({guidelineDescriptionModal: false})} 
                    onDescriptionEntered={(description) => this.setState({taskDescription: description, guidelineDescriptionModal: false})} />
            </Modal>
        );
    }

    renderCommentSwitchRow() {
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.borderGray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 13}}>
                <View style={styles.viewAndroid}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'roboto-light'}}>
                        Commenti 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.commentsEnabled} onValueChange={(v) => this.setState({commentsEnabled: v})}/>
                </View>
                <View style={styles.viewAndroid}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'roboto-light'}}>
                        Notification 
                    </Text>
                    <Switch color={Colors.main} style={styles.switchAndroid}
                        value={this.state.notificationsEnabled} onValueChange={(v) => this.setState({notificationsEnabled: v})}/>
                </View>
                <TouchableOpacity onPress={() => this.setState({privacyModal: true})}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={{color: Colors.black, fontSize: 14, marginRight: 5, fontFamily: 'roboto-light', marginTop: 6}}>
                            All
                        </Text>
                        <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 6}} />
                    </View>
                </TouchableOpacity>
            </View>);
    }

    renderGuidelineDescription() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this.setState({guidelineDescriptionModal: true})} 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
                    <Text style={styles.rowTextStyle}>
                        {this.state.taskDescription != '' ? this.state.taskDescription : 'Describe Album'}
                    </Text>
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    renderThemeModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.themeModal}
                onRequestClose={() => this.setState({themeModal: false})}>
                
                <ThemeList closeModal={(theme) => this.onThemeSelected(theme)} />
            </Modal>
        );
    }

    renderTagListTaskModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.tagListTastModal}
                onRequestClose={() => this.setState({tagListTastModal: false})}>
                
                <TagListTask clustersVisible={this.state.clustersVisible} storeVisible={this.state.storeVisible} 
                    managerVisible={this.state.managerVisible} headTitle={this.state.headTitle} closeModal={(tags) => this.finishTagListTask(tags)} />
            </Modal>
        );
    }

    renderTheme() {
        var {selectedTheme} = this.state;

        if (selectedTheme.themeName != undefined) {
            var img = {uri: selectedTheme.photo.url};
        }

        return (
            selectedTheme.themeName == undefined ?
                <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={() => this.setState({themeModal: true})} 
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 4}}>
                                <Text style={[styles.rowTextStyle]}>Choose Task #Theme</Text>
                                <Text style={{color:'red', marginLeft: 5}}>*</Text>
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                </View>
            :
                <View style={{flexDirection: 'row', height: 70, alignItems: 'center', paddingLeft: 0,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 0}}>
                    <TouchableOpacity onPress={() => this.setState({themeModal: true})} 
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <Image style={{flex: 1, height: 70, width: width, 
                                           position:'absolute', resizeMode: 'center', top: -19, left: 0}} 
                                source={img} />
                            <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                                <Text style={{color: Colors.white, fontSize: 22, fontFamily: 'roboto-bold',
                                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                            textShadowOffset: {width: 1, height: 1},
                                            textShadowRadius: 10, flex: 1, padding: 3, textAlign: 'center'}}>
                                    {selectedTheme.themeName}
                                </Text>
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10, backgroundColor: 'transparent'}} />
                    </TouchableOpacity>
                </View>
            )
    }

    renderSelectedTag(data){
        return (
            <Text style={{color: Colors.main, paddingLeft: 8}}>{data.title}</Text>
            
        );
    }

    onThemeSelected(themes) {
        this.setState({selectedTheme: themes, themeModal: false});
    }

    finishTagListTask(tags) {
        if (this.state.contributorsClicked) {
            this.setState({allContributors: tags, tagListTastModal: false, contributorsClicked: false});
        } else if (this.state.notifyClicked) {
            this.setState({allNotify: tags, tagListTastModal: false, notifyClicked: false});
        } else if  (this.state.sharedClicked) {
            this.setState({allShared: tags, tagListTastModal: false, sharedClicked: false});
        }
    }

    renderEnvironment() {
        var {environment} = this.state;

        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this.setState({environmentModal: true})} 
                                  style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        {environment.environmentName == undefined ?
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 4}}>
                                <Text style={[styles.rowTextStyle]}>
                                    Choose Task @Environment
                                </Text>
                                <Text style={{color:'red', marginLeft: 5}}>*</Text>
                            </View>
                        :
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 7}}>
                                <View style={[{width: 22, height: 22, borderRadius: 11, backgroundColor: 'transparent', marginRight: 5, marginTop: 5}, 
                                            Shadow.filterShadow]}>
                                    <FontAwesome name={"circle"} size={22} color={environment.background} />
                                </View>
                                <Text style={[styles.rowTextStyle, {color: environment.background, paddingLeft: 0, fontFamily: 'roboto-bold',
                                              marginTop: 5}]}>
                                    {environment.environmentName}
                                </Text>
                            </View>
                        }
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    finishEnvironments(environment) {
        console.log("selected environement: " + JSON.stringify(environment));
        this.setState({environment: environment, environmentModal: false});
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

    _getDocuments() {
        try {
            Expo.DocumentPicker.getDocumentAsync({});
        } catch (e) {
            
        }
    }

    renderUploadAttach() {

        var {environment, selectedTheme} = this.state;
        var isDisabled = environment.environmentName == undefined || selectedTheme.themeName == undefined;

        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderBottomColor: Colors.borderGray, borderBottomWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => {}} 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}} 
                    disabled={isDisabled}>
                    <Text style={[styles.rowTextStyle, isDisabled ? {color: Colors.grayText} : {color: Colors.black}, {marginTop: 4}]}>
                        Visual Guideline
                    </Text>
                    <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                        <Ionicons name={"ios-attach"} color={isDisabled ? Colors.grayText : Colors.main} size={28} style={{marginRight: 0}} />
                        <EvilIcons name={"chevron-right"} color={isDisabled ? Colors.grayText : Colors.main} size={32} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    prepareSendToModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Manager', tagListTastModal: true, notifyClicked: true});
    }

    renderSendTo() {
        const objs =
            [
                {
                    name: 'Manda notifica a...',
                    onPress: () => this.prepareSendToModal()
                }
            ];

        var {allNotify} = this.state;

        if (allNotify.length > 0) {
            var clustersLength = allNotify.filter((row) => row.category == 'managers').length;
            console.log(clustersLength);
            var clustersLabel = '';

            if (clustersLength > 1) {
                clustersLabel += clustersLength + " Managers";
            } else if (clustersLength == 1) {
                clustersLabel += allNotify.filter((row) => row.category == 'managers')[0].title;
            }

            objs[0].name = "Mando notifica a ";
            objs[0].innerName = clustersLabel;
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 4}}>
                                <Text style={styles.rowTextStyle}>{o.name}</Text>
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, fontFamily: 'roboto-regular', paddingLeft: 5, paddingTop: 4}}>
                                        {o.innerName}
                                    </Text>
                                : null}
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    prepareShareWithModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Manager', tagListTastModal: true, sharedClicked: true});
    }

    renderShareWith() {
        const objs =
            [
                {
                    name: 'Condividi con...',
                    onPress: () => this.prepareShareWithModal()
                }
            ];

        var {allShared} = this.state;

        if (allShared.length > 0) {
            var clustersLength = allShared.filter((row) => row.category == 'managers').length;
            console.log(clustersLength);
            var clustersLabel = '';

            if (clustersLength > 1) {
                clustersLabel += clustersLength + " Managers";
            } else if (clustersLength == 1) {
                clustersLabel += allShared.filter((row) => row.category == 'managers')[0].title;
            }

            objs[0].name = "Condiviso con ";
            objs[0].innerName = clustersLabel;
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 4}}>
                                <Text style={styles.rowTextStyle}>{o.name}</Text>
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, fontFamily: 'roboto-regular', paddingLeft: 5, paddingTop: 4}}>
                                        {o.innerName}
                                    </Text>
                                : null}
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    prepareAddContributorModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Manager', tagListTastModal: true, contributorsClicked: true});
    }

    renderAddContributor() {
        const objs =
            [
                {
                    name: 'Add contributor...',
                    onPress: () => this.prepareAddContributorModal()
                }
            ];

        var {allContributors} = this.state;

        if (allContributors.length > 0) {
            var clustersLength = allContributors.filter((row) => row.category == 'managers').length;
            console.log(clustersLength);
            var clustersLabel = '';

            if (clustersLength > 1) {
                clustersLabel += clustersLength + " Managers";
            } else if (clustersLength == 1) {
                clustersLabel += allContributors.filter((row) => row.category == 'managers')[0].title;
            }

            objs[0].name = "Contributor ";
            objs[0].innerName = clustersLabel;
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 4}}>
                                <Text style={styles.rowTextStyle}>{o.name}</Text>
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, fontFamily: 'roboto-regular', paddingLeft: 5, paddingTop: 4}}>{o.innerName}</Text>
                                : null}
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    prepareTaskAdminsModal() {
        this.setState({clustersVisible: false, storeVisible: false, managerVisible: true, headTitle: 'Managers', tagListTastModal: true});
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }

        return (
            <View style={{height: this.state.visibleHeight}}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                {Platform.OS === 'ios' ? <View style={{height: 20, backgroundColor: Colors.main}}></View> : null}
                {this.renderHeader()}
                <ScrollView>
                    {this.renderCommentSwitchRow()}
                    <View style={{bottom: Platform.OS === 'ios' ? 0 : 20}}>
                        {this.renderTheme()}
                    </View>
                    {this.renderEnvironment()}
                    {this.renderGuidelineDescription()}
                    {this.renderSendTo()}
                    {this.renderShareWith()}
                    {this.renderAddContributor()}
                    {this.renderUploadAttach()}
                </ScrollView>
                {this.renderThemeModal()}
                {this.renderEnvironmentsModal()}
                {this.renderPrivacyModal()}
                {this.renderTagListTaskModal()}
                {this.renderGuidelineDescriptionModal()}
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
        paddingBottom: 5,
        backgroundColor: Colors.white,
    }, 

    backgroundColorsAssignTo: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        paddingRight: 10,
        backgroundColor: Colors.white
    }, 

    backgroundColorsAdmins: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        paddingRight: 10,
        backgroundColor: Colors.white
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
        marginBottom: 5,
    },

    viewAndroid:{
        flexDirection: 'row'
    },

    selectedTheme: {
        color: Colors.main,
        fontSize: 26,
        fontWeight: '500',
        paddingLeft: 5,
        paddingTop: 5,
        fontFamily: 'roboto-light'
    },

    rowTextStyle: {
        fontFamily: 'roboto-light',
        color: '#000000',
        fontSize: 16,
        paddingLeft: 5,
        paddingTop: 0
    }
});
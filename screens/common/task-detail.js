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
import {Ionicons, SimpleLineIcons, Feather, Octicons, EvilIcons} from '@expo/vector-icons';
import ThemeList from './theme-list';
import EnvironmentsList from './environments-list';
import CalendarView from './calendar';
import PostPrivacy from './privacy';
import TagListTask from './tag-list-task';
import TaskDescription from './task-description';
import moment from 'moment';
import locale from 'moment/locale/it';
import FilterBar from './filter-bar';
import DisabledStyle from '../../constants/DisabledStyle';
import NoOpModal from './NoOpModal';
import Shadow from '../../constants/Shadow';

export default class TaskDetail extends Component {
    constructor(props) {
        super(props);

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
            allTags: [],
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
            isReady: false
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
            'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf')
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
            <View style={{flexDirection: 'row', height: 55, alignItems: 'center', paddingLeft: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray, 
                    paddingTop: Platform.OS === 'ios' ? 36 : 16, padding: 16}}>
                <View style={{flex:1, paddingTop: 5}}>
                    <Image style={{flex: 1, height: 50, width: width, 
                                    position:'absolute', resizeMode: 'center', top: -19, left: 0}} 
                                    source={{uri:'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={this.props.closeModal}>
                                <EvilIcons name={"close"} size={22} color={Colors.main}/>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'flext-start', height: 16}}>
                                <Text style={styles.name}>Task {this.props.data.theme.name}</Text>
                                <Text style={[styles.environment, {color: this.props.data.environment.color}]}>
                                    {this.props.data.environment.name}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Image source={require("../../assets/images/icons/twoCards.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderFilters() {
        filters = [{title: 'Stats', icon: 'ios-podium-outline', onPress: () => {}},
            {title: 'Summary', selected: true, active: true}, 
            {title: 'All Stores', active: true}, 
            {title: 'Pending', active: true}];
        
        return <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={""} />
                </View>;
    }

    renderCommentSwitchRow() {
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.borderGray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 13}}>
                <View style={styles.viewAndroid}>
                    <Text style={{color: Colors.black, fontSize: 14, marginTop: 6, fontFamily: 'roboto-light'}}>
                        Comments 
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
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flext-start'}}>
                        <Text style={{color: Colors.black, fontSize: 14, marginRight: 5, fontFamily: 'roboto-light', marginTop: 6}}>
                            All
                        </Text>
                        <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 6}} />
                    </View>
                </TouchableOpacity>
            </View>);
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

    renderText() {
        return (
            <View style={{flex: 1, padding: 16, backgroundColor: this.state.postBackgroundColor}}>
                <TextInput autoFocus={false} style={{height: Platform.OS === 'ios' ? 50 : 30, fontSize: 16, textAlign: 'left',  
                    fontWeight: '300'}}
                    underlineColorAndroid={'rgba(0,0,0,0)'} 
                    placeholderTextColor={Colors.grayText}
                    disabled={true}
                    multiline = {true}
                    height={200}
                    value='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'/>
            </View>
        )
    }

    renderStartDueDate() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}} onPress={() => this.setState({calendarModal: true})}>
                    {this.state.start != undefined && this.state.due != undefined ?
                        <Text style={{color: 'gray', fontSize: 16, fontWeight: '200', paddingLeft: 2, paddingTop: 5, color: Colors.main}}>
                            {moment(this.state.start).locale("it").format("DD/MM/YYYY")} - {moment(this.state.due).locale("it").format("DD/MM/YYYY")}
                        </Text>
                    :
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={styles.rowTextStyle}>Start/Due Date</Text>
                    </View>}
                    <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
        )
    }

    renderPhoto() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.setState({addPhotoSelected: !this.state.addPhotoSelected, countPhoto: 0})} 
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 4}}>
                        {this.state.addPhotoSelected ?
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/checked.png")} />
                        :   
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/unchecked.png")} />
                        }
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>Foto</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10}}>
                        <TouchableOpacity onPress={() => {this.setState({countPhoto: --this.state.countPhoto})}} style={{alignSelf: 'center'}} disabled={this.state.countPhoto > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.addPhotoSelected) && (this.state.countPhoto > 0)) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 20, color: this.state.countPhoto > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.countPhoto}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({countPhoto: ++this.state.countPhoto})}} style={{alignSelf: 'center'}} disabled={!this.state.addPhotoSelected}>
                            <EvilIcons name={"plus"} color={(this.state.addPhotoSelected) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderVideo() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.setState({addVideoSelected: !this.state.addVideoSelected, countVideo: 0})} 
                                      style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 4}}>
                        {this.state.addVideoSelected ?
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/checked.png")} />
                        :   
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/unchecked.png")} />
                        }
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>Video</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10}}>
                        <TouchableOpacity onPress={() => {this.setState({countVideo: --this.state.countVideo})}} style={{alignSelf: 'center'}} disabled={this.state.countVideo > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.addVideoSelected) && (this.state.countVideo > 0)) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 20, color: this.state.countVideo > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.countVideo}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({countVideo: ++this.state.countVideo})}} style={{alignSelf: 'center'}} disabled={!this.state.addVideoSelected}>
                            <EvilIcons name={"plus"} color={(this.state.addVideoSelected) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render360() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this.setState({add360Selected: !this.state.add360Selected, count360: 0})} 
                                      style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 4}}>
                        {this.state.add360Selected ?
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/checked.png")} />
                        :   
                            <Image style={{width: 18, height: 16, resizeMode: 'center', marginTop: 3}} source={require("../../assets/images/icons/unchecked.png")} />
                        }
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>360°</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10}}>
                        <TouchableOpacity onPress={() => {this.setState({count360: --this.state.count360})}} style={{alignSelf: 'center'}} disabled={this.state.count360 > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.add360Selected) && (this.state.count360 > 0)) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 20, color: this.state.count360 > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.count360}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({count360: ++this.state.count360})}} style={{alignSelf: 'center'}} disabled={!this.state.add360Selected}>
                            <EvilIcons name={"plus"} color={(this.state.add360Selected) ? Colors.main : Colors.gray} size={27} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    prepareAssignToModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Managers', tagListTastModal: true});
    }

    renderAssignTo() {
        const objs =
            [
                {
                    name: 'Assigned to',
                    onPress: () => this.prepareAssignToModal()
                }
            ];

        var {allTags} = this.state;

        if (allTags.length > 0) {
            var clustersLength = allTags.filter((row) => row.category == 'clusters').length;
            console.log(clustersLength);
            var clustersLabel = '';

            if (clustersLength > 1) {
                clustersLabel += clustersLength + " Clusters";
            } else if (clustersLength == 1) {
                clustersLabel += allTags.filter((row) => row.category == 'clusters')[0].title;
            }

            objs[0].name = "Assegnato a ";
            objs[0].innerName = clustersLabel;

            var managersLength = allTags.filter((row) => row.category == 'managers').length;
            console.log(managersLength);
            var managersLabel = '';

            if (managersLength > 1) {
                managersLabel += managersLength + " Managers";
            } else if (managersLength == 1) {
                managersLabel += allTags.filter((row) => row.category == 'managers')[0].title;
            }

            objs[0].innerName = managersLabel;
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Text style={[styles.rowTextStyle, {marginTop: 4}]}>{o.name}</Text>
                                {(allTags.length == 0 || clustersLength == 0) && false ? <Text style={{color: 'red', marginLeft: 5}}>*</Text> : null }
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, fontWeight: '500', paddingLeft: 5, paddingTop: 5}}>{o.innerName}</Text>
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

    renderTaskAdmins() {
        const objs =
            [
                {
                    name: 'Task Manager',
                    onPress: () => this._noOpModal != undefined ? this._noOpModal.toggleState() : {}
                }
            ];

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} 
                                      style={[{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}, DisabledStyle.disabled]}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Text style={[styles.rowTextStyle, {marginTop: 4, color: Colors.main}]}>{o.name}</Text>
                                {false ? <Text style={{color: 'red', marginLeft: 5}}>*</Text> : null }
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, paddingLeft: 5, paddingTop: 0}}>{o.innerName}</Text>
                                : null}
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10}} />
                    </TouchableOpacity>
                    <NoOpModal featureName={"Task administrators "} ref={(noOpModal) => this._noOpModal = noOpModal} />
                </View>
            )
        })
    }

    renderArchiveMenu() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={[styles.rowTextStyle, {color: Colors.main}]}>Archivia Task</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderDeleteMenu() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={[styles.rowTextStyle, {color: '#E64E17'}]}>Elimina Task</Text>
                    </View>
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
        this.setState({allTags: tags, tagListTastModal: false});
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

    _getDocuments() {
        try {
            Expo.DocumentPicker.getDocumentAsync({});
        } catch (e) {
            
        }
    }

    renderUploadAttach() {
        return (
            <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this._getDocuments()} disabled={true} 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flext-start', height: 16, marginTop: 10}}>
                        <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                            <Image style={styles.taskThumbnail} source={{uri: this.props.data.media[0].url}} />
                        </View>
                        <Text style={styles.name}>Task {this.props.data.theme.name}</Text>
                        <Text style={[styles.environment, {color: this.props.data.environment.color}]}>
                            {this.props.data.environment.name}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                        <Ionicons name={"ios-attach"} color={Colors.main} size={32} style={{marginRight: 5, marginTop: 2}} />
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10, marginTop: 5}} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    prepareAssignToModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Clusters', tagListTastModal: true});
    }

    prepareTaskAdminsModal() {
        this.setState({clustersVisible: false, storeVisible: false, managerVisible: true, headTitle: 'Managers', tagListTastModal: true});
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }

        const {data} = this.props;

        return (
            <View style={{height: this.state.visibleHeight}}>
                <StatusBar barStyle={'default'} animated={true}/>
                {this.renderHeader()}
                <ScrollView>
                    {this.renderFilters()}
                    {this.renderCommentSwitchRow()}
                    <View style={{bottom: Platform.OS === 'ios' ? 0 : 20}}>
                        {this.renderText()}
                    </View>
                    {this.renderUploadAttach()}
                    {this.renderStartDueDate()}
                    {this.renderPhoto()}
                    {this.renderVideo()}
                    {this.render360()}
                    {this.renderAssignTo()}
                    {this.renderTaskAdmins()}
                    {this.renderArchiveMenu()}
                    {this.renderDeleteMenu()}
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
        onTintColor: Colors.main
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

    name: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'roboto-bold',
        height: 16
    },
    
    environment: {
        fontSize: 14,
        height: 16,
        color: 'black',
        fontFamily: 'roboto-bold',
        marginLeft: 4
    },

    rowTextStyle: {
        fontFamily: 'roboto-light',
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 4
    },

    filterBarContainer: {
        borderBottomColor: Colors.borderGray,
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 85
    },

    taskThumbnailContainer: {
        height: 30,
        width: 30,
        borderRadius: 4,
        borderColor: Colors.white,
        borderWidth: 2,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: -6,
        marginRight: 6
    },

    taskThumbnail: {
        backgroundColor: 'transparent',
        height: 26,
        width: 26,
        borderRadius: 4,    
    },
});
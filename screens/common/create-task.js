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
import NoOpModal from './NoOpModal';
import PostPrivacy from './privacy';
import TagListTask from './tag-list-task';
import TaskDescription from './task-description';
import moment from 'moment';
import locale from 'moment/locale/it'
import DisabledStyle from '../../constants/DisabledStyle';

export default class CreateTask extends Component {
    constructor() {
        super();
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            k_visible: false,
            backgroundColors: ds.cloneWithRows(backgroundColorsArray),
            themeModal: false,
            tagListTastModal: false,
            environmentModal: false,
            calendarModal: false,
            privacyModal: false,
            taskDescriptionModal: false,
            addPhotoSelected: true,
            addVideoSelected: false,
            add360Selected: false,
            selectedTheme: {},
            environment: {},
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
            <View style={{backgroundColor: '#FFF', paddingTop: Platform.OS === 'ios' ? 36 : 16, 
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                <TouchableOpacity onPress={this.props.closeModal}>
                    <Text style={{color: Colors.main, fontFamily: 'roboto-light', fontSize: 16}}>
                        {false ? <EvilIcons name={"close"} size={22} color={Colors.main}/> : null}
                        Cancel
                    </Text>
                </TouchableOpacity>
                <View>
                    <Text style={{fontSize: 16, color: 'black', fontFamily: 'roboto-bold'}}>New Task</Text>
                </View>
                <TouchableOpacity onPress={() => this.post()}>
                    <Text style={{color: this.state.taskDescription != '' ? 
                            Colors.main : Colors.gray, 
                        fontFamily: 'roboto-light', fontSize: 16}}>Pubblica</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderCalendarModal() {
        return <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.calendarModal}
            onRequestClose={() => this.setState({calendarModal: false})}>
            <CalendarView closeModal={() => this.setState({calendarModal: false})} 
                onDone={(selected) => {this.setState({...selected, calendarModal: false})}}/>
        </Modal>;
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

    renderTaskDescriptionModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.taskDescriptionModal}
                onRequestClose={() => this.setState({taskDescriptionModal: false})}>
                <TaskDescription closeModal={() => this.setState({taskDescriptionModal: false})} 
                    onDescriptionEntered={(description) => this.setState({taskDescription: description, taskDescriptionModal: false})} />
            </Modal>
        );
    }

    renderCommentSwitchRow() {
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor: Colors.gray, flexDirection: 'row',
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
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flext-start'}}>
                        <Text style={{color: Colors.black, fontSize: 14, marginRight: 5, fontFamily: 'roboto-light', marginTop: 6}}>
                            Tutti
                        </Text>
                        <Octicons name={"globe"} size={16} color={Colors.main} style={{paddingTop: 6}} />
                    </View>
                </TouchableOpacity>
            </View>);
    }

    renderPostType() {
        return (
            <View style={{backgroundColor: Colors.borderGray, flexDirection: 'row',
                justifyContent: 'flex-start', alignItems: 'center', padding: 13, paddingTop: 17}}>
                <Text style={{color: Colors.main, fontSize: 14, marginRight: 30, height: 18, marginLeft: 5, fontFamily: 'roboto-regular'}}>
                    Task
                </Text>
                <TouchableOpacity onPress={() => {this.props.handleTypeChange != undefined ? this.props.handleTypeChange('post') : {}}}>
                    <Text style={{color: Colors.black, fontSize: 14, marginRight: 30, height: 18, fontFamily: 'roboto-light'}}>
                        Post
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._noOpSurvey.toggleState()} style={DisabledStyle.disabled}>
                    <Text style={{color: Colors.black, fontSize: 14, height: 18, fontFamily: 'roboto-light'}}>
                        Survey
                    </Text>
                    <NoOpModal featureName={"Survey "} ref={(noOpModal) => this._noOpSurvey = noOpModal} />
                </TouchableOpacity>
            </View>
        )
    }

    renderTaskDescription() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this.setState({taskDescriptionModal: true})} 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.rowTextStyle}>
                        {this.state.taskDescription != '' ? this.state.taskDescription : 'Describe Task'}
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
        const objs =
            [
                {
                    name: 'Choose Task #Theme',
                    onPress: () => this.setState({themeModal: true})
                }
            ];

        var {selectedTheme} = this.state;
        if (selectedTheme != undefined && selectedTheme.themeName != undefined) {
            objs[0].name = selectedTheme.themeName;
        }

        return objs.map((o, i) => {

            return (
                <View key={i} style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Text style={[styles.rowTextStyle, selectedTheme.themeName == undefined ? {} : {color: Colors.main}]}>
                                    {o.name}
                                </Text>
                                {selectedTheme.themeName == undefined ? <Text style={{color:'red', marginLeft: 5}}>*</Text> : null}
                            </View>
                        </View>
                        <EvilIcons name={"chevron-right"} color={Colors.main} size={32} style={{marginRight: 10, marginTop: o.innerName != undefined && o.innerName != '' ? 10 : 0}} />
                    </TouchableOpacity>
                </View>
            )
        })
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

    renderEnvironment() {
        var {environment} = this.state;

        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this.setState({environmentModal: true})} 
                                  style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Text style={[styles.rowTextStyle, environment.environmentName != undefined ? {color: Colors.main} : {}]}>
                                {environment.environmentName == undefined ? 
                                    'Choose Task @Environment' : environment.environmentName}
                            </Text>
                            {environment.environmentName == undefined ? 
                                <Text style={{color:'red', marginLeft: 5}}>*</Text> : null}
                        </View>
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

    renderVisualGuideline() {
        var {environment, selectedTheme} = this.state;
        var isDisabled = environment.environmentName == undefined || selectedTheme.themeName == undefined;

        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity onPress={() => this._getDocuments()} 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}} 
                    disabled={isDisabled}>
                    <Text style={[styles.rowTextStyle, isDisabled ? {color: Colors.grayText} : {color: Colors.black}]}>Visual Guideline</Text>
                    <Ionicons name={"ios-attach"} color={isDisabled ? Colors.grayText : Colors.main} size={28} style={{marginRight: 20}} />
                </TouchableOpacity>
            </View>
        )
    }

    renderStartDueDate() {
        return (
            <View style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}} onPress={() => this.setState({calendarModal: true})}>
                    {this.state.start != undefined && this.state.due != undefined ?
                        <Text style={{color: 'gray', fontSize: 16, fontWeight: '200', paddingLeft: 16, paddingTop: 5, color: Colors.main}}>
                            {moment(this.state.start).locale("it").format("DD/MM/YYYY")} - {moment(this.state.due).locale("it").format("DD/MM/YYYY")}
                        </Text>
                    :
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.rowTextStyle}>Start/Due Date</Text>
                    </View>}
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
                    <TouchableOpacity onPress={() => this.setState({addPhotoSelected: !this.state.addPhotoSelected, countPhoto: 0})} style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Feather name={this.state.addPhotoSelected ? "check-square" : "square"} size={27} color={Colors.main} />
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 16, paddingTop: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>Foto</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => {this.setState({countPhoto: --this.state.countPhoto})}} style={{alignSelf: 'center'}} disabled={this.state.countPhoto > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.addPhotoSelected) && (this.state.countPhoto > 0)) ? Colors.main : Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 21, color: this.state.countPhoto > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.countPhoto}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({countPhoto: ++this.state.countPhoto})}} style={{alignSelf: 'center'}} disabled={!this.state.addPhotoSelected}>
                            <EvilIcons name={"plus"} color={(this.state.addPhotoSelected) ? Colors.main : Colors.gray} size={32} style={{marginRight: 5}} />
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
                    <TouchableOpacity onPress={() => this.setState({addVideoSelected: !this.state.addVideoSelected, countVideo: 0})} style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Feather name={!this.state.addVideoSelected ? "square" : "check-square"} size={27} color={Colors.main} />
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 16, paddingTop: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>Video</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => {this.setState({countVideo: --this.state.countVideo})}} style={{alignSelf: 'center'}} disabled={this.state.countVideo > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.addVideoSelected) && (this.state.countVideo > 0)) ? Colors.main : Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 21, color: this.state.countVideo > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.countVideo}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({countVideo: ++this.state.countVideo})}} style={{alignSelf: 'center'}} disabled={!this.state.addVideoSelected}>
                            <EvilIcons name={"plus"} color={(this.state.addVideoSelected) ? Colors.main : Colors.gray} size={32} style={{marginRight: 5}} />
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
                    <TouchableOpacity onPress={() => this.setState({add360Selected: !this.state.add360Selected, count360: 0})} style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Feather name={this.state.add360Selected ? "check-square" : "square"} size={27} color={Colors.main} />
                        <Text style={{color: '#000000', fontSize: 16, paddingLeft: 16, paddingTop: 5, alignSelf: 'center', fontFamily: 'roboto-light'}}>360°</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity onPress={() => {this.setState({count360: --this.state.count360})}} style={{alignSelf: 'center'}} disabled={this.state.count360 > 0 ? false : true}>
                            <EvilIcons name={"minus"} color={((this.state.add360Selected) && (this.state.count360 > 0)) ? Colors.main : Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                        <Text style={{marginRight: 5, alignSelf: 'center', fontSize: 21, color: this.state.count360 > 0 ? Colors.black : Colors.gray, fontFamily: 'roboto-light'}}>
                            {this.state.count360}
                        </Text>
                        <TouchableOpacity onPress={() => {this.setState({count360: ++this.state.count360})}} style={{alignSelf: 'center'}} disabled={!this.state.add360Selected}>
                            <EvilIcons name={"plus"} color={(this.state.add360Selected) ? Colors.main : Colors.gray} size={32} style={{marginRight: 5}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    prepareAssignToModal() {
        this.setState({clustersVisible: true, storeVisible: true, managerVisible: true, headTitle: 'Clusters', tagListTastModal: true});
    }

    renderAssignTo() {
        const objs =
            [
                {
                    name: 'Assegna a...',
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
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Text style={styles.rowTextStyle}>{o.name}</Text>
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
                    name: 'Amministratori del Task',
                    onPress: () => this._noOpModal != undefined ? this._noOpModal.toggleState() : {}
                }
            ];

        var {allTags} = this.state;

        if (allTags.length > 0) {
            var managersLength = allTags.filter((row) => row.category == 'managers').length;
            console.log(managersLength);
            var managersLabel = '';

            if (managersLength > 1) {
                managersLabel += managersLength + " Managers";
            } else if (managersLength == 1) {
                managersLabel += allTags.filter((row) => row.category == 'managers')[0].title;
            }

            objs[0].name = "Task Manager ";
            objs[0].innerName = managersLabel;
        }

        return objs.map((o, i) => {
            return (o.visible == undefined || o.visible) && (
                <View key={i} style={[{flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                    borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth}, DisabledStyle.disabled]}>
                    <TouchableOpacity onPress={o.onPress} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex:1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <Text style={styles.rowTextStyle}>{o.name}</Text>
                                {(allTags.length == 0 || managersLength == 0) && false ? <Text style={{color: 'red', marginLeft: 5}}>*</Text> : null }
                                {o.innerName != undefined && o.innerName != '' ? 
                                    <Text style={{color: Colors.main, fontSize: 16, fontWeight: '500', paddingLeft: 5, paddingTop: 5}}>{o.innerName}</Text>
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
 
    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }

        return (
            <View style={{height: this.state.visibleHeight}}>
                <StatusBar barStyle={'default'} animated={true}/>
                {this.renderHeader()}
                <ScrollView>
                    {this.renderCommentSwitchRow()}
                    {this.renderPostType()}
                    <View style={{bottom: Platform.OS === 'ios' ? 0 : 20}}>
                        {this.renderTheme()}
                    </View>
                    {this.renderEnvironment()}
                    {this.renderTaskDescription()}
                    {this.renderVisualGuideline()}
                    {this.renderStartDueDate()}
                    {this.renderPhoto()}
                    {this.renderVideo()}
                    {this.render360()}
                    {this.renderAssignTo()}
                    {this.renderTaskAdmins()}
                </ScrollView>
                {this.renderThemeModal()}
                {this.renderEnvironmentsModal()}
                {this.renderCalendarModal()}
                {this.renderPrivacyModal()}
                {this.renderTagListTaskModal()}
                {this.renderTaskDescriptionModal()}
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

    rowTextStyle: {
        fontFamily: 'roboto-light',
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 16,
        paddingTop: 5
    }
});
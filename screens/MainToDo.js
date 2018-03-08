import React from 'react';
import { StyleSheet, FlatList, Platform, fontWeight, 
    Image, backgroundColor, Text, fontFamily, fontSize, View, 
    Button, TouchableHighlight, TextInput, TouchableOpacity, 
    Alert, ScrollView, Dimensions} from 'react-native';

import {Ionicons, Entypo} from '@expo/vector-icons';
import {Font, AppLoading} from 'expo';

import FilterBar from './common/filter-bar';
import NoOpModal from './common/NoOpModal';
import Colors from '../constants/Colors';
import Shadow from '../constants/Shadow';

const {width, height} = Dimensions.get('window');
const filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
    {title: 'Survey', active: true, disabled: true}, 
    {title: 'Post', active: true, disabled: true}, 
    {title: 'Task', selected: true, active: true},
    {title: 'Done', active: true, selected: false}];

export default class MainToDo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        }
    }

    componentDidMount() {
        this.loadFonts();

        for (i in filters) {
            if (filters[i].title == 'Survey') {
                filters[i].onPress = () => this._noOpSurveyInFilter.toggleState();
            }

            if (filters[i].title == 'Post') {
                filters[i].onPress = () => this._noOpPosts.toggleState();
            }
        }
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
            'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
            'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
            'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
            'roboto-bolditalic': require('../assets/fonts/Roboto-BoldItalic.ttf')
        });

        this.setState({isReady: true});
    }

    renderCardTitle() {
        return (
            <View style={[styles.avatarContainer]}>
                <View style={[styles.taskThumbnailContainer, Shadow.filterShadow]}>
                    <Image style={styles.taskThumbnail} source={{uri: 'https://media.timeout.com/images/103399489/image.jpg'}} />
                </View>
                <View style={[styles.avatarPhotoContainer, Shadow.filterShadow]}>
                    <Image style={styles.profile} source={require('./img/dp2.jpg')}/>
                </View>
                <View style={styles.nameContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'flext-start', height: 16}}>
                        <Text style={styles.name}>Task #Theme</Text>
                        <Text style={[styles.environment, {color: '#3FD1EB'}]}>
                            @Ambiente
                        </Text>
                    </View>
                    <Text style={styles.time}>User made the action - Date Hour</Text>
                </View>
                <Ionicons name="ios-more-outline" color={Colors.main} size={30} style={{position: 'absolute', right: 0, top: -10}} />
            </View>
        );
    }

    renderSectionTitle() {
        return (
            <View style={styles.subContainer}>
                <Text style={styles.Today}>Today</Text>
                <Text style={styles.taskButton}>+ NewTask</Text>
            </View>
        );
    }

    renderElements() {
        var arr = [0,1,2,3,4,5,6,7,8,9];

        return arr.map((obj, i) => {
            return <View>
                <View style={[styles.SingleTaskContainer, Shadow.cardShadow]}>
                    {this.renderCardTitle()}
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', position: 'relative', top: 85}}>
                        <Image source={require("../assets/images/icons/comment_filled_main.png")} 
                            style={{height: 12, width: 13, resizeMode: 'center'}} />
                    </View>
                </View>
                <View>
                    <ScrollView style={styles.TaskMediaContainer} showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.TaskMediaIcon}/>            
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>                                        
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.TaskMediaIcon}/>            
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>                                        
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"video-camera"} size={30} style={styles.TaskMediaIcon}/>            
                        </View>
                        <View style={[styles.TaskMedia, Shadow.smallCardShadow]}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>                                        
                        </View>
                    </ScrollView>
                </View>
            </View>
        });
    }

    render() {

        if (!this.state.isReady) {
            return <AppLoading />;
        }


        return (
            <ScrollView style={styles.mainContainer}>

                <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={"To Do List"} />
                    <NoOpModal featureName={"Survey"} ref={(noOpModal) => this._noOpSurveyInFilter = noOpModal} />
                    <NoOpModal featureName={"Post"} ref={(noOpModal) => this._noOpPosts = noOpModal} />
                </View>
                {this.renderSectionTitle()}
                {this.renderElements()}

            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({

    mainContainer:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#F7F7F7',
    },
    subContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 0,
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        width: width,
        height: 100
    },
    Today:{
        marginTop: 19,
        paddingBottom: 10,
        fontSize: 14,
        marginLeft: 20,
        color:'#9a9a9a',
        fontFamily: 'roboto-bolditalic'
    },

    taskButton:{ 
        position: 'absolute',
        right: 10,
        marginTop: 19,
        fontSize: 14,
        marginRight: 20,
        color: Colors.main,
        fontFamily: 'roboto-bold'
    },
    
    SingleTaskContainer:{
        marginLeft:10,
        marginRight:10,
        backgroundColor:'white',
        marginTop:10,
        height:160,
        borderRadius:20,
        padding:15,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    TaskMediaContainer:{
        flexDirection: 'row',
        position: 'absolute',
        top: -95,
        width: width,
        height: 100,
        zIndex: 9999
    },

    TaskMedia:{
        marginRight:7,
        backgroundColor:'white',
        height:65,
        width:65,
        borderRadius:10,
        padding:5,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'

    },
    TaskMediaIcon: {
        color:'#9E9E9E',
        opacity:0.5,
    },

    avatarContainer: {
        paddingBottom: 0,
        flexDirection: 'row',
    },

    nameContainer: {
        marginLeft: 8,
        marginTop: 3.20,
        justifyContent: 'flex-start',
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

    time: {
        color: '#999999',
        fontSize: 12,
        fontFamily: 'roboto-light',
        marginTop: 3
    },

    taskThumbnailContainer: {
        height: 38,
        width: 38,
        borderRadius: 4,
        borderColor: Colors.white,
        borderWidth: 2.5,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    taskThumbnail: {
        backgroundColor: 'transparent',
        height: 33,
        width: 33,
        borderRadius: 4
    },
    profile: {
        backgroundColor: 'transparent',
        height: 24,
        width: 24,
        borderRadius: 12,
    },
    avatarPhotoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'absolute',
        top: 15,
        left: 15,
        height: 28,
        width: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.white
    },
}
);
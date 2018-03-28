/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    ScrollView,
    ListView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Button
} from 'react-native';

const {width, height} = Dimensions.get('window');

import {Font, AppLoading} from 'expo';

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import ButtonBar from './common/button-bar';
import OnYourMind from './common/onYourMind';
import NewsFeedItem from './common/newsfeed-item';
import TaskFeedItem from './common/taskfeed-item';
import CreatePost from './common/create-post';
import CreateTask from './common/create-task'; 
import FilterBar from './common/filter-bar';
import NoOpModal from './common/NoOpModal';

import _ from 'lodash';
import Shadow from '../constants/Shadow';
import AppSettings, { getProfile } from './helpers/index';
import ApplicationConfig from './helpers/appconfig';

const filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
    {title: 'Survey', active: true, disabled: true}, 
    {title: 'Post', active: true, disabled: true}, 
    {title: 'Task', selected: true, active: true},
    {title: '#San Valentino', active: true, selected: true}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Landing extends Component {
    data = [];
    
    constructor(props) {
        super(props);

        this.state = {
            modalPost: false,
            modalTask: false,
            refreshing: false,
            loading: false,
            opacity: new Animated.Value(1),
            header_height: new Animated.Value(96),
            isReady: false,
            isAnimatingSearchBar: false,
            pageindex: 0,
            posts: []
        };

        filters[0].onType = (query) => {this._clearPosts(); this._loadPosts(query);};

        this.offsetY = 0;
        this.offsetX = new Animated.Value(0);
        this.content_height = 0;
        this._onScroll = this._onScroll.bind(this);
        this.loadMore = _.debounce(this.loadMore, 300);
    }

    componentDidMount() {
        this.loadFonts(() => {setTimeout(() => {this.measureView()}, 0)});

        for (i in filters) {
            if (filters[i].title == 'Survey') {
                filters[i].onPress = () => this._noOpSurveyInFilter.toggleState();
            }

            if (filters[i].title == 'Post') {
                filters[i].onPress = () => this._noOpPosts.toggleState();
            }
        }

        ApplicationConfig.getInstance().tabNavigator = this.props.navigator;
        setTimeout(() => this.loadMore(), 300);
    }

    async loadFonts(onLoaded) {
        await Font.loadAsync({
            'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
            'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
            'roboto': require('../assets/fonts/Roboto-Regular.ttf'),
            'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf')
        });

        this.setState({isReady: true});
        onLoaded();
    }
 
    measureView() { 
        this.refs.view.measure((a, b, w, h, px, py) => { 
            this.content_height = h; 
        }); 
    } 

    _clearPosts() {
        this.setState({posts: []});
        this.data = [];
    }

    async _loadPosts(query) {

        var addQuery = query != undefined ? '&q=' + query : '';
        var length = 0;


        console.log("loading posts..." + 'https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/posts/getposts?pagesize=100&pageindex=' + this.state.pageindex + '&iduser=' + ApplicationConfig.getInstance().me.id + addQuery);

        try {
            let result = await fetch('https://o1voetkqb3.execute-api.eu-central-1.amazonaws.com/dev/posts/getposts?pagesize=1&pageindex=' + this.state.pageindex + '&iduser=' + ApplicationConfig.getInstance().me.id + addQuery);
            let responseJson = await result.json();
            responseJson = JSON.parse(responseJson);
            responseJson.forEach(element => {
                getProfile(element.idauthor, (responseJson) => {
                    element.profile = JSON.parse(responseJson);
                    this.data.push(element);
                    this.setState({posts: this.data})
                });
            });

            length = responseJson.length;

            this.data.map((o,i) => {
                if (o.idcommentPost != undefined && o.idcommentPost != null) {
                    this.data.map((parent,i) => {
                        if (parent.id == o.idcommentPost) {
                            if (parent.comments == undefined) {
                                parent.comments = [];
                            }

                            parent.comments.push(o);
                        }
                    });

                    this.data[i] = undefined;
                }
            });

            this.setState({pageindex: this.state.posts.length, refreshing: false});

        } catch(error) {
            console.error(error);
        }
    }

    _onRefresh() {
        this.setState({refreshing: true, pageindex: 0});
        this._clearPosts();
        this._loadPosts();
    }

    newPostHandler(obj) {
        if (obj != undefined && obj.reload) {
            this._clearPosts();
            this._loadPosts();
        }

        this.setState({modalPost: false});
    }

    newTaskHandler(obj) {
        if (obj != undefined && obj.reload) {
            this._clearPosts()
            this._loadPosts();
        }

        this.setState({modalTask: false});
    }

    _handleTypeChange(t) {
        if (t == 'post') {
            this.setState({
                modalTask: false,
                modalPost: true
            });
        } else if (t == 'task') {
            this.setState({
                modalPost: false,
                modalTask: true,
            });
        }
    }

    renderModal() {
        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalPost}
                    onRequestClose={() => this.setState({modalPost: false})}>
                    <CreatePost closeModal={(obj) => this.newPostHandler(obj)} navigator={this.props.navigator} 
                        handleTypeChange={(t) => this._handleTypeChange(t)}/>
                </Modal>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalTask}
                    onRequestClose={() => this.setState({modalTask: false})}>
                    <CreateTask closeModal={(obj) => this.newTaskHandler(obj)} 
                        handleTypeChange={(t) => this._handleTypeChange(t)}/>
                </Modal>
            </View>
        )
    }

    loadMore() {
        this.setState({
            loading: true
        });
        
        this._loadPosts();
    }

    _onScroll(event) {
        const e = event.nativeEvent;
        const l_height = e.contentSize.height;
        const offset = e.contentOffset.y;

        if (!this.state.isAnimatingSearchBar) {
            if(offset >= this.offsetY) {
                if(offset - this.offsetY > 30) { 
                    this.setState({isAnimatingSearchBar: true});

                    setTimeout(() => {
                        ApplicationConfig.getInstance().index.hideSearchBar();
                        this.setState({isAnimatingSearchBar: false})},
                    150); 
                } 
            } else if (offset + this.content_height != l_height) { 
                this.setState({isAnimatingSearchBar: true});
                setTimeout(() => {
                    ApplicationConfig.getInstance().index.showSearchBar(); 
                    this.setState({isAnimatingSearchBar: false})},
                150);
            }
        }

        this.offsetY = offset;
        if(offset + this.content_height + 100 >= l_height) {
            this.loadMore();
        }
    }

    getStyle() {
        return {
            opacity: this.offsetX.interpolate({
                inputRange: [0, width * 4/5],
                outputRange: [1, 0],
            }),
        }
    }

    renderFiltersAndNewPost() {
        return (
            <View>
                <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={"My Wall"} />
                    <NoOpModal featureName={"Survey"} ref={(noOpModal) => this._noOpSurveyInFilter = noOpModal} />
                    <NoOpModal featureName={"Post"} ref={(noOpModal) => this._noOpPosts = noOpModal} />
                </View>
                <View style={[styles.onYourMindContainer, Shadow.cardShadow]}>
                    <OnYourMind onFocus={() => this.setState({modalPost: true})}/>
                    <ButtonBar ref='buttonBar' buttons={[
                        {title: 'Task', onPress: () => this.setState({modalTask: true})}, 
                        {title: 'Post', onPress: () => this.setState({modalPost: true})},
                        {title: 'Survey', onPress: () => this._noOpSurvey.toggleState(), noOp: true}]}/>
                    <NoOpModal featureName={"Survey"} ref={(noOpModal) => this._noOpSurvey = noOpModal} />
                </View>
            </View>);
    }

    renderElements() {
        return this.state.posts.map((o,i) => {
            return (<View key={i}>
                <NewsFeedItem data={o}/>
            </View>);
        })
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />
        }
        
        return (
            <View ref='view' style={styles.container}>
                <ScrollView style={{flex: 1}}
                    onScroll={this._onScroll}
                    style={styles.listView}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />}>
                    {this.renderFiltersAndNewPost()}
                    {this.renderElements()}
                </ScrollView>
                {this.renderModal()}
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
        backgroundColor: "#f7f7f7"
    },
    fade: {
        height,
        backgroundColor: 'black',
        width: width * 4/5,
    },
    onYourMindContainer: {
        marginTop: 6,
        marginBottom: 6,
        marginRight: 5,
        marginLeft: 5,
        padding: 0,
        borderRadius: 14,
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        width: width,
        height: 100
    }
})
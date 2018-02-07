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
    Button
} from 'react-native';

import Drawer from 'react-native-drawer'

const {width, height} = Dimensions.get('window');

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import ButtonBar from './common/button-bar';
import OnYourMind from './common/onYourMind';
import NewsFeedItem from './common/newsfeed-item';
import CreatePost from './common/create-post';
import CreateTask from './common/create-task'; 
import FilterBar from './common/filter-bar';
import BlueMenu from './common/blue-menu';


import _ from 'lodash';
import Shadow from '../constants/Shadow';
import { getProfile } from './helpers/index';

//1 is regular post, 2 is image
const data = ['0', '1'];

const filters = [{type: 'search', searchPlaceHolder: 'Store, Cluster, Task, Post, Survey, etc.'},
    {title: 'All', selected: true, active: true}, 
    {title: 'Post', active: true}, 
    {title: 'Task', active: true},
    {title: 'Survey', active: true}];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Landing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalPost: false,
            modalTask: false,
            refreshing: false,
            loading: false,
            opacity: new Animated.Value(1),
            header_height: new Animated.Value(96),
            dataSource: ds.cloneWithRows(data),
            take: 20,
            skip: 0
        };

        filters[0].onType = (query) => {this._clearPosts(); this._loadPosts(query);};

        this._loadPosts();

        this.offsetY = 0;
        this.offsetX = new Animated.Value(0);
        this.content_height = 0;
        this._onScroll = this._onScroll.bind(this);
        this.loadMore = _.debounce(this.loadMore, 300);
        this._onDrawerOpen = this._onDrawerOpen.bind(this);
    }

    closeControlPanel = () => {
        this._drawer.close()
    };
      openControlPanel = () => {
        this._drawer.open()
    };

    toggleMenu = () => {
        if(this._drawer.props.open){
            this._drawer.close()
        }else{
            this._drawer.open()
        }


    };

    _clearPosts() {
        this.setState({dataSource: ds.cloneWithRows(['0', '1'])});
    }

    _loadPosts(query) {

        var addQuery = query != undefined ? '&q=' + query : '';

        return fetch(settings.baseApi + '/posts?keep=' + this.state.keep + '&take=' + this.state.take + addQuery)
            .then((response) => response.json())
            .then((responseJson) => {
                responseJson.forEach(element => {
                    getProfile(element.creator, (responseJson) => {
                        element.profile = responseJson;
                        data.push(element);
                        this.setState({dataSource: ds.cloneWithRows(data)});
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _clearTasks() {
        this.setState({dataSource: ds.cloneWithRows(['0', '1'])});
    }

    _loadTasks(query) {

        var addQuery = query != undefined ? '&q=' + query : '';

        return fetch(settings.baseApi + '/posts?keep=' + this.state.keep + '&take=' + this.state.take + addQuery)
            .then((response) => response.json())
            .then((responseJson) => {
                responseJson.forEach(element => {
                    data.push(element);
                });

                this.setState({dataSource: ds.cloneWithRows(data)});
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        setTimeout(() => {this.measureView()}, 0);
    }

    measureView() {
        this.refs.view.measure((a, b, w, h, px, py) => {
            this.content_height = h;
        });
    }

    _onRefresh() {
        this.setState({refreshing: true});
        setTimeout(() => {
            this.setState({refreshing: false});
        }, 1500)
    }

    _renderRow(data) {

        if (data == '0') {
            return <View style={styles.filterBarContainer}>
                    <FilterBar data={filters} headTitle={"My Wall"} />
                </View>;
        } else if (data == '1') {
            return (
                <View style={[styles.onYourMindContainer, Shadow.cardShadow]}>
                    <OnYourMind onFocus={() => this.setState({modalPost: true})}/>
                    <ButtonBar ref='buttonBar' buttons={[
                        {title: 'Task', onPress: () => this.setState({modalTask: true})}, 
                        {title: 'Post', onPress: () => this.setState({modalPost: true})},
                        {title: 'Survey'}]}/>
                </View>
            )
        }

        return <NewsFeedItem data={data}/>
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
            this._clearTasks();
            this._loadTasks();
        }

        this.setState({modalTask: false});
    }

    renderModal() {
        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalPost}
                    onRequestClose={() => this.setState({modalPost: false})}>
                    <CreatePost closeModal={(obj) => this.newPostHandler(obj)} navigator={this.props.navigator}/>
                </Modal>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalTask}
                    onRequestClose={() => this.setState({modalTask: false})}>
                    <CreateTask closeModal={(obj) => this.newTaskHandler(obj)} />
                </Modal>
            </View>
        )
    }

    loadMore() {
        this.setState({loading: true});

        this.setState({
            skip: this.state.skip + this.state.keep
        });
        
        this._loadPosts();
    }

    _onScroll(event) {
        const e = event.nativeEvent;
        const l_height = e.contentSize.height;
        const offset = e.contentOffset.y;

        if(offset > this.offsetY) {
            if(!(offset < 100)) {
                this.refs.searchBar.hide()
            }
        } else {
            this.refs.searchBar.show()
            //setTimeout(() => {this.refs.searchBar.show();}, 150);

        }

        this.offsetY = offset;


        if(offset + this.content_height + 60 >= l_height) {
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

    renderFade() {
        return (
            <Animated.View style={[styles.fade, this.getStyle()]}>
            </Animated.View>
        )
    }

    renderDrawer() {
        return (
            <Drawer/>
        )
    }

    _onDrawerOpen(event) {
        const e = event.nativeEvent;
        const offset = e.contentOffset.x;
        this.offsetX.setValue(offset);
    }

    openMenu() {
        this.offsetX.setValue(offset);
    }

    render() {
        return (
            <Drawer
                type="static"
                ref={(ref) => this._drawer = ref}
                content={<BlueMenu/>}
                openDrawerOffset={100}
                styles={drawerStyles}
                tweenHandler={Drawer.tweenPresets.parallax}
                side="right"
                >
                    <View style={{flex: 1}}>
                        <View ref='view' style={styles.container}>
                            <SearchBar ref='searchBar' openMenu={this.toggleMenu.bind(this)}/>
                            
                            <ListView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />
                                }
                                style={styles.listView}
                                onScroll={this._onScroll}
                                dataSource={this.state.dataSource}
                                renderRow={(data) => this._renderRow(data)}
                            />
                        </View>
                        {this.renderModal()}

                    </View>
            </Drawer>
            

        )
    }
}

const drawerStyles = {
    drawer: { shadowColor: Colors.main, shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 0},
  }

const styles= StyleSheet.create({
    container: {
        
        flex: 1,
        width,
        height,
        backgroundColor: "#f7f7f7",
    },
    fade: {
        height,
        backgroundColor: 'black',
        width: width * 4/5,
    },
    drawer: {
        height,
        padding: 8,
        paddingTop: 20,
        width: width * 4/5,
        position: 'absolute',
        backgroundColor: Colors.chat_bg,
        right: 0
    },
    listView: {
        //paddingLeft: (width - (width * 4/5)) / 2
    },
    onYourMindContainer: {
        //height: 110,
        marginTop: 6,
        marginBottom: 6,
        marginRight: 5,
        marginLeft: 5,
        padding: 0,
        borderRadius: 14,
    },
    filterBarContainer: {
        backgroundColor: Colors.white,
        width: width
    }
})
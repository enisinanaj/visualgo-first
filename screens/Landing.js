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

const {width, height} = Dimensions.get('window');

import Colors from '../constants/Colors';
import SearchBar from './common/search-bar';
import ButtonBar from './common/button-bar';
import OnYourMind from './common/onYourMind';
import NewsFeedItem from './common/newsfeed-item';
import CreatePost from './common/create-post';
import CardView from 'react-native-cardview'

import {EvilIcons} from '@expo/vector-icons';

import Drawer from './common/drawer';
import _ from 'lodash';

//1 is regular post, 2 is image
const data = ['0', '1',
    {type: 'image', images: ['1']},
    {type: 'image', images: ['1', '2']},
    {type: 'image', images: ['1', '2', '3']},
    {type: 'image', images: ['1', '2', '3', '4']},
    {type: 'image', images: ['1', '2', '3', '4', '5']},
    {type: 'image', images: ['1', '2', '3', '4', '5', '6']},
    {type: 'post'},
    {type: 'post'},
    {type: 'post'}
    ];

const filters = ['0', 'Survey', 'Post', 'Task'];
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Landing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            refreshing: false,
            loading: false,
            opacity: new Animated.Value(1),
            header_height: new Animated.Value(96),

            dataSource: ds.cloneWithRows(data),
            filtersSource: ds.cloneWithRows(filters)
        };

        this.offsetY = 0;
        this.offsetX = new Animated.Value(0);
        this.content_height = 0;
        this._onScroll = this._onScroll.bind(this);
        this.loadMore = _.debounce(this.loadMore, 300);
        this._onDrawerOpen = this._onDrawerOpen.bind(this);
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
            return (
                <ListView
                    horizontal={true}
                    style={styles.filtersListView}
                    dataSource={this.state.filtersSource}
                    renderRow={(data) => this.renderFilterBar(data)}/>
            )
        } else if (data == '1') {
            return (
                <CardView 
                    cardElevation={3}
                    cardMaxElevation={3}
                    cornerRadius={12} style={styles.onYourMind}>
                    <View>
                        <OnYourMind onFocus={() => this.setState({modal: true})}/>
                        <ButtonBar ref='buttonBar'/>
                    </View>
                </CardView>
            )
        }

        return (<View style={styles.newsFeedArea}>
                <NewsFeedItem data={data}/>
            </View>);
    }

    renderFilterBar(data) {
        if (data == 0) {
            return (
                <CardView 
                    cardElevation={3}
                    cardMaxElevation={3}
                    cornerRadius={22} style={styles.filterButtonItem}>
                    <TouchableOpacity>
                        <EvilIcons name={"search"} size={22} color={Colors.main}/>
                    </TouchableOpacity>
                </CardView>
            )
        }

        return (
            <CardView 
                    cardElevation={3}
                    cardMaxElevation={3}
                    cornerRadius={22} style={styles.filterButtons}>
                <View>
                    <Button title={data} style={styles.filterButton}/>
                </View>
            </CardView>
        )
    }

    renderModal() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modal}
                onRequestClose={() => this.setState({modal: false})}
            >
                <CreatePost closeModal={() => this.setState({modal: false})} />
            </Modal>
        )
    }

    loadMore() {
        console.log('should load more');
        this.setState({loading: true});
        //add two more child views
        data.push('1');
        data.push('1');
        this.setState({dataSource: ds.cloneWithRows(data)});

    }

    _onScroll(event) {
        const e = event.nativeEvent;
        const l_height = e.contentSize.height;
        const offset = e.contentOffset.y;

        if(offset > this.offsetY) {
            console.log('scrolling down');

            if(!(offset < 56)) {
                this.refs.searchBar.hide();
            }

            //if
        } else {
            console.log('scrolling up');
            setTimeout(() => {this.refs.searchBar.show();}, 150);

        }

        this.offsetY = offset;


        if(offset + this.content_height >= l_height) {
            console.log('end');
            this.loadMore();
        }

        // console.log(e);
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

    openChat() {
        this.refs.scrollview.scrollTo({x: width * 4/5, y: 0, animated: true});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.renderDrawer()}
                <ScrollView
                    ref='scrollview'
                    horizontal={true}
                    pagingEnabled={true}
                    bounces={false}
                    onScroll={this._onDrawerOpen}
                    scrollEventThrottle={100}
                    showsHorizontalScrollIndicator={false}
                >

                    <View ref='view' style={styles.container}>
                        <SearchBar ref='searchBar' openChat={this.openChat.bind(this)}/>
                        
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
                    {this.renderFade()}
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
        backgroundColor: "#f4f4f4"
    },
    fade: {
        height,
        backgroundColor: 'black',
        width: width * 4/5,
    },
    drawer: {
        height,
        padding: 15,
        paddingTop: 20,
        width: width,
        position: 'absolute',
        backgroundColor: Colors.chat_bg,
        right: 0
    },
    filtersListView: {
        flex: 1,
        height: 65,
        paddingTop: 10,
        width: width * 4.9/5
    },
    listView: {
        paddingLeft: (width - (width * 4.9/5)) / 2,
        width: width
    },
    filterButtonItem: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 30,
        padding: 17,
        paddingTop: 15,
        height: 44,
        color: Colors.main,
        marginLeft: (width - (width * 4.9/5)) / 2,
        marginRight: 4
    },
    filterButtons: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 17,
        paddingTop: 5,
        height: 44,
        color: Colors.main,
        marginRight: 4,
        marginLeft: (width - (width * 4.9/5)) / 2
    }, 
    filterButton: {
        padding: 0,
        margin: 0,
        color: Colors.main
    },

    newsFeedArea: {
        marginTop: 15
    },

    onYourMind: {
        backgroundColor: Colors.white,
        height: 110,
        marginRight: 5
    }
})
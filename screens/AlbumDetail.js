import React from 'react';
import { StyleSheet, video,ListView, ScrollView,
        FlatList, Platform, Image, 
        backgroundColor, Text, 
        Dimensions, StatusBar,
        View, Button, TouchableHighlight, 
        TextInput, TouchableOpacity, Alert,} from 'react-native';
import {Ionicons, Entypo, EvilIcons} from '@expo/vector-icons';
import { NavigatorIOS, WebView} from 'react-native';

import {Font, AppLoading} from 'expo';
import Colors from '../constants/Colors';
import DefaultRow from './common/default-row';

var {width, height} = Dimensions.get("window");

export default class AlbumDetail extends React.Component {

    constructor() {
        super();

        this.state = {
            isReady: false
        };
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            'roboto-thin': require('../assets/fonts/Roboto-Thin.ttf'),
            'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf'),
            'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
            'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
            'roboto-bold-italic': require('../assets/fonts/Roboto-BoldItalic.ttf')
        });

        this.setState({isReady: true});
    }

    goBack() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        }

        return (
            <View>
                <StatusBar barStyle="light-content" backgroundColor={Colors.main}/>
                {Platform.OS === 'ios' ? 
                    <View style={{width: width, height: 20, backgroundColor: Colors.main}}></View>
                : null}
                <View style={{flexDirection: 'row', height: 48, alignItems: 'center', paddingLeft: 0,
                        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray}}>
                    <View style={{flex:1}}>
                        <Image style={{flex: 1, height: 48, width: width, 
                                        position:'absolute', resizeMode: 'center', top: -12, left: 0, opacity: 0.1}} 
                                        source={{uri:'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3067979-poster-p-1-clothes-shopping-sucks-reformations-new-store-totally-reimagines-the.jpg'}} />
                        <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'space-between', width: width}}>
                            <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 4, paddingTop: 5}}>
                                <TouchableOpacity onPress={() => this.goBack()}>
                                    <EvilIcons name={"close"} size={22} color={Colors.main}/>
                                </TouchableOpacity>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 16, marginLeft: 5}}>
                                    <Text style={styles.name}>Guideline #Theme</Text>
                                    <Text style={[styles.environment, {color: '#FC9D9D'}]}> @Ambiente</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5, marginRight: 20}}>
                                <Text style={[styles.name, {fontFamily: 'roboto-bold', color: Colors.main, fontSize: 16 }]}>Add +</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ScrollView style={{backgroundColor: Colors.white, paddingBottom: 80}} >
                    <View style={styles.userName}>
                        <Image style={styles.profilepic} 
                                source={{uri: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'}}
                                />
                        <View style={styles.UserNameView}>
                            <Text style={styles.userNameTextStyle1}>Jane Smith</Text>
                            <Text style={styles.userNameTextStyle2}>Date hour</Text>
                        </View>
                    </View>

                    <View style={styles.bigTextbox}>
                        <Text style={styles.bigTextFontStyle}>
                            The element is special relative to layout: everything inside is no longer using the flexbox layout but using text layout. This means that elements inside of are no longer rectangles, but wrap when they see the end of the line.
                        </Text>
                    </View>

                    <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                        borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                        <TouchableOpacity 
                            style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={[styles.rowTextStyle, {color: Colors.black}, {marginTop: 4}]}>
                                Condiviso con 10 utenti
                            </Text>
                            <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                                <EvilIcons name={"chevron-right"} color={Colors.main} size={32} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                        borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                        <TouchableOpacity 
                            style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={[styles.rowTextStyle, {color: Colors.black}, {marginTop: 4}]}>
                                Add contributor
                            </Text>
                            <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                                <EvilIcons name={"chevron-right"} color={Colors.main} size={32} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', height: 44, alignItems: 'center', paddingLeft: 16,
                        borderTopColor: Colors.borderGray, borderTopWidth: StyleSheet.hairlineWidth}}>
                        <TouchableOpacity 
                            style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={[styles.rowTextStyle, {color: Colors.black}, {marginTop: 4}]}>
                                Upload Attachements
                            </Text>
                            <View style={{flexDirection: 'row', width: 40, marginRight: 0, justifyContent: 'flex-end', marginRight: 10}}>
                                <Text style={{fontFamily: 'roboto-regular', fontSize: 16, marginTop: 3}}>(6) </Text>
                                <Ionicons  style={styles.forwardIcon} name={"ios-attach"} size={25} color={Colors.main}/>
                                <EvilIcons name={"chevron-right"} color={Colors.main} size={32} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <View style={styles.QuickViewContainer}>
                            <Text style={styles.QuickViewText}>Quick View</Text>
                        </View>
                        <ScrollView horizontal={true} style={styles.QuickViewContainer}>
                            <View style={styles.imageViewContainer}>
                                <View >
                                    <Image style={styles.imageStyle} source={{uri: 'http://www.spoleto7giorni.it/wp-content/uploads/2017/12/shopping-spoleto.jpg'}}></Image>
                                </View>
                                <View >
                                    <Image style={styles.imageStyle} source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBeBZe06UHmZ5381MpAWPDcFXms7dyA04KTevlNvIhCXxV3zV'}}></Image>
                            
                                </View>
                                <View >
                                    <Image style={styles.imageStyle} source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBeBZe06UHmZ5381MpAWPDcFXms7dyA04KTevlNvIhCXxV3zV'}}></Image>
                            
                                </View>
                                <View >
                                    <Image style={styles.imageStyle} source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBeBZe06UHmZ5381MpAWPDcFXms7dyA04KTevlNvIhCXxV3zV'}}></Image>
                            
                                </View> 
                            </View>
                        </ScrollView>
                    </View>

                    <View>
                        <View style={styles.QuickViewContainer}>
                            <Text style={styles.QuickViewText}>All Files</Text>
                        </View>

                        <DefaultRow>
                            <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                    <Image style={styles.menuThumbNail} 
                                        source={{uri: 'http://www.iconhot.com/icon/png/file-icons-vs-2/256/png-36.png'}}/>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <Text style={[styles.rowTextStyle, {color: Colors.black, textAlignVertical: 'center', height: 'auto'}]}>
                                            Nome File.pdf
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'column', width: 30, marginRight: 0, justifyContent: 'center'}}>
                                    <EvilIcons name={"close"} color={Colors.main} size={24} />
                                </View>
                            </TouchableOpacity>
                        </DefaultRow>

                        <DefaultRow>
                            <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                    <Image style={styles.menuThumbNail} 
                                        source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}/>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <Text style={[styles.rowTextStyle, {color: Colors.black, textAlignVertical: 'center', height: 'auto'}]}>
                                            Nome File.pdf
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'column', width: 30, marginRight: 0, justifyContent: 'center'}}>
                                    <EvilIcons name={"close"} color={Colors.main} size={24} />
                                </View>
                            </TouchableOpacity>
                        </DefaultRow>

                        <DefaultRow>
                            <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                    <Image style={styles.menuThumbNail} 
                                        source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}/>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <Text style={[styles.rowTextStyle, {color: Colors.black, textAlignVertical: 'center', height: 'auto'}]}>
                                            Nome File.pdf
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'column', width: 30, marginRight: 0, justifyContent: 'center'}}>
                                    <EvilIcons name={"close"} color={Colors.main} size={24} />
                                </View>
                            </TouchableOpacity>
                        </DefaultRow>

                        <DefaultRow style={{margin: 0}} noborder={true}>
                            <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                    <Image style={styles.menuThumbNail} 
                                        source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}/>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <Text style={[styles.rowTextStyle, {color: Colors.black, textAlignVertical: 'center', height: 'auto'}]}>
                                            Nome File.pdf
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'column', width: 30, marginRight: 0, justifyContent: 'center'}}>
                                    <EvilIcons name={"close"} color={Colors.main} size={24} />
                                </View>
                            </TouchableOpacity>
                        </DefaultRow>
                    </View>
                    <View style={{ height: 300 }}>
                        <WebView
                                style={ styles.WebViewContainer }
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                source={{uri: 'https://www.youtube.com/embed/gnKzljwIMdM'}}
                        />
                    </View>
                    <View>
                        <Image style={styles.bigImageContainer} source={{uri: 'http://www.urdesignmag.com/wordpress/wp-content/uploads/2015/01/3-gilles-boissier-designed-a-moncler-boutique-dedicated-entirely-to-men.jpg'}}/>
                    </View>
                    <View>
                        <DefaultRow>
                            <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <Text style={[styles.rowTextStyle, {color: Colors.main, textAlignVertical: 'center', height: 'auto'}]}>
                                            Archivia Album
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </DefaultRow>

                        <DefaultRow>
                            <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <Text style={[styles.rowTextStyle, {color: '#E64E17', textAlignVertical: 'center', height: 'auto'}]}>
                                            Elimina Album
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </DefaultRow>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({

headerContainer:{    
        
    paddingRight:5,
    borderBottomWidth:1,
    borderColor:'#F8F9F9',
    marginLeft:10,
    marginTop:10,
    flex: 1, 
    flexDirection: 'row',
    },

    name: {
        fontFamily: 'roboto-bold',
        fontSize: 14
    },

    rowTextStyle: {
        fontFamily: 'roboto-light',
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 5,
        paddingTop: 0
    },

WebViewContainer: {
 
    width:'100%',
    height:300,
    marginTop:0,
},

guideLineView:{
    padding:5,
},
    
QuickViewContainer:{
    
    backgroundColor:'#F2F4F4',
    paddingBottom:10,

},

bigImageContainer:{

    width:'100%',
    height:300,


},
QuickViewText:{
    color:'#999999',
    fontSize:12,
    fontFamily: 'roboto-bold-italic',
    marginLeft:15,
    marginTop:10,
    
},

imageViewContainer:{
    flexDirection:'row',

},
imageStyle:{
    
    width: 130, 
    height: 200,
    borderRadius:15,
    marginLeft:20,
    marginTop:10,
    
},

menuThumbNail:{
    width: 40, 
    height: 40,
    borderRadius:5,
    marginRight:10,
    backgroundColor: 'transparent'
},

profilepic:{
    width:38,
    height:38,
    borderRadius:19,
    marginTop:10,
},
menuThumbNailContainer:{
    flexDirection:'row',
    justifyContent: 'space-between',
    height:50,
    borderBottomWidth:1,
    borderColor:'#E5E7E9',
    paddingTop:10,
    marginRight:20,
    
},
Textbox:{

    paddingTop:8,
},

addButton:{
        justifyContent:'flex-end',
        flex: 1, 
        flexDirection: 'row',
        marginTop:5,
    },
    
addButtonStyle:{ 
        
        right: 5,
        fontSize:15,
        marginRight:10,
        color:'blue',
        fontWeight: 'bold'
    },
    
    
TaskTag:{
        fontSize:15,
        fontWeight:'bold',
        color:'pink',
      },
    
bigTextbox:{
    padding:20,
    paddingTop: 10,
    borderColor: Colors.black,
    borderBottomColor: Colors.borderGray,
    borderBottomWidth: StyleSheet.hairlineWidth
},

bigTextFontStyle: {
    fontFamily: 'roboto-light',
    fontSize: 16
},

miniMenuView:{
    flexDirection:'column',
},

miniMenuSingle:{
    flexDirection:'row',
    justifyContent: 'space-between',
    height:50,
    borderBottomWidth:1,
    borderColor:'#E5E7E9',
    paddingTop:20,
    paddingLeft:20,
    paddingRight:20,
    
},

UploadView:{
    flexDirection:'row',
    justifyContent:'flex-end',
    borderColor:'#E5E7E9',
    padding:5,
    marginLeft:20,
   
},

UploadIcons:{
    marginLeft:10,
},

userName:{
    flex: 1, 
    flexDirection: 'row',
    marginTop:5,
    marginLeft:20,
    padding:5,
},

UserNameView:{
    padding:5,
    marginTop: 8,
    marginLeft: 10
},

userNameTextStyle1:{
    fontSize:16,
    fontFamily: 'roboto-light',
    color:'black',
},
userNameTextStyle2:{
    marginTop: 4,
    fontSize:12,
    fontFamily: 'roboto-light',
    color: '#999999'
},

textStyle:{
    fontSize:15,
    fontWeight:'bold',
    color:'black',
  },
});
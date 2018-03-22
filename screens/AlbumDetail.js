import React from 'react';
import { StyleSheet, video,ListView, ScrollView,
        FlatList, Platform, fontWeight, Image, 
        backgroundColor, Text, fontFamily, 
        fontSize, View, Button, TouchableHighlight, 
        TextInput, TouchableOpacity, Alert,} from 'react-native';
import {Ionicons, Entypo, EvilIcons} from '@expo/vector-icons';
import { NavigatorIOS, WebView} from 'react-native';

import {Font, AppLoading} from 'expo';
import Colors from '../constants/Colors';


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
            'roboto-light': require('../assets/fonts/Roboto-Light.ttf')
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
            <ScrollView style={{backgroundColor: Colors.white}} >
                <View style={styles.headerContainer}> 
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.guideLineView} onPress={() => this.goBack()}>
                            <Ionicons name={"md-close"} size={20} color={"blue"}/>
                        </TouchableOpacity>
                        <View style={styles.guideLineView}>
                            <Text style={styles.textStyle}>Guideline #Theme</Text>
                        </View>
                        <View style={styles.guideLineView}>
                            <Text style={styles.TaskTag}>@Ambiente</Text>
                        </View>
                        <View style={styles.addButton}>
                        <TouchableOpacity>
                            <Text style={styles.addButtonStyle} >Add+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

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
                    <Text>The element is special relative to layout: everything inside is no longer using the flexbox layout but using text layout. This means that elements inside of are no longer rectangles, but wrap when they see the end of the line.
                    </Text>
                </View>

                <View style={styles.miniMenuView}>
                    <View style={styles.miniMenuSingle}>
                        <Text>Diviso con 10 Utenti   </Text>
                        <TouchableOpacity>
                            <Ionicons  style={styles.forwardIcon} name={"ios-arrow-forward"} size={20} color={"blue"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.miniMenuSingle}>
                        <Text>Add contributor          </Text>
                        <TouchableOpacity>
                            <Ionicons  style={styles.forwardIcon} name={"ios-arrow-forward"} size={20} color={"blue"}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.miniMenuSingle}>
                        <Text>Upload Attachements</Text>
                        <View style={styles.UploadView}>
                            <Text>(6) </Text>
                        <View style={styles.UploadIcons}>
                        <TouchableOpacity>
                                <Ionicons  style={styles.forwardIcon} name={"ios-attach"} size={25} color={"blue"}/>
                            </TouchableOpacity>
                            </View>
                            <View style={styles.UploadIcons}>
                            <TouchableOpacity>
                                <Ionicons  style={styles.forwardIcon} name={"ios-arrow-forward"} size={20} color={"blue"}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
                <View style={styles.miniMenuView}>
                <Text style={styles.QuickViewText}>All Files</Text>
                    <View style={styles.menuThumbNailContainer}>
                        <View style={styles.UploadView}>
                            <Image style={styles.menuThumbNail} 
                            source={{uri: 'http://www.iconhot.com/icon/png/file-icons-vs-2/256/png-36.png'}}
                            />
                            <Text  style={styles.Textbox}>Nome File.pff</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name={"md-close"} size={20} color={"blue"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.menuThumbNailContainer}>
                        
                        <View style={styles.UploadView}>
                            <Image style={styles.menuThumbNail} 
                            source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                            />
                            <Text  style={styles.Textbox}>Nome File.altro</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name={"md-close"} size={20} color={"blue"}/>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={styles.menuThumbNailContainer}>
                        
                            <View style={styles.UploadView}>
                                <Image style={styles.menuThumbNail} 
                                source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                                />
                                <Text style={styles.Textbox}>Nome File.jpg</Text>
                            </View>
                            <TouchableOpacity>
                                <Ionicons name={"md-close"} size={20} color={"blue"}/>
                            </TouchableOpacity>
                        
                    </View>
                    <View style={styles.menuThumbNailContainer}>
                        
                        <View style={styles.UploadView}>
                            <Image style={styles.menuThumbNail} 
                            source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                            />
                            <Text  style={styles.Textbox} >Nome File.altro</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name={"md-close"} size={20} color={"blue"}/>
                        </TouchableOpacity>
                        
                    </View>
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
                <View style={styles.miniMenuView}>
                    <View style={styles.miniMenuSingle}>
                        <TouchableOpacity>
                        <Text style={{color: 'blue'}}>Archiva Album</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.miniMenuSingle}>
                        <TouchableOpacity>
                        <Text style={{color: 'red'}}>Elimina Album</Text>
                        </TouchableOpacity>
                    </View>
                </View>                
        </ScrollView>



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

WebViewContainer: {
 
    width:'100%',
    height:300,
    marginTop:10,
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
    color:'#BDC3C7',
    fontSize:15,
    marginLeft:20,
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
    width: 30, 
    height: 30,
    borderRadius:5,
    marginRight:10,

},

profilepic:{
    width:45,
    height:45,
    borderRadius:20,
    marginTop:5,
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
        borderBottomWidth:1,
        borderColor:'#F8F9F9',
        
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
},

userNameTextStyle1:{
    fontSize:20,
    fontWeight:'bold',
    color:'black',
},
userNameTextStyle2:{
    fontSize:15,
    fontWeight:'bold',
    color:'pink',
},

textStyle:{
    fontSize:15,
    fontWeight:'bold',
    color:'black',
  },
});
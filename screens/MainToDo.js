import React from 'react';
import { StyleSheet, FlatList, Platform, fontWeight, 
    Image, backgroundColor, Text, fontFamily, fontSize, View, 
    Button, TouchableHighlight, TextInput, TouchableOpacity, 
    Alert, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { NavigatorIOS, } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';


export default class MainToDo extends React.Component {
    render() {
        return (
        
    
    <ScrollView style={styles.mainContainer}>
    
        <View style={styles.subContainer}>

            <Text style={styles.Today}>Today</Text>
            <Text style={styles.taskButton}>+ NewTask</Text>

        </View>

        <View>
     
            <View style={styles.SingleTaskContainer}>

                <View style={styles.TaskContainerText}>
                    <Text style={styles.TaskTheme}>Task#Theme </Text>
                    <Text style={styles.TaskTag}>@Ambiente</Text>
                    <Ionicons name={"ios-more-outline"} size={30} style={styles.ThreeDotsIcon}/>

                </View>

            <View>
                <Text style={styles.TaskSubText}>Usermade the action - Date Hour </Text>
            </View>

            <View style={styles.TaskMediaContainer}>
                <View style={styles.TaskMedia}>
                            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>
                            
                    </View>
                        
                    <View style={styles.TaskMedia}>
                    <Entypo name={"video-camera"} size={30} style={styles.TaskMediaIcon}/>
                                    
                    </View>
                
                    <View style={styles.TaskMedia}>
                    <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>
                                                                
                    </View>
            </View>

         </View>

            
        </View>

        <View>
     
     <View style={styles.SingleTaskContainer}>

         <View style={styles.TaskContainerText}>
             <Text style={styles.TaskTheme}>Task#Theme </Text>
             <Text style={styles.TaskTag}>@Ambiente</Text>
             <Ionicons name={"ios-more-outline"} size={30} style={styles.ThreeDotsIcon}/>

         </View>

     <View>
         <Text style={styles.TaskSubText}>Usermade the action - Date Hour </Text>
     </View>

     <View style={styles.TaskMediaContainer}>
         <View style={styles.TaskMedia}>
                     <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>
                     
             </View>
                 
             <View style={styles.TaskMedia}>
             <Entypo name={"video-camera"} size={30} style={styles.TaskMediaIcon}/>
                             
             </View>
         
             <View style={styles.TaskMedia}>
             <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>
                                                         
             </View>
     </View>

  </View>

     
 </View>

 <View>
     
     <View style={styles.SingleTaskContainer}>

         <View style={styles.TaskContainerText}>
             <Text style={styles.TaskTheme}>Task#Theme </Text>
             <Text style={styles.TaskTag}>@Ambiente</Text>
             <Ionicons name={"ios-more-outline"} size={30} style={styles.ThreeDotsIcon}/>

         </View>

     <View>
         <Text style={styles.TaskSubText}>Usermade the action - Date Hour </Text>
     </View>

     <View style={styles.TaskMediaContainer}>
        <View style={styles.TaskMedia}>
            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>     
        </View>
            
        <View style={styles.TaskMedia}>
            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>             
        </View>
    
        <View style={styles.TaskMedia}>
            <Entypo name={"image-inverted"} size={30} style={styles.TaskMediaIcon}/>             
        </View>
     </View>

  </View>

     
 </View>

    </ScrollView>
    

         ); }
}


const styles = StyleSheet.create({

    mainContainer:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#F8F9F9',
    },



    subContainer: {
      flexDirection: 'row',
      marginTop: 5,
      borderBottomWidth: 1,
      borderColor: '#F4F6F6',
      paddingBottom: 10,
      //backgroundColor:'#FDEDEC',
     
     
      
    },

    Today:{
        marginTop:30,
        paddingBottom: 10,
        fontSize:20,
        marginLeft:25,
        color:'#616161',
        fontWeight: 'bold'
        
        
    },

    taskButton:{ 
        
        position: 'absolute',
        right: 10,
        marginTop:30,
        fontSize:20,
        marginRight:20,
        color:'#0000FF',
        fontWeight: 'bold'
    },
    
    SingleTaskContainer:{
        marginLeft:15,
        marginRight:5,
        backgroundColor:'white',
        marginTop:7,
        height:180,
        width:350,
        borderRadius:20,
        padding:15,

    },

    TaskHeader:{
        flex: 1,
        flexDirection: 'row',},

    ImageTask:{
        //flexDirection:'row',
        width: 50,
        height: 50,
        borderRadius:10,
    },

    TaskContainerText:{

        flexDirection: 'row',
    },

    TaskTheme:{

        fontSize:15,
        fontWeight:'bold',
        color:'black',
        
    },
    TaskTag:{
        fontSize:15,
        fontWeight:'bold',
        color:'#26C6DA',

    },
    ThreeDotsIcon: {
        position: 'absolute',
        right: 5,
        marginTop: -5,
        color:'blue', 
    },

    TaskSubText:{
        
        fontSize:13,
        fontWeight:'200',
        color:'#9E9E9E',
        marginLeft:4,
        
    },
    TaskMediaContainer:{
        flexDirection: 'row',

    },

    TaskMedia:{
       
        marginLeft:15,
        marginRight:5,
        backgroundColor:'white',
        marginTop:10,
        height:80,
        width:90,
        borderRadius:20,
        padding:5,
        shadowColor: '#9E9E9E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 1,
        alignItems: 'center',
        padding:20,

    },
    TaskMediaIcon: {
        color:'#9E9E9E',
        opacity:0.5,

    },
}
);
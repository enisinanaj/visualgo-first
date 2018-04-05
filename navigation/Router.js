// import {
//     createRouter,
// } from '@expo/ex-navigation';

import Landing from '../screens/Landing';
import LinksScreen from '../screens/LinksScreen';
import ImageScreen from '../screens/imageScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Chat from '../screens/Chat';
import RootNavigation from './RootNavigation';
import ConversationView from '../screens/Conversation';
import NewGroup from '../screens/NewGroup'
import Login from '../screens/Login'
import ImagePost from '../screens/common/image-post';
import MainCalendar from '../screens/MainCalendar';
import VisualGuidelines from '../screens/VisualGuidelines';
import MainTodo from '../screens/MainToDo';
import AlbumDetail from '../screens/AlbumDetail';
import CollabView from '../screens/CollabView';

export const mainRouter = {
    getStateForAction: (action, state) => ({}),
    getActionForPathAndParams: (path, params) => null,
    getPathAndParamsForState: (state) => null,
    getComponentForState: (state) => null,
    getComponentForRouteName: (routeName) => {
        switch(routeName) {
            case 'landing':
                return Landing;
                break;
            case 'images':
                return ImageScreen;
                break;
            case 'links':
                return LinksScreen;
                break;
            case 'settings':
                return SettingsScreen;
                break;
            case 'chat':
                return Chat;
                break;
            case 'mainCalendar':
                return MainCalendar;
                break;
            case 'rootNavigation':
                return RootNavigation;
                break;
            case 'conversation':
                return ConversationView;
                break;
            case 'newGroup':
                return NewGroup;
                break;
            case 'login':
                return Login;
                break;
            case 'imagePost':
                return ImagePost;
                break;
            case 'visualGuidelines':
                return VisualGuidelines;
                break;
            case 'mainTodo':
                return MainTodo;
                break;
            case 'albumDetail':
                return AlbumDetail;
                break;
            case 'collabView':
                return CollabVie;
                break;
        }
    },
};


// export default createRouter(() => ({
//     landing: () => Landing,
//     images: () => ImageScreen,
//     links: () => LinksScreen,
//     settings: () => SettingsScreen,
//     chat: () => Chat,
//     mainCalendar: () => MainCalendar,
//     rootNavigation: () => RootNavigation,
//     conversation: () => ConversationView,
//     newGroup: () => NewGroup,
//     login: () => Login,
//     imagePost: () => ImagePost,
//     visualGuidelines: () => VisualGuidelines,
//     mainTodo: () => MainTodo,
//     albumDetail: () => AlbumDetail,
//     collabView: () => CollabView
// }));

import {
    createRouter,
} from '@expo/ex-navigation';

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


export default createRouter(() => ({
    landing: () => Landing,
    images: () => ImageScreen,
    links: () => LinksScreen,
    settings: () => SettingsScreen,
    chat: () => Chat,
    mainCalendar: () => MainCalendar,
    rootNavigation: () => RootNavigation,
    conversation: () => ConversationView,
    newGroup: () => NewGroup,
    login: () => Login,
    imagePost: () => ImagePost,
    visualGuidelines: () => VisualGuidelines,
    mainTodo: () => MainTodo,
    albumDetail: () => AlbumDetail
}));

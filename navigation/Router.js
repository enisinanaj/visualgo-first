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
import ReactPubNub from '../screens/PubNubChat';
import NewGroup from '../screens/NewGroup'
import Camera from '../screens/Camera'


export default createRouter(() => ({
    landing: () => Landing,
    images: () => ImageScreen,
    links: () => LinksScreen,
    settings: () => SettingsScreen,
    chat: () => Chat,
    rootNavigation: () => RootNavigation,
    conversation: () => ConversationView,
    openCamera: () => Camera,
    newGroup: () => NewGroup,
}));

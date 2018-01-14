import {
    createRouter,
} from '@expo/ex-navigation';

import Landing from '../screens/Landing';
import LinksScreen from '../screens/LinksScreen';
import ImageScreen from '../screens/imageScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Chat from '../screens/Chat';
import RootNavigation from './RootNavigation';


export default createRouter(() => ({
    landing: () => Landing,
    images: () => ImageScreen,
    links: () => LinksScreen,
    settings: () => SettingsScreen,
    chat: () => Chat,
    rootNavigation: () => RootNavigation,
}));

/**
 * Created by ggoma on 12/17/16.
 */
const profile = [
    {
        source: require('../img/dp2.jpg'),
        name: 'Marco',
        online: false,
    },
    {
        source: require('../img/dp1.jpg'),
        name: 'Jennifer',
        online: true,
    },
    {
        source: require('../img/elmo.jpg'),
        name: 'Christina',
        online: false,
    }
];

const images = {
    '1': require('../img/shopping1.jpg'),
    '2': require('../img/shopping2.jpg'),
    '3': require('../img/shopping3.jpg'),
    '4': require('../img/shopping4.jpg')
}

export const MenuIcons = {
    BACHECA_IMAGE: require('../../assets/images/icons/bacheca.png'),
    CHAT_IMAGE: require('../../assets/images/icons/chat.png'),
    CALENDAR_IMAGE: require('../../assets/images/icons/calendar.png'),
    NOTIFICATION_IMAGE: require('../../assets/images/icons/notification.png'),
    ALBUM_IMAGE: require('../../assets/images/icons/album.png'),
    BACHECA_W_IMAGE: require('../../assets/images/icons/bacheca_white.png'),
    CHAT_W_IMAGE: require('../../assets/images/icons/chat_white.png'),
    CALENDAR_W_IMAGE: require('../../assets/images/icons/calendar_white.png'),
    NOTIFICATION_W_IMAGE: require('../../assets/images/icons/notifications_white.png'),
    ALBUM_W_IMAGE: require('../../assets/images/icons/album_white.png'),
    REPORT_W_IMAGE: require('../../assets/images/icons/report_white.png'),
    REPORT_MENU_DISABLED: require('../../assets/images/icons/ReportDisabled.png'),
    CALENDAR_MENU_DISABLED: require('../../assets/images/icons/CalendarDisabled.png'),
    MESSAGES_MENU_DISABLED: require('../../assets/images/icons/MessagesDisabled.png'),
    DELETE_TASK: require('../../assets/images/icons/delete-task.png'),
    EDIT_TASK: require('../../assets/images/icons/edit-task.png'),
    ARCHIVE_TASK: require('../../assets/images/icons/archive-task.png'),
    THUMB_UP: require('../../assets/images/icons/thumb-up.png'),
    THUMB_DOWN: require('../../assets/images/icons/thumb-down.png'),
    HISTORY: require('../../assets/images/icons/history.png'),
    ALERT: require('../../assets/images/icons/alert.png'),
    COMMENT: require('../../assets/images/icons/comment-outline.png'),
    USER_SHARE: require('../../assets/images/icons/user-share.png'),
}

export default settings = {
    baseApi: 'http://crpbddyxugpgmqhgx-mock.stoplight-proxy.io/v1'
}

export class AppConfig {
    static params = {};

    static storeKeyValue(key, value) {
        this.params[key] = value;
    }

    static getValue(key) {
        return this.params[key];
    }
}

export function getProfile(profileId, getData) {
    return fetch(settings.baseApi + '/users?userId=' + profileId)
    .then((response) => response.json())
    .then((responseJson) => getData(responseJson))
    .catch((error) => {
        console.error(error);
    });
}

export function randomProfile() {
    var random = Math.floor((Math.random() * profile.length));
    return profile[random];
}

export function getImage(index) {
    return images[index];
}
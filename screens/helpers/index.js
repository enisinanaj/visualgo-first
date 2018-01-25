/**
 * Created by ggoma on 12/17/16.
 */
const profile = [
    {
        source: require('../img/bob.png'),
        name: 'Bob the Builder',
        online: false,
    },
    {
        source: require('../img/cookiemonster.jpeg'),
        name: 'Cookie Monster',
        online: true,
    },
    {
        source: require('../img/elmo.jpg'),
        name: 'Elmo',
        online: false,
    }
];

const images = {
    '1': require('../img/1.jpg'),
    '2': require('../img/2.jpg'),
    '3': require('../img/3.jpg'),
    '4': require('../img/4.jpg'),
    '5': require('../img/5.jpg')
}

export default settings = {
    baseApi: 'http://crpbddyxugpgmqhgx-mock.stoplight-proxy.io/v1'
}

export function getProfile(profileId) {
    var result = "";
    return fetch(settings.baseApi + '/users?userId=null') // + profileId)
        .then((response) => response.json())
        .then((responseJson) => {
            retusul = responseJson;
        })
        .catch((error) => {
            console.error(error);
        });

    return result;
}

export function randomProfile() {
    var random = Math.floor((Math.random() * profile.length));

    return profile[random];
}

export function getImage(index) {
    return images[index];
}
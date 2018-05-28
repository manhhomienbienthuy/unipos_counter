import Config from './Config';

const Utils = {
    getUserId() {
        const url = window.location.href;
        const matches = url.match(Config.USER_ID_REGEX);
        return matches && matches[1];
    },

    getToken() {
        return window.localStorage.getItem('authnToken');
    },

    removeElement(element) {
        element && element.parentNode.removeChild(element);
    },
};

export default Utils;

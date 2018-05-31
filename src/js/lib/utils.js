import {USER_ID_REGEX} from './config';

export function getUserId() {
    const url = window.location.href;
    const matches = url.match(USER_ID_REGEX);
    return matches && matches[1];
}

export function getToken() {
    return window.localStorage.getItem('authnToken');
}

export function removeElement(element) {
    element && element.parentNode.removeChild(element);
}

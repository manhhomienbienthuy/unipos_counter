import {getUserId, removeElement} from './lib/utils';
import {counter} from './lib/unipos_counter';

let currentUserId = null;
let isLoading = false;

async function callback() {
    const newUserId = getUserId();
    if (!newUserId) {
        removeElement(document.getElementById('counter'));
        currentUserId = null;
        return;
    }

    if (isLoading || currentUserId === newUserId) {
        return;
    }

    isLoading = true;

    removeElement(document.getElementById('counter'));
    await counter();
    currentUserId = newUserId;

    isLoading = false;
}

const observer = new MutationObserver(callback);
const config = {
    childList: true,
    subtree: true,
};
observer.observe(document.body, config);

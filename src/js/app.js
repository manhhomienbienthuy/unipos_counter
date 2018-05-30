import Utils from './lib/Utils';
import UniposCounter from './lib/UniposCounter';

let currentUserId = undefined;
let isLoading = false;

async function callback() {
    const newUserId = Utils.getUserId();
    if (!newUserId) {
        Utils.removeElement(document.getElementById('counter'));
        return;
    }

    if (isLoading || currentUserId === newUserId) {
        return;
    }

    isLoading = true;

    Utils.removeElement(document.getElementById('counter'));
    const counter = new UniposCounter();
    await counter.count();
    currentUserId = newUserId;

    isLoading = false;
}

const observer = new MutationObserver(callback);
const config = {
    childList: true,
    subtree: true,
};
observer.observe(document.body, config);

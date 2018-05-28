import MutationObserver from 'mutation-observer';
import Utils from './lib/Utils';
import UniposCounter from './lib/UniposCounter';

let currentUserId = undefined;
let isLoading = false;

async function callback() {
    const newUserId = Utils.getUserId();
    if (!newUserId) {
        const counterDiv = document.getElementById('counter');
        Utils.removeElement(counterDiv);
        return;
    }

    if (!isLoading) {
        if (!currentUserId || currentUserId !== newUserId) {
            isLoading = true;

            const counterDiv = document.getElementById('counter');
            Utils.removeElement(counterDiv);
            const counter = new UniposCounter();
            await counter.count();
            currentUserId = newUserId;

            isLoading = false;
        }
    }
}

const observer = new MutationObserver(callback);
const config = {
    childList: true,
    subtree: true,
};
observer.observe(document.getElementById('js_body'), config);

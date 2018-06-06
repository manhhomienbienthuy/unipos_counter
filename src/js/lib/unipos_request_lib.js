import {getUserId, getToken} from './utils';
import {MAX_REQUEST_RESULT, API_URL} from './config';

function _getRequestData(type = 'received', offset = '') {
    const memberId = getUserId();
    const params = {
        'offset_card_id': offset,
        'count': MAX_REQUEST_RESULT,
    };
    switch(type) {
        case 'received':
            params['to_member_id'] = memberId;
            break;
        case 'sent':
            params['from_member_id'] = memberId;
            break;
        case 'clapped':
            params['praised_member_id'] = memberId;
            break;
        default:
            break;
    }

    return {
        jsonrpc: '2.0',
        method: 'Unipos.GetCards2',
        id: 'Unipos.GetCards2',
        params: params,
    };
}

async function _makeRequest(data) {
    const postData = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'x-unipos-token': getToken(),
        },
        cache: 'no-cache',
        body: JSON.stringify(data),
    };
    const handler = await fetch(API_URL, postData);
    const response = await handler.json();
    return response.result;
}

async function _doRequest(type = 'received') {
    let result = [];
    let offset = '';
    let req;

    do {
        const data = _getRequestData(type, offset);
        req = await _makeRequest(data);
        if (!req || !req.length) {
            break;
        }
        result = result.concat(req);
        offset = req[req.length - 1].id;
    } while (req.length < MAX_REQUEST_RESULT);

    return result;
}

export async function received() {
    return _doRequest('received');
}

export async function sent() {
    return _doRequest('sent');
}

export async function clapped() {
    return _doRequest('clapped');
}

export async function getClappedPoint(clappedCards) {
    const memberId = getUserId();
    const result = await Promise.all(clappedCards.map(async val => {
        const params = {id: val.id};
        const data = {
            jsonrpc: '2.0',
            method: 'Unipos.GetCard2',
            id: 'Unipos.GetCard2',
            params: params,
        };
        const handler = await _makeRequest(data);
        return handler.praises.find(el => el.member.id === memberId).count;
    }));

    return result.reduce((val, el) => val + el, 0);
}

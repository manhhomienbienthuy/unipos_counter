import Config from './Config';
import Utils from './Utils';

const UniposRequestLib = {
    received() {
        return this._doRequest('received');
    },

    sent() {
        return this._doRequest('sent');
    },

    clapped() {
        return this._doRequest('clapped');
    },

    async _doRequest(type = 'received') {
        let result = [];
        let offset = '';
        let req;

        do {
            const data = this._getRequestData(type, offset);
            req = await this._makeRequest(data);
            if (!req || !req.length) {
                break;
            }
            result = result.concat(req);
            offset = req[req.length - 1].id;
        } while (req.length < Config.MAX_REQUEST_RESULT);

        return result;
    },

    async _makeRequest(data) {
        const postData = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-unipos-token': Utils.getToken(),
            },
            cache: 'no-cache',
            body: JSON.stringify(data),
        };
        const handler = await fetch(Config.API_URL, postData);
        const response = await handler.json();
        return response.result;
    },

    _getRequestData(type = 'received', offset = '') {
        const memberId = Utils.getUserId();
        const params = {
            'offset_card_id': offset,
            'count': Config.MAX_REQUEST_RESULT,
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
            'jsonrpc': '2.0',
            'method': 'Unipos.GetCards2',
            'id': 'Unipos.GetCards2',
            'params': params,
        };
    },
};

export default UniposRequestLib;

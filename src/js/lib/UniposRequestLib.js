import Config from './Config';
import Utils from './Utils';

const UniposRequestLib = {
    async received() {
        return this._doRequest('received');
    },

    async sent() {
        return this._doRequest('sent');
    },

    async clapped() {
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

    _makeRequest(data) {
        return new Promise((resolve, reject) => {
            const token = Utils.getToken();
            const xhr = new XMLHttpRequest();
            xhr.open('POST', Config.API_URL);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('x-unipos-token', token);
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.response).result);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                    });
                }
            };
            xhr.onerror = () => {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                });
            };

            xhr.send(JSON.stringify(data));
        });
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

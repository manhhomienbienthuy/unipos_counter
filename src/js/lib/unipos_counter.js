import {received, sent, clapped} from './unipos_request_lib';

function _calc(value) {
    const result = {received: 0, sent: 0, clapped: 0};
    const [receivedCards, sentCards, clappedCards] = value;

    receivedCards.forEach(val => {
        result.received += val.point;
        result.received += val.praise_count;
    });

    sentCards.forEach(val => {
        result.received += val.praise_count;
        result.sent += val.point;
    });

    clappedCards.forEach(val => {
        result.clapped += val.praise_count * 2;
        result.sent += val.praise_count * 2;
    });

    return result;
}

function _display(result) {
    let template = `
        <div class="stats received">
            <span class="highlight">${result.received}</span>
            <h6>received</h6>
        </div>
        <div class="stats sent">
            <span class="highlight">${result.sent}</span>
            <h6>sent</h6>
        </div>
        <div class="stats clapped">
            <span class="highlight">${result.clapped}</span>
            <h6>clapped</h6>
        </div>
        <style>
            #counter {
                position: absolute;
                top: 200px;
                right: 10px;
                width: 300px;
                text-align: center;
            }

            #counter .stats {
                float: left;
                width: 33.33%;

            }

            #counter .highlight {
                font-size: 30px;
                font-weight: 700;
            }


            #counter .received {
                color: #1e73be;
            }
            #counter .sent {
                color: #be1eb9;
            }
            #counter .clapped {
                color: #00f3ff;
            }

            #counter h6 {
                margin: 0;
                font-size: 14px;
                font-weight: normal;
                color: #4a4a4a;
            }
        </style>`;

    const counterDiv = document.createElement('div');
    counterDiv.setAttribute('id', 'counter');
    counterDiv.innerHTML = template;
    document.body.appendChild(counterDiv);
}

export async function counter() {
    const value = await Promise.all([
        received(),
        sent(),
        clapped(),
    ]);
    const result = _calc(value);
    _display(result);
}

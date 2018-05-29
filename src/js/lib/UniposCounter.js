import UniposRequestLib from './UniposRequestLib';

export default class UniposCounter {
    constructor() {
        this.totalReceivedPoint = 0;
        this.totalSentPoint = 0;
        this.totalClappedPoint = 0;
    }

    async count() {
        const value = await Promise.all([
            UniposRequestLib.received(),
            UniposRequestLib.sent(),
            UniposRequestLib.clapped(),
        ]);
        this._calc(value);
        this._display();
    }

    _calc(value) {
        const receivedCards = value[0];
        const sentCards = value[1];
        const clappedCards = value[2];

        receivedCards.forEach(value => {
            this.totalReceivedPoint += value.point;
            this.totalReceivedPoint += value.praise_count;
        });

        sentCards.forEach(value => {
            this.totalReceivedPoint += value.praise_count;
            this.totalSentPoint += value.point;
        });

        clappedCards.forEach(value => {
            this.totalClappedPoint += value.praise_count * 2;
            this.totalSentPoint += value.praise_count * 2;
        });
    }

    _display() {
        let template = `
            <h1>Counter</h1>
            <table>
                <tr>
                    <td>Received</td>
                    <td>${this.totalReceivedPoint}</td>
                </tr>
                <tr>
                    <td>Sent</td>
                    <td>${this.totalSentPoint}</td>
                </tr>
                <tr>
                    <td>Clapped</td>
                    <td>${this.totalClappedPoint}</td>
                </tr>
            </table>`;

        const counterDiv = document.createElement('div');
        counterDiv.setAttribute('id', 'counter');
        counterDiv.innerHTML = template;
        const jsBody = document.getElementById('js_body');
        jsBody && jsBody.appendChild(counterDiv);
    }
}

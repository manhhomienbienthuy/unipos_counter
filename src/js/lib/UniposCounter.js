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
            <div class="stats received">
                <span class="highlight">${this.totalReceivedPoint}</span>
                <h6>received</h6>
            </div>
            <div class="stats sent">
                <span class="highlight">${this.totalSentPoint}</span>
                <h6>sent</h6>
            </div>
            <div class="stats clapped">
                <span class="highlight">${this.totalClappedPoint}</span>
                <h6>clapped</h6>
            </div>`;

        const counterDiv = document.createElement('div');
        counterDiv.setAttribute('id', 'counter');
        counterDiv.innerHTML = template;
        document.body.appendChild(counterDiv);
    }
}

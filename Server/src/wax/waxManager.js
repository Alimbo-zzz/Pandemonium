const { Api, JsonRpc } = require('eosjs');
const fetch = require('node-fetch');
const waxjs = require('@waxio/waxjs/dist');
const rpc = new JsonRpc('https://api.waxsweden.org/', { fetch });

// const CardSchema = require('../models/CardSchema.js');
// const UserSchema = require('../models/UserSchema.js');
class waxManager {
    constructor(waxName, collection_name, url) {
        this.waxName = waxName;
        this.collection_name = collection_name;
        this.url = url || null;
    }
    async getCards() {
        let body = {
            waxName: this.waxName,
            collection_name: this.collection_name,
        };
        const response = await fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body),
        });
        return await response.json();
    }
    async processCards() {
        const filter = { waxName: this.waxName };
        this.getCards()
            .then((res) => {
                // console.log(res.data);
                return res.data;
            })
            .then(async (cardsArr) => {
                const cardHexArr = [];
                for (let el of cardsArr) {
                    let cardHex = el.asset_id;
                    let cardName = el.name;
                    let cardPicture = el.data.img;
                    let cardRarity = el.data.rarity;
                    const newDbCard = new CardSchema({
                        cardName,
                        cardPicture,
                        cardRarity,
                        cardHex,
                    });
                    cardHexArr.push(cardHex);
                    await newDbCard
                        .save()
                        .catch((error) => console.error('Failed saving info!'));
                }
                return await UserSchema.findOneAndUpdate(filter, {
                    $addToSet: { cards: { cardHexArr } },
                }).catch((err) => {
                    console.error('Error in updating user cards array');
                });
            });
    }
    async getWaxName() {
        console.log('looking in wax');
        let data = await rpc.get_table_rows({
            json: true, // Get the response as json
            code: 'pandemoniumw', // Contract that we target
            scope: 'pandemoniumw', // Account that owns the data
            table: 'nicknames', // Table name
            lower_bound: this.waxName,
            limit: 1, // Maximum number of rows that we want to get
            reverse: false, // Optional: Get reversed data
            show_payer: false, // Optional: Show ram payer
        });
        console.log(`ответ от вакс манагера ${typeof data.rows[0]}`);
        if (data.rows[0] === undefined) {
            return false;
        } else {
            console.log(data.rows[0].nickname);
            return data.rows[0].nickname;
        }
    }
}

module.exports = waxManager;
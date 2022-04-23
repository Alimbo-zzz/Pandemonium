const express = require('express');
const { userDatabase } = require('../../config/firebaseAdmin');

const { Api, JsonRpc } = require('eosjs');
const fetch = require('node-fetch');
const axios = require('axios')
const waxjs = require('@waxio/waxjs/dist');
const rpc = new JsonRpc('https://api.waxsweden.org/', { fetch });


async function login(req, res) {
    let flag = await userDatabase.doc(req.body.waxName).get()
    if (flag){
        return res.json(flag.data())
    }

    const user = {
        waxName: req.body.waxName,
        collection_name: req.body.collection_name,
        coins: 1000,
    }
    userDatabase.doc(user.waxName).set(user);
    return res.json(user)
}

async function getUser(req, res) {
    let user
    await userDatabase.where("waxName", "==", req.body.waxName).get()
        .then((docs) => {
            docs.forEach((doc) => {
                if (doc.data().waxName == req.body.waxName){
                    return user = doc.data()
                }
            })
        })
        return res.json(user)
}

async function getCards(waxName, collection_name) {
    // console.log(waxName, collection_name)
    let body = {
        owner: "hpd34.wam",
        collection_name: "pandemoniumw"
    }
    let test
    await fetch(
        "http://wax.api.atomicassets.io/atomicassets/v1/assets?" + new URLSearchParams({
        owner: waxName,
        collection_name: collection_name
        }),
        {
            method: 'GET',
            mode: 'cors',
            // cache: 'no-cache',
            // credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow',
            // referrerPolicy: 'no-referrer',
            // body: JSON.stringify(body),
        }
    )
        .then(async (response) => {
            test = await response.json()
        })

    // console.log(test)
    return test;
}

async function processCards(req, res) {
    let cardHexArr = []
    getCards(req.param('waxName'), req.param('collection_name'))
        .then((res) => {
            return res.data;
        })
        .then(async cardsArr => {
            for (let card of cardsArr) {
                // let card = {
                    // cardHex: data.asset_id,
                //     cardTemplateId:
                // }
                // let cardHex = data.asset_id;
                // let cardTemplate = data.template.template_id
                cardHexArr.push(card.template.template_id);
                console.log(card.template.template_id)
            }
            console.log('------MASSIVE')
            return res.send(cardHexArr)
        })
    // console.log(cardHexArr)
    // return res.send(cardHexArr)
}

async function changeCoins(req, res) {
    await userDatabase.where("waxName", "==", req.body.waxName).get()
        .then((docs) => {
            docs.forEach((doc) => {
                if (doc.data().waxName === req.body.waxName) {
                    return doc.ref.update({
                        coins: req.body.coins
                    })
                }
            })
        })
    return res.status(200).end()
}

module.exports = {
    login,
    getUser,
    changeCoins,
    getCards,
    processCards
}
import resource from 'resource-router-middleware';
import {Wallet} from "ethers";
import wallets from '../models/wallets'

export default ({config, db}) => resource({

    /** Property name to store preloaded entity on `request`. */
    id: 'wallet',

    /** For requests with an `privateKey`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[privateKey] = data`.
     */
    load(req, privateKey, callback) {
        const walletsResult = wallets.find(wallet => wallet.privateKey === privateKey),
            ethersResult = new Wallet(privateKey),
            wallet = walletsResult ? walletsResult : ethersResult,
            err = wallet ? null : {error: 'not found'};
        callback(err, wallet);
    },

    /** GET / - Create a new random wallet */
    index({params}, res) {
        // Generates a new Ethereum wallet and return and
        // object with the private
        // key and the public ETH address

        // create a random wallet using ethers
        const wallet = Wallet.createRandom();
        // store it in wallets models
        wallets.push(wallet);
        // check your console to get all created wallets
        console.log(wallets);
        res.json(wallet);
    },

    /** GET /:address */
    read({wallet}, res) {
        res.json(wallet);
    },

    /** PUT /:address */
    update({wallet, body}, res) {
        for (let key in body) {
            if (key !== 'id') {
                wallet[key] = body[key];
            }
        }
        res.sendStatus(204);
    },

    /** DELETE /:address */
    delete({wallet}, res) {
        wallets.splice(wallets.indexOf(wallet), 1);
        res.sendStatus(204);
    }
});

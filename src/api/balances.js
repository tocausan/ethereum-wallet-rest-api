import resource from 'resource-router-middleware';
import {Wallet, providers} from "ethers";

const getBalance = (wallet) => {
    const w = new Wallet(wallet.privateKey);
    w.provider = providers.getDefaultProvider();
    return w.getBalance();
};

export default ({config, db}) => resource({

    /** Property name to store preloaded entity on `request`. */
    id: 'balance',

    /** For requests with an `address`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[address] = data`.
     */
    load(req, address, callback) {
        providers.getDefaultProvider('ropsten')
            .getBalance(address)
            .then(balance => {
                const err = balance ? null : {error: 'not found'};
                callback(null, balance);
            })
            .catch(e => {
                callback(JSON.parse(e.responseText), null);
            })
    },

    /** GET /:address - get balance of a wallet */
    read({balance}, res) {
        // Get the balance of an ethereum address
        // toNumber() -> ether bug => toString() instead
        res.json({balance: balance.toString()});
    },

});

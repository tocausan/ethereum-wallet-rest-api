import resource from 'resource-router-middleware';
import {Wallet, providers} from "ethers";
import wallets from '../models/wallets'

const getBalance = (wallet) => {
    const w = new Wallet(wallet.privateKey);
    w.provider = providers.getDefaultProvider();
    return w.getBalance();
};

export default ({config, db}) => resource({

    /** Property name to store preloaded entity on `request`. */
    id: 'wallet',

    /** For requests with an `address`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[address] = data`.
     */
    load(req, address, callback) {
        let wallet = wallets.find(wallet => wallet.address === address),
            err = wallet ? null : {error: 'not found'};
        console.log(wallet);
        callback(err, wallet);
    },

    /** GET / - get wallet balance */
    index({params}, res) {
        const balancePromises = wallets.map(wallet => {
            return getBalance(wallet);
        });
        Promise.all(balancePromises)
            .then(balances => {
                const balance = balances.map(b => b.toNumber()).reduce((a, b) => a + b, 0);
                res.json({balance: balance});
            });
    },

    /** GET /:address - get balance of a wallet */
    read({wallet}, res) {
        // Get the balance of an ethereum address
        getBalance(wallet).then(balance => {
            res.json({balance: balance.toNumber()});
        });
    },

});

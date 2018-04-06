import resource from 'resource-router-middleware';
import {Wallet} from "ethers";

export default ({config, db}) => resource({

    /** Property name to store preloaded entity on `request`. */
    id: 'wallet',

    /** For requests with an `privateKey`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[privateKey] = data`.
     */
    load(req, privateKey, callback) {
        const wallet = new Wallet(privateKey),
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
        res.json(wallet);
    },

    /** GET /:address */
    read({wallet}, res) {
        res.json(wallet);
    }

});

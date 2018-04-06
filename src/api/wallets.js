import resource from 'resource-router-middleware';
import {Wallet} from "ethers";

export default ({config, db}) => resource({

    /** GET / - Create a new random wallet */
    index({params}, res) {
        // Generates a new Ethereum wallet and return and
        // object with the private
        // key and the public ETH address

        // create a random wallet using ethers
        const wallet = Wallet.createRandom();
        res.json(wallet);
    },

});

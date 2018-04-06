import resource from 'resource-router-middleware';
import * as _ from "lodash";
import {Wallet, providers, utils} from "ethers";
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

    /** POST / */
    create({body}, res) {
        // {privateKey, destination, amount} Creates a transaction to send ETH from one address to another.
        // It can receive 3 raw JSON params: privateKey of the source ETH address,
        // destination is the ETH destination address and amount the number of ETH to be send.

// curl -H "Content-Type: application/json" -X POST -d '{"privateKey":"0xde115d55d5a5a4c9c8c938acedd2c71e4bd7bacb4cd3489f90d88276cb051f56", "destination":"l", "amount":"kkl"}' http://localhost:8080/api/transaction

        if (!_.isNil(body) &&
            !_.isNil(body.privateKey) &&
            !_.isNil(body.destination) &&
            !_.isNil(body.amount)) {

            const wallet = new Wallet(body.privateKey);
            wallet.provider = providers.getDefaultProvider();

            const amount = utils.parseEther(body.amount),
                sendPromise = wallet.send(body.destination, amount);

            sendPromise.then((transactionHash)=> {
                console.log(transactionHash);
            });


            // These will query the network for appropriate values
            const options = {
                //gasLimit: 21000
                //gasPrice: utils.bigNumberify("20000000000")
            };

            const promiseSend = wallet.send(body.destination, amount, options);

            promiseSend.then(function(transaction) {
                console.log(transaction);
            });


       res.json({});

/*


            wallet.send(body.destination, amount)
                .then((transactionHash) => {
                    res.json(transactionHash);
                })
                .catch(e => {
                    res.json({error: e.responseText})
                });
                */
        } else {
            res.json({error: 'missing parameter'});
        }
    },

    /** GET /:address - get balance of a wallet */
    read({wallet}, res) {
        // Get the balance of an ethereum address
        getBalance(wallet).then(balance => {
            res.json({balance: balance.toNumber()});
        });
    }

});

import resource from 'resource-router-middleware';
import * as _ from "lodash";
import {Wallet, providers, utils} from "ethers";

export default ({config, db}) => resource({

    /** POST / */
    create({body}, res) {
        // {privateKey, destination, amount} Creates a transaction to send ETH from one address to another.
        // It can receive 3 raw JSON params: privateKey of the source ETH address,
        // destination is the ETH destination address and amount the number of ETH to be send.

        if (!_.isNil(body) &&
            !_.isNil(body.privateKey) &&
            !_.isNil(body.destination) &&
            !_.isNil(body.amount)) {

            const wallet = new Wallet(body.privateKey);
            wallet.provider = providers.getDefaultProvider('ropsten');

            const amount = utils.parseEther(body.amount);
            wallet.send(body.destination, amount)
                .then((transactionHash) => {
                    res.json(transactionHash);
                })
                .catch(e => {
                    res.json(JSON.parse(e.responseText).error);
                });
        } else {
            res.json({error: 'missing parameter'});
        }
    }

});

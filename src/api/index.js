import {version} from '../../package.json';
import {Router} from 'express';
import facets from './facets';

export default ({config, db}) => {
    let api = Router();

    // mount the facets resource
    api.use('/facets', facets({config, db}));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({version});
    });

    api.get('/createWallet', (req, res) => {
        // Generates a new Ethereum wallet and return and
        // object with the private
        // key and the public ETH address
        res.json({});
    });

    api.get('/getBalance/:param', (req, res) => {
        // Get the balance of an ethereum address
        res.json({version});
    });

    api.post('/transaction', (req, res) => {
        // {privateKey, destination, amount} Creates a transaction to send ETH from one address to another.
        // It can receive 3 raw JSON params: privateKey of the source ETH address,
        // destination is the ETH destination address and amount the number of ETH to be send.
        res.json({version});
    });

    return api;
}

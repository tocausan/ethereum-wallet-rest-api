import {version, name, description} from '../../package.json';
import {Router} from 'express';
import facets from './facets';
import wallets from './wallets';
import balances from './balances';
import transactions from './transactions';

export default ({config, db}) => {
    let api = Router();

    // mount the facets resource
    api.use('/facets', facets({config, db}));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({version, name, description});
    });

    // wallets ressources
    api.use('/createWallet', wallets({config, db}));

    // balances ressources
    api.use('/getBalance', balances({config, db}));

    // transactions ressources
    api.use('/transaction', transactions({config, db}));

    return api;
}

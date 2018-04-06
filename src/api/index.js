import {version, name, description} from '../../package.json';
import {Router} from 'express';
import wallets from './wallets';
import balances from './balances';
import transactions from './transactions';

export default ({config, db}) => {
    return Router()

        // api infos
        .get('/', (req, res) => {
            const routes = {
                routes: [
                    {path: '/', method: 'GET', description: 'Redirect to /api'},
                    {path: '/api', method: 'GET', description: 'Get API infos'},
                    {path: '/api/createWallet', method: 'GET', description: 'Create a random wallet'},
                    {path: '/api/getBalance/[address]', method: 'GET', description: 'Get wallet\'s address balance'},
                    {path: '/api/transaction', method: 'POST', description: 'Create a transaction, requires {privateKey, destination, amount}'}
                ]
            };
            res.json({version, name, description, routes});
        })

        // wallets ressources
        .use('/createWallet', wallets({config, db}))

        // balances ressources
        .use('/getBalance', balances({config, db}))

        // transactions ressources
        .use('/transaction', transactions({config, db}));
}

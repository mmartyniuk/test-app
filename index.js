import * as http from 'http';

import App from './src/server/App';

const port = 3002;

const server = http.createServer(App);

server.listen(port);

server.on('error', onError);

function onError(error) {
    console.log(error);
}
import * as http from "http";

import Server from "./src/server/Server";

const port = 3000;

const app = http.createServer(Server);

app.listen(port);

app.on("error", onError);

function onError(error) {
    console.log(error);
}
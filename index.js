const Server = require("./src/server.js");
const Client = require("./src/client.js");
const dgram = require("dgram");

//#region server
Server.init({ server: dgram.createSocket("udp4") });
//#endregion

//#region client
Client.init({ client: dgram.createSocket("udp4") });
//#endregion

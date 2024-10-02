const { PORT, HOST } = require("./apibase.js");
const fs = require("fs");

module.exports = class Server {
  #ouputStream;
  #server;

  constructor({ server }) {
    this.#server = server;
  }

  static init({ server }) {
    const udpServer = new Server({ server });
    udpServer.init();
  }

  init() {
    this.#ouputStream = fs.createWriteStream("./assets/ouput.csv");
    this.#server.on("listening", () => console.log("UDP Server listening!"));
    this.#server.on("message", (msg, rinfo) => {
      this.#ouputStream.write(msg);
    });
    this.#server.bind(PORT, HOST);
  }
};

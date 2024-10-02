const { Writable } = require("stream");
const { PORT, HOST } = require("./apibase.js");
const fs = require("fs");

module.exports = class Client {
  #MAX_BUFFER_SIZE = 2048;
  #filePath = "./assets/database.csv";
  #client;

  constructor({ client }) {
    this.#client = client;
  }

  static init({ client }) {
    const udpClient = new Client({ client });
    udpClient.init();
  }

  init() {
    this.#sendFile(this.#filePath);
  }

  #getElapsed() {
    const start = Date.now();

    return () => {
      const elapsed = ((Date.now() - start) / 1000).toFixed(2);
      console.log(`File sent - ${elapsed}s`);
    };
  }

  #sendFile(path) {
    const fileStream = this.#getFileStream(path);
    fileStream.pipe(this.#getWriteStream());
  }

  #getWriteStream() {
    const sendChunk = this.#sendChunk.bind(this);
    const getElapsed = this.#getElapsed.bind(this);
    return new Writable({
      construct(cb) {
        this.elapsed = getElapsed();
        cb();
      },
      write(chunk, encoding, cb) {
        sendChunk(chunk, cb);
      },
      final(cb) {
        this.elapsed();
        cb();
      },
    });
  }

  #sendChunk(chunk, cb) {
    this.#client.send(chunk, 0, chunk.length, PORT, HOST, (err) => {
      if (chunk.size == chunk) if (err) throw err;
      cb();
    });
  }

  #getFileStream(path) {
    return fs.createReadStream(path, { highWaterMark: this.#MAX_BUFFER_SIZE });
  }
};

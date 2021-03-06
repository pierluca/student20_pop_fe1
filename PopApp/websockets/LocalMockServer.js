/* eslint-disable */
const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

// https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/
// Spinning the http server and the websocket server.

/* ------------------------------------------
 *        --- DO NOT REVIEW IN PR ----
 * this file is temporary (testing purposes)
 * ------------------------------------------
 */

const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000 :)');

const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = {};

// This code generates unique user id for every user.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4() + s4()}-${s4()}`;
};

wsServer.on('request', (request) => {
  const userID = getUniqueID();
  console.log(`${new Date()} Received a new connection from origin ${request.origin}.`);

  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(clients)}`);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log('Received Message :) : ', message.utf8Data);

      let answers;
      let idx;
      const JSON_RPC_VERSION = '2.0';

      const general_answer_positive = {
        jsonrpc: JSON_RPC_VERSION,
        result: 0,
        id: JSON.parse(message.utf8Data).id,
      };

      const general_answer_negative = {
        jsonrpc: JSON_RPC_VERSION,
        error: {
          code: -Math.round(Math.random() * 4 + 1),
          description: 'dummy error from server',
        },
        id: JSON.parse(message.utf8Data).id,
      };

      answers = [{
        success: 'true',
        error: 'null',
      }, {
        success: 'false',
        error: '[test] I could not accept your request :( (from server LocalMockServer.js)',
      }];

      // const answers = [{type: "answer", msg: JSON.parse(message.utf8Data)}];
      // const answers = [{type: "answer", msg: message.utf8Data}];
      // answers = [JSON.parse(message.utf8Data)];

      answers = [general_answer_positive, general_answer_negative];
      answers = [general_answer_positive];

      idx = (Math.floor(Math.random() * (1000000))) % answers.length;
      // idx = 0;
      // idx = 1;

      // broadcasting message to all connected clients
      for (const key in clients) {
        clients[key].sendUTF(JSON.stringify(answers[idx]));
        console.log('sent Message to: ', clients[key]);
      }
    }
  });
});

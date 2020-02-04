const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const telegram = require("telegram-bot-api");
const APIkey = require("./api_key");

const api = new telegram({
  token: APIkey
});

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post("/", function(req, res) {
  const { message } = req.body;

  // app.post("/", function(req, res) {
  //   // console.log(req.body.crypto)
  //   let crypto = req.body.crypto;
  //   let fiat = req.body.fiat;
  //   let amount = req.body.amount;

  //   let options = {
  //     url: "https://apiv2.bitcoinaverage.com/convert/global",
  //     method: "GET",
  //     qs: {
  //       from: crypto,
  //       to: fiat,
  //       amount: amount
  //     }
  //   };

  //   request(options, function(error, response, body) {
  //     let data = JSON.parse(body);
  //     let price = data.price;
  //     console.log(price);

  //     let currentDate = data.time;

  //     res.write("<p> The current date is " + currentDate + "</p>");
  //     res.write(
  //       "<h1 align='center' style='margin:330px 500px;'>" +
  //         amount +
  //         " " +
  //         crypto +
  //         " is currently worth " +
  //         price +
  //         " " +
  //         fiat +
  //         " <h1>"
  //     );
  //     res.send();
  //   });
  // });

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

  if (!message || message.text.toLowerCase().indexOf("marco") < 0) {
    // In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
    return res.end();
  }

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  axios
    .post("https://api.telegram.org/bot" + api + "/sendMessage", {
      chat_id: message.chat.id,
      text: "Polo!!"
    })
    .then(response => {
      // We get here if the message was successfully posted
      console.log("Message posted");
      res.end("ok");
    })
    .catch(err => {
      // ...and here if it was not
      console.log("Error :", err);
      res.end("Error :" + err);
    });
});

// Finally, start our server
app.listen(PORT, function() {
  console.log("Telegram app listening on port", PORT);
});

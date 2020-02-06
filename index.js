const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const telegram = require("telegram-bot-api");
const APIkey = require("./api_key");
const cheerio = require("cheerio");

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

const getMovies = callback => {
  request("https://yts.mx/", (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const movies = [];
      const $ = cheerio.load(html);

      $(".popular-downloads").each((i, el) => {
        const title = $(el)
          .find("a")
          .text();
        const link = $(el)
          .find("a")
          .attr("href");
        movies.push({ title, link });
      });
      callback(movies);
    }
  });
};

// app.get("/", (req, res) => {
//   getMovies(movies => {
//     res.render("index", {});
//   });
// });

// setInterval(function() {
//   alert("Hello");
// }, 100000);

//This is the route the API will call
app.post("/", function(req, res) {
  const { message } = req.body;

  if (!message || message.text.toLowerCase().indexOf("movies") < 0) {
    // In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
    return res.end();
  }

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  axios
    .post("https://api.telegram.org/bot" + api + "/sendMessage", {
      chat_id: message.chat.id,
      text: title,
      link
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

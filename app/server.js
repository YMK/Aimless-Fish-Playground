const express = require('express');
const app = express();
const twitter = require('twitter');
const fs = require('fs');

const followers = [];

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
});

app.use(express.static('app'));
app.get('/twitter/followers', (req, res) => getTwitterFollowers().then(data => res.json(followers)));

const getTwitterFollowers = () => {
  return client.get("/users/show", {screen_name: "YaManicKill"})
    .then((data) => data.followers_count)
    .catch(err => {
      console.log(err);
      return;
    });
}

const updateTwitterFollowers = () => {
  console.log("Updating data");
  return getTwitterFollowers()
    .then((num) => {
      console.log(num);
      if (followers.length === 0 || followers.slice(-1)[0].num !== num) {
        followers.push({num, time: Date.now()});
      }
    })
    .then(writeFollowersToFile)
    .catch(err => {
      console.log(err);
      return;
    });
}

const writeFollowersToFile = () => {
  fs.writeFile("config/state.json", JSON.stringify(followers));
}

const getFollowersFromFile = () => {
  return new Promise((res, rej) => {
    fs.readFile("config/state.json", (err, data) => {
      if (!err) {
        followers.push(...JSON.parse(data));
        console.log(followers);
      }
      res();
    });
  });
}

getFollowersFromFile()
  .then(updateTwitterFollowers)
  .then(() => setInterval(updateTwitterFollowers, 60000));

app.listen(8081, () => console.log('Server started'));

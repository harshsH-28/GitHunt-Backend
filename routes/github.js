require("dotenv").config();
const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).send("API Working Perfectly");
});

router.get("/getNewAccessToken", async (req, res) => {
  console.log(process.env.ACCESS_TOKEN);
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`
  );
});

router.get("/tempcode", async (req, res) => {
  const { code } = req.query;
  const data = {};
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    code: `${code}`,
    client_secret: process.env.CLIENT_SECRET,
  }).toString();
  const baseUrl = `https://github.com/login/oauth/access_token?${params}`;
  const accessReponse = await axios.post(baseUrl, data, {
    headers: {
      Accept: "application/json",
    },
  });
  const accessToken = accessReponse.data.access_token;
  process.env.ACCESS_TOKEN = accessToken;
  console.log(process.env.ACCESS_TOKEN);
  res.status(200).send("New Token Generated");
});

router.get("/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const userInfo = await axios.get(`https://api.github.com/users/${user}`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    const {
      avatar_url,
      html_url,
      name,
      company,
      bio,
      twitter_username,
      location,
      repos_url,
    } = userInfo.data;
    const myuser = {
      name,
      bio,
      location,
      twitter_username,
      company,
      avatar_url,
      html_url,
    };
    let repos = await axios.get(repos_url, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    repos = repos.data;
    const userRepos = repos.map((obj) => {
      return {
        name: obj.name,
        desc: obj.description,
        languages: obj.language,
        url: obj.html_url,
      };
    });
    myuser.repos = userRepos;
    res.status(200).json(myuser);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "Not Found" });
  }
});

module.exports = router;

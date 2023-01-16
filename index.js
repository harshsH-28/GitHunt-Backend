require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use("/api", require("./routes/github"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

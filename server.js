const express = require("express");
const app = express();

app.use(express.static(__dirname));   // serves index.html, app.js, words.js, style.css, images, audio

app.listen(3000, "0.0.0.0", () => {
  console.log("Running on port 3000");
});
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const routes = require("./routes");
app.use(routes); // Use routes to handle API requests

app.use(express.static(path.join(__dirname, "..", "frontend"))); // Serve frontend files

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const server = app.listen(PORT, function () {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  exec(`open http://127.0.0.1:${PORT}/`); // Opens URL in default browser
});

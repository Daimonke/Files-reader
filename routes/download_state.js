const express = require("express");
const store = require("../reduxStore");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// send state file as JSON to client
router.get("/", (req, res) => {
  // create file
  fs.writeFile(
    path.resolve("./state.txt"),
    JSON.stringify(store.getState()),
    (err) => {
      if (err) {
        res.status(500).send({
          error: "Error while writing state file",
        });
      } else {
        // send file to client
        res.download(path.resolve("./state.txt"));
      }
    }
  );
});

module.exports = router;

const express = require("express");
const store = require("../reduxStore");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// scan for new files and dispatch to store
router.get("/", (req, res) => {
  fs.readdir(path.resolve("./files"), (err, files) => {
    if (err) {
      res.status(500).send({
        error: "Error while scanning files",
      });
    } else {
      // change old files to inactive if they ar not available anymore
      const oldFiles = store.getState().map((file) => {
        if (!files.includes(file.name)) {
          return {
            name: file.name,
            active: false,
          };
        } else {
          return file;
        }
      });
      // change new files to objects, concat old + new files and filter duplicates
      const newFiles = files
        .map((file) => ({
          name: file,
          active: true,
        }))
        .concat(oldFiles)
        .filter((file, index, self) => {
          return index === self.findIndex((t) => t.name === file.name);
        });

      // dispatch new files to store
      store.dispatch({ type: "SCAN_FILES", payload: newFiles });
      res.status(200).send({ result: "Files scanned" });
    }
  });
});

module.exports = router;

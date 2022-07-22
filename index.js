const express = require("express");
const { configureStore } = require("@reduxjs/toolkit");
const fs = require("fs");
const path = require("path");

// app config
const app = express();
const PORT = 3000;

// store reducer
const files = (files = [], action) => {
  switch (action.type) {
    case "GET_FILES":
      return action.payload;
    case "SCAN_FILES":
      return action.payload;
    default:
      return files;
  }
};

// creating store
const store = configureStore({ reducer: files });

// get all files from files dir and dispatch to store on server start
fs.readdir(path.resolve("./files"), (err, files) => {
  if (err) {
    console.log(err);
  } else {
    const newFiles = files.map((file) => ({
      name: file,
      active: true,
    }));
    store.dispatch({ type: "GET_FILES", payload: newFiles });
  }
});

// send store data to client
app.get("/list", (req, res) => {
  res.status(200).send(store.getState());
});

// scan for new files and dispatch to store
app.get("/scan", (req, res) => {
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

// send state file as JSON to client
app.get("/download-state", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}/`);
});

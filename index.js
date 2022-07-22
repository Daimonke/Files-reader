const express = require("express");
const fs = require("fs");
const path = require("path");
const listRouter = require("./routes/list");
const scanRouter = require("./routes/scan");
const downloadStateRouter = require("./routes/download_state");
const store = require("./reduxStore");

// app config
const app = express();
const PORT = 3000;

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

app.use("/list", listRouter);
app.use("/scan", scanRouter);
app.use("/download-state", downloadStateRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}/`);
});

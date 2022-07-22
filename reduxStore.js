const { configureStore } = require("@reduxjs/toolkit");

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
module.exports = store;

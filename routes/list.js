const express = require("express");
const store = require("../reduxStore");

const router = express.Router();

// send store data to client
router.get("/", (req, res) => {
  res.status(200).send(store.getState());
});

module.exports = router;

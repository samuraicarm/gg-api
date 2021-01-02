const express = require("express");
const app = express();

app.use((req, res) => {
  res.send("hello word!");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };

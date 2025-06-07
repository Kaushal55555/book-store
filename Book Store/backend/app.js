const express = require("express");
const routes = require("./routes/route.js");
const cors = require("cors");

const app = express();
const PORT = 8808;

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});

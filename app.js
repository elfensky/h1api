import express from "express";

// create and configure express
const app = express(); // create an express instance
app.use(express.static("public")); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.set("view engine", "pug"); // set the view engine to pug

const port = 3000;

app.get("/", (req, res) => {
  // res.send("Hello World!");
  res.render("index", { title: "Hey", message: "Hello there!" });
});

app.post("/", (req, res) => {
  res.send("Got a POST request");
});

app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const { User, Category, Note } = db.models;
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.get("/", (req, res, next) => res.sendFile(path.join(__dirname, "/public")));

app.get("/api/users", (req, res, next) => {
  User.findAll()
    .then(users => res.send(users))
    .catch(next);
});

app.get("/api/categories", (req, res, next) => {
  Category.findAll()
    .then(categories => res.send(categories))
    .catch(next);
});

app.get("/api/notes", (req, res, next) => {
  Note.findAll()
    .then(notes => res.send(notes))
    .catch(next);
});

db.syncAndSeed()
  .then(() => app.listen(port, () => console.log(`listen on port ${port}`)))
  .catch(ex => console.log(ex));

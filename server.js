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

app.post("/api/notes", (req, res, next) => {
  Note.creare(req.body)
    .then(note => res.status(201).send(note))
    .catch(next);
});

app.put("/api/notes/:id", async (req, res, next) => {
  try {
    const instance = await Note.findByPk(req.params.id);
    Object.assign(instance, req.body);
    await instance.save();
    res.send(instance);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByPk(req.params.id)
    .then(note => note.destroy())
    .then(() => res.sendStatus(204))
    .catch(next);
});

db.syncAndSeed()
  .then(() => app.listen(port, () => console.log(`listen on port ${port}`)))
  .catch(ex => console.log(ex));

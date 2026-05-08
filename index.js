const express = require("express");
const morgan = require("morgan");
// const cors = require('cors')

const Person = require("./models/persons");

const app = express();

app.use(express.static("dist"));

app.use(express.json());
// app.use(cors())

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan("tiny", { skip: (req) => req.method === "POST" }));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
    { skip: (req) => req.method !== "POST" },
  ),
);

app.get("/api/persons/", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/info", (req, res) => {
  let count;
  Person.find({}).then((persons) => {
    length = persons.length;
  });
  res.send(
    `<p>Phonebook has info for ${length} people</p> <p>${new Date()}</p>`,
  );
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findById(req.params.id)
    .then((person) => {
      if (!person) return response.status(404).end();

      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => res.json(updatedPerson));
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

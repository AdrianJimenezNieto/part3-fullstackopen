require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

morgan.token('body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// MIDDLEWARE
const unkownEndpoint = (request, response) => {
  response.status(404).end();
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// ROUTES

// INFO ROUTE
app.get('/info', (request, response, next) => {
  Person
    .find({})
    .then((persons) => {
      const entries = persons.length;
      const time = new Date(Date.now());
      response.end(
        `
        <p>Phonebook has info for ${entries} people<p>
        <p>${time.toUTCString()}<p>
        `,
      );
    })
    .catch((error) => next(error));
});

// GET ALL PEOPLE
app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

// GET JUST A PERSON
app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// DELETE A PERSON
app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// CREATE PERSON
app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  if (!body.name) {
    return response.status(400).send({
      error: 'name missing',
    });
  }
  if (!body.number) {
    return response.status(400).send({
      error: 'number missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((newPerson) => {
      response.json(newPerson);
    })
    .catch((error) => next(error));
});

// UPDATE PERSON
app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then((newPerson) => {
      response.json(newPerson);
    })
    .catch((error) => next(error));
});

// MIDDLEWARE CALLS
app.use(unkownEndpoint);
app.use(errorHandler);

// RUNNING THE APP
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

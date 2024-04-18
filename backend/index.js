require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())


morgan.token('body', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// GET ALL PEOPLE
app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})


// ROUTES
// INFO ROUTE
app.get('/info', (request, response) => {
  const entries = persons.length
  const time = new Date(Date.now())

  response.end(
    `
    <p>Phonebook has info for ${entries} people<p>
    <p>${time.toUTCString()}<p>
    `
  )
})

// GET JUST AN ENTRY
app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      response.status(404).json({
        error: 'person not found'
      })
    })
})

// DELETE AN ENTRY
app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// CREATE AN ENTRY
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).send({
      error: 'name missing'
    })
  }
  else if (!body.number) {
    return response.status(400).send({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(newPerson => {
      response.json(newPerson)
    })
    .catch(error => next(error))
})

// RUNNING THE APP
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
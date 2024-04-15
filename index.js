const express = require('express')
const app = express()

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// GET ALL ENTRIES
app.get('/api/persons', (request, response) => {
  response.status(200).json(persons)
})

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
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({
      error: 'Person not found'
    })
  }
})

// DELETE AN ENTRY
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

// RUNNING THE APP
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
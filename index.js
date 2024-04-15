const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

morgan.token('body', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// GENERATE ID
const generateId = () =>{
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

// CHECK NAMES
const checkName = (name) => {
  return persons.map(person => person.name).includes(name)
}

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

// CREATE AN ENTRY
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  else if (checkName(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

// RUNNING THE APP
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
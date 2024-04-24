const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required.']
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        const acceptedVals = /^[0-9]+$/
        const numbers = v.split('-')
        if (numbers.length === 2){
          if (numbers[0].match(acceptedVals) && numbers[1].match(acceptedVals)){
            console.log('llego aqui')
            if (numbers[0].length === 2 || numbers[0].length === 3){
              return true
            }
          }
        }
        return false
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required.']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
const mongoose = require('mongoose') // this higher level api is easier than the official MongoDB Node.js driver

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)

  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function (v) {
        if (v.length < 8) {
          return false
        }

        const correctFormat =
          /^\d{2,6}-\d{2,6}$/.test(v) &&
          v.replace(/\D/g, '').length === 8

        if (correctFormat) {
          return true
        }

        return false

      },
      message: (props) => `${props.value} is shorter than the minimum allowed length (8)`,
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)

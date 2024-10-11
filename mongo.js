const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://songzj:${password}@cluster0.7x60w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false);

mongoose.connect(url)

const NoteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

NoteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

const Note = mongoose.model('Note', NoteSchema)

const note = new Note({
    content: 'HTML is Easy',
    important: true,
})

// Note.find({important: true}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })

note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})
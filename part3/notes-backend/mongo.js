const { urlencoded } = require("express");
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

// when code is run with the command node mongo.js yourPassword
const password = process.argv[2];
const encodedPassword = encodeURIComponent(password);

const url = `mongodb+srv://devmanojkumar08:${encodedPassword}@cluster0.mshgp.mongodb.net/noteApp
  ?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// This is a model
const Note = mongoose.model("Note", noteSchema);

// an instance of a model is a 'document'
// Models are constructor functions that create new JavaScript objects based on the provided parameters
const note = new Note({
  content: "HTML is easy",
  important: true,
});

// Saving the object to the database
// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close(); // If the connection is not closed, the connection remains open until the program terminates.
// });

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

const mongoose = require("mongoose");

if (process.argv.length != 3 && process.argv.length != 5) {
  console.log("provide all the required params!");
  process.exit(1);
}

const password = process.argv[2];
const encodedPassword = encodeURIComponent(password);

const url = `mongodb+srv://devmanojkumar08:${encodedPassword}@cluster0.mshgp.mongodb.net/phonebook
  ?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
});

//If you define a model with the name Person, mongoose will automatically name the associated collection as people.
const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 5) {

  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    id: `${Math.round(Math.random() * 1000000)}`,
    name: `${name}`,
    number: `${number}`,
  });

  person.save().then((res) => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length == 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}



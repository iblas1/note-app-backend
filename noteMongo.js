const mongoose = require("mongoose");

const url = process.env.NOTEMONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then((res) => console.log("connected to mongoDB"))
  .catch((err) => console.log("error connecting", err.message));
const Schema = mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

Schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Note = mongoose.model("Note", Schema);

module.exports = Note;

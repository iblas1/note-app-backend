const express = require("express");
const app = express();
const morgan = require("morgan");

const contacts = require("./contactsData");
const contactsLength = contacts.length;

app.use(express.json());
morgan.token("reqData", function (req, res) {
  return JSON.stringify(req.body);
});
// app.use(morgan("tiny"));
app.get("/api/persons", (req, res) => {
  res.json(contacts);
  res.end();
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const singleContact = contacts.find((contact) => contact.id === +id);
  if (singleContact) {
    return res.json(singleContact);
  }

  res.status(404).send("pls enter a valid id");
});

app.get("/info", morgan("tiny"), (req, res) => {
  res.send(
    `<p> Phonebook has info for ${contactsLength} people </p> <p>${new Date()}</p>`
  );
});

const randomNo = Math.floor(Math.random() * 1000 + 1);
app.post(
  "/api/persons",
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqData"
  ),
  (req, res) => {
    const content = req.body;
    //   console.log(content);

    const { name, number } = content;
    if (name === "" || number === "") {
      return res.send("provide name and number");
    }
    const changedContent = { id: randomNo, ...content };

    res.json(contacts.concat(changedContent));
  }
);

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const singleContact = contacts.find((contact) => contact.id === +id);
  if (singleContact) {
    const filteredContacts = contacts.filter((contact) => contact.id !== +id);
    return res.json(filteredContacts);
  }
  res.status(404).send("pls check the id field");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});

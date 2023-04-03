const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
const httpServer = http.Server(app);

const exampleCards = [
    {
        name: "Hugo",
        age: 99,
        favoriteField: "Aerodynamics"
    },
    {
        name: "Oskar",
        age: 0,
        favoriteField: "Gravity"
    }
];

const exampleMessages = [
    {
        user1: "Hugo",
        user2: "Oskar",
        value: "Hej Oskar"
    },
    {
        user1: "Oskar",
        user2: "Hugo",
        value: "Hej Hugo"
    }
];

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/get_cards", (req, res) => {
    return res.json(JSON.stringify(exampleCards));
});

app.get("/get_messages", (req, res) => {
    return res.json(JSON.stringify(exampleMessages));
}); 

app.post("/login", (req, res) => {
    console.log(req.body);
    return;
});

app.post("/send_message", (req, res) => {
    console.log(req.body);
    return
});

app.post("/register", (req, res) => {
    console.log(req.body);
});

httpServer.listen(8080, () => {
    console.log("server running")
});

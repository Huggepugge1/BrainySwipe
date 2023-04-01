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

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/get_cards", (req, res) => {
    return res.json(JSON.stringify(exampleCards))
});

app.post("/login", (req, res) => {
    console.log(req.body);
});

httpServer.listen(8080, () => {
    console.log("server running")
});

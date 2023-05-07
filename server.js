const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { createHash, randomBytes } = require('crypto');

// return hash of string (password)
const hash = (string) => {
    return createHash('sha256').update(string).digest('hex');
}

const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const httpServer = http.Server(app);

const messages = [
    {
        user1: "Huggepugge",
        user2: "OGL",
        value: "Hej Oskar"
    },
    {
        user1: "OGL",
        user2: "Oliver",
        value: "Hej Oliver"
    },
    {
        user1: "OGL",
        user2: "Huggepugge",
        value: "Hej Hugo"
    }
];

accounts = [
    {
        firstName: "Hugo",
        lastName: "Lindström",
        age: 99,
        username: "Huggepugge",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        fpf: "Aerodynamics"
    },
    {
        firstName: "Oskar",
        lastName: "Lindgren",
        age: 0,
        username: "OGL",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        fpf: "gravity"
    }
]

let swipes = [];

let loggedIn = [];

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public/static"));

const inStatic = (path) => {
    if (path.startsWith("/styles")
     || path.startsWith("/images")
     || path.startsWith("/js")) return true;
    
    return false;
}

// Interrupt get requests to check if logged in
app.use((req, res, next) => {
    if (req.originalUrl === "/register" || req.originalUrl == "/login" || req.originalUrl === "/register.html" || req.originalUrl === "/login" || inStatic(req.originalUrl)) return next();
    if (req.cookies.auth === undefined) {
        return res.redirect("/login");
    }

    for (let {username, auth} of loggedIn) {
        if (auth === req.cookies.auth) {
            return next();
        }
    }
    return res.redirect("/login");
});

app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (req, res) => {
    return res.sendFile(__dirname + "/public/login.html");
});

app.get("/logout", (req, res) => {
    res.clearCookie("auth");
    res.sendFile(__dirname + "/public/logout.html")
});

app.get("/register", (req, res) => {
    return res.sendFile(__dirname + "/public/register.html");
});

app.get("/profile", (req, res) => {
    return res.sendFile(__dirname + "/public/profile.html");
});

app.get("/chat", (req, res) => {
    return res.sendFile(__dirname + "/public/chat.html");
});

app.get("/get_cards", (req, res) => {
    let cards = [];
    let user = "";
    for (let acc of loggedIn) {
        if (acc.auth === req.cookies.auth)
            user = acc.username;
    }
    for (let account of accounts) {
        if (account.username != user)
            cards.push({
                name: account.firstName,
                age: account.age,
                fpf: account.fpf,
                username: account.username
            });
        
    }
    return res.json(JSON.stringify(cards));
});

app.post("/login", (req, res) => {
    for (let {username, passwordHash} of accounts) {
            if (username === req.body.username && passwordHash === hash(req.body.password)) {
                const auth = randomBytes(32).toString("hex");
                loggedIn.push({username: username, auth: auth});
                res.cookie("auth", auth);
                return res.redirect("/");
            }
    }
    return res.redirect('/login');
});

app.post("/register", (req, res) => {
    for (let field in req.body) {
        if (req.body.field === "") return res.redirect("/register.html");
    }
    accounts.push({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        username: req.body.username,
        passwordHash: hash(req.body.password),
        fpf: req.body.fpf
    });

    return res.redirect("/login");
});

app.post("/update_profile", (req, res) => {
    console.log(req.body);
    let username, user;
    for (let loggedInUser of loggedIn) {
        if (loggedInUser.auth === req.cookies.auth) {
            username = loggedInUser.username;
            break;
        }
    }

    for (let [index, currentUser] of accounts.entries()) {
        if (currentUser.username === username) {
            user = index;
        }
    }

    for (let field in req.body) {
        if (req.body[field] !== "")
            accounts[user][field] = req.body[field];
    }

    res.redirect("/profile");
});

app.get("/get_messages", (req, res) => {
    let current_messages = [];
    let user;
    for (let acc of loggedIn) {
        if (acc.auth === req.cookies.auth)
            user = acc.username;
    }
    for (let message of messages) {
        if (message.user1 === user) {
            let name = "";
            let username = "";
            for (let account of accounts) {
                if (message.user2 === account.username) {
                    name = `${account.firstName} ${account.lastName}`;
                    username = account.username;
                }
            }
            current_messages.push({
                name: name,
                username: username,
                sent: true,
                value: message.value
            });
        } else if (message.user2 === user) {
            let name = "";
            let username = "";
            for (let account of accounts) {
                if (message.user1 === account.username) {
                    name = `${account.firstName} ${account.lastName}`;
                    username = account.username;
                }
            }
            current_messages.push({
                name: name,
                username: username,
                sent: false,
                value: message.value
            });
            // Hello World
        }
    }
    return res.json(JSON.stringify(current_messages));
});

app.post("/send_message", (req, res) => {
    let user1;
    for (let user of loggedIn) {
        if (user.auth === req.cookies.auth) {
            user1 = user.username;
            break;
        }
    }
    console.log(req.body)
    messages.push({
        user1: user1,
        user2: req.body.user,
        value: req.body.message
    });
    return res.redirect(`/chat?user=${req.body.user}`)
});

app.post("/swipe_right", (req, res) => {
    let user;
    for (let acc of loggedIn) {
        if (acc.auth === req.cookies.auth)
            user = acc.username;
    }
    console.log(req.body)
    swipes.push({
        user1: user,
        user2: req.body.user
    })
    return;
});

httpServer.listen(8080, () => {
    console.log("server running")
});

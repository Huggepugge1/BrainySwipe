const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { createHash, randomBytes } = require('crypto');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "JagGillarDatabaser",
    database: "brainyswipe",
    debug: false
});


// return hash of string (password)
const hash = (string) => {
    return createHash('sha256').update(string).digest('hex');
}

const getId = (auth) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id FROM login WHERE loginhash = \"${auth}\"`, (err, result, fields) => {
            if (err) throw err;
            resolve(result[0])
        });
    });
}

const getAccounts = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM accounts', (err, result, fields) => {
            if (err) throw err;
            resolve(result)
        });
    });
}

const app = express();

const cookieParser = require("cookie-parser");
const {renderSync} = require("sass");
app.use(cookieParser());
const httpServer = http.Server(app);

const messages = [];

let swipes = [];

let loggedIn = [];

// INSERT INTO brainyswipe.accounts (firstname, lastname, age, username, passwordhash, fpf) VALUES ("Oskar", "Lindgren", 12, "OGL", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "Gravity")

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

    return pool.query(`SELECT * FROM login WHERE loginhash = \"${req.cookies.auth}\"`, (err, result, fields) => {
        if (err) throw err;
        if (result.length === 0) return res.redirect("/login");
        else return next();
    });
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
    getId(req.cookies.auth).then((id) => {
        id = id.id;
        getAccounts().then((accounts) => {
            let cards = [];
            for (let account of accounts) {
                if (account.id !== id)
                    cards.push({
                        name: account.firstname,
                        age: account.age,
                        fpf: account.fpf,
                        username: account.username
                    });
            }
            return res.json(JSON.stringify(cards));
        }).catch((err) => {
            throw err;
        });
    }).catch((err) => {
        throw err;
    })
});

app.post("/login", (req, res) => {
    pool.query(`SELECT * FROM accounts WHERE username = \"${req.body.username}\" AND passwordhash = \"${hash(req.body.password)}\"`, (err, accounts, fields) => {
        if (err) throw err;
        if (accounts.length === 1) {
            pool.query(`SELECT id FROM login WHERE id = ${accounts[0].id}`, (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    pool.query(`DELETE FROM login WHERE id = ${accounts[0].id}`, (err, result, fields) => {
                        if (err) throw err;
                    });
                }
                const auth = randomBytes(32).toString("hex");
                pool.query(`INSERT INTO login (id, loginhash) VALUES (${accounts[0].id}, \"${auth}\")`, (err, result, fields) => {
                    if (err) throw err;
                    console.log(req.body.username, "has logged in");
                    res.cookie("auth", auth);
                    return res.redirect("/");
                });
            })
        } else {
            return res.redirect("/login")
        }
    });
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

const get_account_name = (username) => {
    for (let account of accounts)
        if (account.username === username)
            return account.firstName + " " + account.lastName;
    return null;
}

const get_swipes = (user) => {
    let current_accounts = [];
    swipes.forEach(swipe1 => {
        swipes.forEach(swipe2 => {
            let inArray = false;
            if (swipe1 !== swipe2) {
                if (user === swipe1.user1) {
                    if (swipe1.user1 === swipe2.user2)
                        for (let account of current_accounts) {
                            if (account[1] === swipe1.user2) inArray = true;
                        }
                    if (!inArray) current_accounts.push([get_account_name(swipe1.user2), swipe1.user2]);
                } else if (user === swipe2.user1) {
                    if (swipe2.user1 === swipe1.user2)
                        for (let account of current_accounts) {
                            if (account[1] === swipe2.user2) inArray = true;
                        }
                    if (!inArray) current_accounts.push([get_account_name(swipe2.user2), swipe2.user2]);

                }
            }
        })
    });
    console.log(current_accounts)
    return current_accounts;
}

app.get("/get_messages", (req, res) => {
    let currentMessages = [];
    let currentAccounts = [];
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
                    let inArray = false;
                    for (let account of currentAccounts) {
                        if (account[1] === username) inArray = true;
                    }
                    if (!inArray) currentAccounts.push([name, username]);
                }
            }
            currentMessages.push({
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
                    let inArray = false;
                    for (let account of currentAccounts) {
                        if (account[1] === username) inArray = true;
                    }
                    if (!inArray) currentAccounts.push([name, username]);
                }
            }
            currentMessages.push({
                name: name,
                username: username,
                sent: false,
                value: message.value
            });
        }
    }
    get_swipes(user).forEach(currentSwipesAccounts => {
        let inArray = false;
        for (let account of currentAccounts) {
            if (currentSwipesAccounts[1] === account[1]) inArray = true;
        }
        if (!inArray) currentAccounts.push(currentSwipesAccounts);
    });
    return res.json(JSON.stringify({messages: currentMessages, accounts: currentAccounts}));
});

app.post("/send_message", (req, res) => {
    let user1;
    for (let user of loggedIn) {
        if (user.auth === req.cookies.auth) {
            user1 = user.username;
            break;
        }
    }
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
    swipes.push({
        user1: user,
        user2: req.body.user
    })
    return res.sendStatus(200);
});

httpServer.listen(8080, () => {
    console.log("server running")
});

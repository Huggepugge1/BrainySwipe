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
        pool.query(`SELECT userid FROM login WHERE auth = \"${auth}\"`, (err, result, fields) => {
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

const getSwipes = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM swipes', (err, result, fields) => {
            if (err) throw err;
            resolve(result)
        });
    });
}

const getAccount = (accounts, id) => {
    for (let account of accounts) {
        if (account.id === id) {
            return account;
        }
    }
}

const app = express();

const cookieParser = require("cookie-parser");
const {renderSync} = require("sass");
app.use(cookieParser());
const httpServer = http.Server(app);

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

    return pool.query(`SELECT * FROM login WHERE auth = \"${req.cookies.auth}\"`, (err, result, fields) => {
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
    pool.query(`DELETE FROM login WHERE auth = \"${req.cookies.auth}\"`, (err, result, fields) => {
        if (err) throw err;
    });
    res.clearCookie("auth");
    return res.sendFile(__dirname + "/public/logout.html")
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
        id = id.userid;
        getAccounts().then((accounts) => {
            getSwipes().then((swipes) => {
                let cards = [];
                    for (let account of accounts) {
                        let found = false;
                        for (let swipe of swipes)
                            if (swipe.userid1 === id && swipe.userid2 === account.id) {
                                found = true;
                                break;
                            }
                        if (!found && account.id !== id)
                            cards.push({
                                name: account.firstname,
                                age: account.age,
                                fpf: account.fpf,
                                username: account.username
                            });
                }
            return res.json(JSON.stringify(cards));
            });
        }).catch((err) => {
            throw err;
        });
    }).catch((err) => {
        throw err;
    });
});

app.get("/get_messages", (req, res) => {
    getId(req.cookies.auth).then((id) => {
        id = id.userid;
        pool.query(`SELECT * FROM messages WHERE userid1 = \"${id}\" or userid2 = \"${id}\"`, (err, messages, field) => {
            pool.query(`SELECT * FROM swipes WHERE userid1 = \"${id}\" or userid2 = \"${id}\"`, (err, swipes, field) => {
                getAccounts().then((accounts) => {
                    console.log(swipes);
                    if (err) throw err;
                    let ret = {
                        messages: messages.map((message) => {
                            let account = id === message.userid1 ? getAccount(accounts, message.userid2) : getAccount(accounts, message.userid1)
                            return {
                                name: account.firstname + " " + account.lastname,
                                username: account.username,
                                sent: id === message.userid1,
                                value: message.message
                            }
                        }),
                        accounts: messages.map((message) => {
                            let account = id === message.userid1 ? getAccount(accounts, message.userid2) : getAccount(accounts, message.userid1);
                            return {
                                name: account.firstname + " " + account.lastname,
                                username: account.username
                            };
                        })
                    };
                    for (let swipe of swipes) {
                        if (swipe.userid1 === id) {
                            for (let swipe2 of swipes) {
                                console.log(swipe, swipe2)
                                if (swipe2.userid2 === id && swipe.userid2 === swipe2.userid1) {
                                    let account = getAccount(accounts, swipe.userid2);
                                    ret.accounts.push({
                                        name: account.firstname + " " + account.lastname,
                                        username: account.username
                                    });
                                }
                            }
                        }
                    }
                    ret.accounts = ret.accounts.filter((account, i) => {
                        let index = 0;
                        for (let acc of ret.accounts) {
                            if (acc.username === account.username)
                                return (index === i);
                            index++;
                        }
                    });
                    return res.json(JSON.stringify(ret));
                });
            });
        });
    }).catch((err) => {
        throw err;
    });
});


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

app.post("/login", (req, res) => {
    pool.query(`SELECT * FROM accounts WHERE username = \"${req.body.username}\" AND passwordhash = \"${hash(req.body.password)}\"`, (err, accounts, fields) => {
        if (err) throw err;
        if (accounts.length === 1) {
            pool.query(`SELECT auth FROM login WHERE auth = \"${req.cookies.auth}\"`, (err, result, fields) => {
               if (err) throw err;
                if (result.length > 0) {
                    pool.query(`DELETE FROM login WHERE auth = \"${req.cookies.auth}\"`, (err, result, fields) => {
                        if (err) throw err;
                    });
                }
                pool.query(`SELECT userid FROM login WHERE userid = ${accounts[0].id}`, (err, result, fields) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        pool.query(`DELETE FROM login WHERE userid = ${accounts[0].id}`, (err, result, fields) => {
                            if (err) throw err;
                        });
                    }
                    const auth = randomBytes(32).toString("hex");
                    pool.query(`INSERT INTO login (userid, auth) VALUES (${accounts[0].id}, \"${auth}\")`, (err, result, fields) => {
                        if (err) throw err;
                        console.log(req.body.username, "has logged in");
                        res.cookie("auth", auth);
                        return res.redirect("/");
                    });
                });
            });
        } else {
            return res.redirect("/login")
        }
    });
});

app.post("/register", (req, res) => {
    if (req.body.cookies === undefined) return res.redirect("/register");
    for (let field in req.body) {
        console.log(field)
        if (req.body[field] === "") return res.redirect("/register");
    }
    pool.query(`INSERT INTO accounts (firstname, lastname, age, username, passwordhash, fpf) VALUES ("${req.body.firstName}", "${req.body.lastName}", "${req.body.age}", "${req.body.username}", "${hash(req.body.password)}", "${req.body.fpf}")`, (err, result, field) => {
        if (err) throw err;
    });
    return res.redirect("/login");
});

app.post("/update_profile", (req, res) => {
    getId(req.cookies.auth).then((id) => {
        id = id.userid;
        for (let field in req.body)
            if (req.body[field] !== "") {
                if (field === "age")
                    if (typeof(req.body[field]) !== "number" && req.body[field] === Math.floor(req.body[field]))
                        pool.query(`UPDATE accounts SET ${field} = \"${req.body[field]}\" WHERE id = ${id}`, (err, result, fields) => {
                            if (err) throw err;
                        });
                else
                    pool.query(`UPDATE accounts SET ${field} = \"${req.body[field]}\" WHERE id = ${id}`, (err, result, fields) => {
                        if (err) throw err;
                    });
            }
    });

    res.redirect("/profile");
});

app.post("/send_message", (req, res) => {
    if (req.body.username === "") return res.redirect(`/chat`);
    getId(req.cookies.auth).then((id) => {
        id = id.userid;
        pool.query(`SELECT * FROM accounts`, (err, accounts, fields) => {
            let user2id;
            for (let account of accounts) {
                if (account.username === req.body.username) {
                    user2id = account.id;
                }
            }
            pool.query(`INSERT INTO messages (userid1, userid2, message) VALUES (${id}, \"${user2id}\", \"${req.body.message}\")`, (err, messages, fields) => {
                if (err) throw err;
            });
        })
    }).catch((err) => {
        throw err;
    })
    return res.redirect(`/chat?user=${req.body.username}`)
});

app.post("/swipe_right", (req, res) => {
    getId(req.cookies.auth).then((id) => {
        id = id.userid;
        getAccounts().then((accounts) => {
            let userid2;
            for (let account of accounts) {
                if (account.username === req.body.username) {
                    userid2 = account.id;
                }
            }
            pool.query(`SELECT * FROM swipes WHERE userid1 = ${id} and userid2 = ${userid2}`, (err, result, field) => {
                if (err) throw err;
                if (!(result.length > 0))
                    pool.query(`INSERT INTO swipes (userid1, userid2) VALUES (${id}, ${userid2})`, (err, result, field) => {
                        if (err) throw err;
                    });
            });
        });
    });
    return res.sendStatus(200);
});

httpServer.listen(8080, () => {
    console.log("server running")
});

const express =require('express');
const mysql = require('mysql');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require('bcrypt');
const saltRounts = 10;

const app = express();

app.use(express.json());

const corsOptions = {
    origin : '*',
    credential : 'true',
};

app.use(cors(corsOptions));
app.use(cookieParser);
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    key : "userId",
    secret : "subscribe",
    resave : false,
    saveUninitialized: false,
    cookie : {
        expires : 60 * 60 * 24,
    }
}));

const db = mysql.createConnection({
    user:'root',
    host: "localhost",
    password: "123456",
    database : "LoginSystem",
});

app.post('/register', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounts, (err, hash) => {

        if(err) {
            console.log(err);
        }
        db.query('Insert into users (username, password) values (?, ?)', 
        [username, hash], 
        (err, result) => {
            console.log(err)
        });

    })
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * from users where username = ?",
        [username],
        (err, result) => {
            if(err) {
                res.send({err : err});
            }

            if(result.length > 0) {
                 bcrypt.compare(password, result[0].password, (err, response) => {
                    if(response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result)
                    } else {
                        res.send({message : "Wrong usernme/password combination!"});
                    }
                 })
            }
            else {
                res.send( {message : "User doesn't exist"})
            }
        }
    );
});

app.listen(3001, () => {
    console.log("running server");
});

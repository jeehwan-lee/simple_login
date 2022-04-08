const express =require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(express.json());

const corsOptions = {
    origin : '*',
    credential : 'true',
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
    user:'root',
    host: "localhost",
    password: "123456",
    database : "LoginSystem",
});

app.post('/register', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    db.query('Insert into users (username, password) values (?, ?)', 
    [username, password], 
    (err, result) => {
        console.log(err)
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * from users where username = ? and password = ?",
        [username, password],
        (err, result) => {
            if(err) {
                res.send({err : err});
            }

            if(result.length > 0) {
                 res.send(result);
            }
            else {
                res.send( {message : "Wrong username/password combinations"});
            }
        }
    );
});

app.listen(3001, () => {
    console.log("running server");
});

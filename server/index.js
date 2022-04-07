const express =require('express');
const mysql = require('mysql');
const cors = rquire('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
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

    db.query('Insert into users (username, password) values (?, ?)', 
    [username, password], 
    (err, result) => {
        console.log(err)
    });
});

app.listen(3001, () => {
    console.log("running server");
});

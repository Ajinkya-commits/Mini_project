const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret:"chatbot",
	resave:true,
	saveUninitialized:true
}));

//create object for database
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Megh*2302",
	database: "chatbot",
});

//create connection to database
connection.connect(function (error) {
	if (error) {
		throw error;
	} else {
		console.log("connected to database");
	}
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/test.html");
});

app.get("/signup", function (req, res) {
	res.sendFile(__dirname + "/chatbot.html");
});

app.post("/submit",function (req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const eMail = req.body.eMail;
	const password = req.body.password;

	const query = `
	INSERT INTO login VALUES("${firstName}","${lastName}","${eMail}","${password}");`;
	connection.query(query, function (error) {
		if (error) {
			throw error;
		} else {
			req.session.loggedin = true;
			res.redirect("/");
		}
	});
});

app.get("/signin", function (req, res) {
	if(req.session.loggedin){
		res.send(`<script>alert("User already logged in!"); window.location.href="/";</script>`);
	} else {
	res.sendFile(__dirname + "/login.html");
	}
});

let userEmail;

app.post("/login",function (req, res) {
	//console.log(req.body);
	const eMail = req.body.eMail;
	const password = req.body.password;
	const query = 'SELECT * FROM login WHERE eMail = ? AND password = ?';
	connection.query(query, [eMail, password], function(error, results, fields) {
			if (error) {
				throw error;
			} if (results.length > 0) {
				req.session.loggedin = true;
				userEmail = eMail;
				res.redirect('/login');
			} else {
				res.send(`<script>alert("Incorrect email or password"); window.location.href="/signin";</script>`);
			}			
			res.end();
		});
});

app.get("/login", function (req, res) {
	res.sendFile(__dirname + "/test.html");

	res.send(`<script>alert("${userEmail} successfully Logged In!!"); window.location.href="/";</script>`);
});

app.get("/logout",function (req, res) {
	if(req.session.loggedin){
		req.session.loggedin = null;
		res.send(`<script>alert("${userEmail} successfully Logged out!"); window.location.href="/";</script>`);
		res.redirect("/");
	} else {
		res.send(`<script>alert("Please Login first!"); window.location.href="/";</script>`);
	}
});

app.get("/explore", function (req, res) {
	if(req.session.loggedin) {
		res.sendFile(__dirname + "/explore.html");
	} else {
		res.send(`<script>alert("Please Login first!"); window.location.href="/";</script>`);
	}
});

app.post("/comment",function (req, res) {
	const comment = req.body.comment;
	
	const query = `
	INSERT INTO comment (comment,eMail) VALUES("${comment}","${userEmail}");`;
	connection.query(query, function (error) {
		if (error) {
			throw error;
		} else {
			res.redirect("/explore");

			connection.query('SELECT eMail,comment FROM comment', function (error, results){
			if (error) {
				throw error;
			}
			console.log('Results:', results); // This will contain the rows data
			});
		}
	});
});


app.use(express.static(__dirname));

app.listen(4000);

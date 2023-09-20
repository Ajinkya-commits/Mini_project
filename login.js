const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
//const encoder = bodyParser.urlencoded({extended: false});

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//create object for database
const connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"Megh*2302",
	database:"chatbot"
});

//create connection to database
connection.connect(function(error){
	if (error) {
		throw error;
	}
	else {
		console.log("connected to database");
	}	
});

app.get("/",function(req,res){
	var query="SELECT * FROM login";
	res.sendFile(__dirname + "/test.html");
})

app.get("/signup",function(req,res){
	res.sendFile(__dirname + "/chatbot.html");
})

app.post("/submit",function(req,res){
	//console.log(req.body);
	//console.log(res);
	var firstName=req.body.firstName;
	var lastName=req.body.lastName;
	var eMail=req.body.eMail;
	var password=req.body.password;

	var query = `
	INSERT INTO login VALUES("${firstName}","${lastName}","${eMail}","${password}");`;
	connection.query(query,function(error){
		if(error){
			throw error;
		}
		else {
			res.redirect("test.html");
			//console.log("DONE");
		}
	})

/*	connection.query("SELECT * FROM login WHERE firstName = ? AND lastName = ? AND eMail = ? AND password = ?",[firstName,lastName,eMail,password],function(error,results,fields){
		if(results.length > 0) {
			res.redirect("/test.html");
		}
		else {
			res.redirect("/");
		}
		res.end();
	})*/
});

//after successfull login
/*app.get("/test.html",function(req,res){
	res.sendFile(__dirname + "/test.html");

})*/

app.use(express.static(__dirname));

app.listen(4000);
